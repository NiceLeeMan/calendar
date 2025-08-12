/**
 * MonthView 메인 컴포넌트 (분할된 버전)
 * 월별 캘린더 표시 및 일정 관리
 * 
 * @features
 * - 실시간 계획 추가 지원 (newPlan prop)
 * - 애니메이션 효과
 * - 일정 색상 자동 할당
 * - 로딩 및 에러 상태 처리
 * - 우클릭 삭제/수정 컨텍스트 메뉴
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */


import { PlanResponse } from '../../../types/plan'
import { useMonthlyPlans, useCalendarDays, useCalendarAnimation } from './hooks'
import { 
  PlanContextMenu, 
  PlanDeleteModal, 
  usePlanContextMenu, 
  usePlanDelete 
} from '../PlanDelete'

interface MonthViewProps {
  currentDate: Date
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onEditPlan?: (plan: PlanResponse) => void
  newPlan?: PlanResponse | null  // 실시간 UI 업데이트용
}

const MonthView = ({ currentDate, selectedDate, onDateSelect, onEditPlan, newPlan }: MonthViewProps) => {
  // 커스텀 훅들로 로직 분리
  const {
    isLoading, 
    error, 
    getPlansForDate, 
    getColorForPlan 
  } = useMonthlyPlans({ currentDate, newPlan })
  
  const { 
    calendarDays, 
    isCurrentMonth, 
    isToday, 
    isSelected 
  } = useCalendarDays({ currentDate, selectedDate })
  
  const { 
    isAnimating, 
    animationDirection, 
    previousDate, 
    generateCalendarDays 
  } = useCalendarAnimation({ currentDate })

  // 컨텍스트 메뉴 및 삭제 훅
  const { contextMenu, handleContextMenu, closeContextMenu } = usePlanContextMenu()
  const { deleteModal, openDeleteModal, closeDeleteModal, handleDeleteConfirm } = usePlanDelete()

  // 계획 수정 핸들러
  const handleEditPlan = (plan: PlanResponse) => {
    if (onEditPlan) {
      onEditPlan(plan)
    } else {
      console.log('수정 기능이 연결되지 않았습니다:', plan.planName)
    }
  }

  // 계획 삭제 핸들러
  const handleDeletePlan = (plan: PlanResponse) => {
    openDeleteModal(plan)
  }

  // 달력 콘텐츠 렌더링 함수
  const renderCalendarGrid = (days: Date[], isCurrentCalendar: boolean = true) => {
    return days.map((date, index) => {
      const dayPlans = getPlansForDate(date)
      const isCurrentMonthDay = isCurrentCalendar ? 
        isCurrentMonth(date) : 
        date.getMonth() === previousDate.getMonth()
      const isTodayDay = isToday(date)
      const isSelectedDay = isSelected(date)
      const dateString = date.toISOString().split('T')[0]

      return (
        <div
          key={`${date.getTime()}-${index}`}
          onClick={() => onDateSelect(date)}
          className={`min-h-[120px] p-2 border-r border-b border-gray-100 cursor-pointer transition-colors hover:bg-blue-50 ${
            !isCurrentMonthDay ? 'bg-gray-50' : ''
          } ${
            isSelectedDay ? 'bg-blue-100 ring-2 ring-blue-500 ring-inset' : ''
          }`}
        >
          {/* 날짜 숫자 */}
          <div className="flex justify-between items-start mb-1">
            <span
              className={`text-sm font-medium ${
                !isCurrentMonthDay
                  ? 'text-gray-400'
                  : isTodayDay
                  ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold'
                  : 'text-gray-700'
              }`}
            >
              {date.getDate()}
            </span>
            
            {/* 일정 개수 표시 */}
            {dayPlans.length > 0 && (
              <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                {dayPlans.length}
              </span>
            )}
          </div>

          {/* 일정 목록 */}
          <div className="space-y-1">
            {dayPlans.slice(0, 3).map((plan) => (
              <div
                key={plan.id}
                className={`text-xs px-2 py-1 rounded text-white truncate font-medium ${
                  getColorForPlan(plan.id)
                } cursor-pointer hover:opacity-80 transition-opacity relative z-10`}
                title={`${plan.planName} ${plan.startTime ? `(${plan.startTime} - ${plan.endTime})` : ''}`}
                onContextMenu={(e) => handleContextMenu(e, plan, dateString)}
                onClick={(e) => {
                  e.stopPropagation() // 날짜 선택 이벤트 방지
                }}
                style={{ 
                  minHeight: '20px',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
              >
                {plan.planName}
              </div>
            ))}
            
            {/* 추가 일정이 있는 경우 */}
            {dayPlans.length > 3 && (
              <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded truncate">
                +{dayPlans.length - 3} more
              </div>
            )}
          </div>
        </div>
      )
    })
  }

  const previousCalendarDays = generateCalendarDays(previousDate)
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
      {/* 로딩 상태 표시 */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-gray-600">일정을 불러오는 중...</span>
          </div>
        </div>
      )}

      {/* 에러 상태 표시 */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error} (더미 데이터를 표시합니다)</p>
            </div>
          </div>
        </div>
      )}

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`py-3 text-center text-sm font-semibold ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 - 슬라이드 애니메이션 컨테이너 */}
      <div className="relative overflow-hidden">
        {/* 현재 달력 */}
        <div 
          className={`grid grid-cols-7 transition-transform duration-300 ease-in-out ${
            isAnimating 
              ? animationDirection === 'left' 
                ? 'transform -translate-x-full' 
                : 'transform translate-x-full'
              : 'transform translate-x-0'
          }`}
        >
          {renderCalendarGrid(calendarDays)}
        </div>

        {/* 이전/다음 달력 (애니메이션 중에만 표시) */}
        {isAnimating && (
          <div 
            className={`absolute top-0 left-0 w-full grid grid-cols-7 transition-transform duration-300 ease-in-out ${
              animationDirection === 'left'
                ? 'transform translate-x-0'
                : 'transform -translate-x-0'
            }`}
            style={{
              transform: animationDirection === 'left' 
                ? 'translateX(100%)' 
                : 'translateX(-100%)'
            }}
          >
            {renderCalendarGrid(previousCalendarDays, false)}
          </div>
        )}
      </div>

      {/* 컨텍스트 메뉴 */}
      {contextMenu.isOpen && contextMenu.plan && (
        <PlanContextMenu
          plan={contextMenu.plan}
          position={contextMenu.position}
          onEdit={handleEditPlan}
          onDelete={handleDeletePlan}
          onClose={closeContextMenu}
        />
      )}

      {/* 삭제 확인 모달 */}
      {deleteModal.isOpen && deleteModal.plan && (
        <PlanDeleteModal
          plan={deleteModal.plan}
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  )
}

export default MonthView
