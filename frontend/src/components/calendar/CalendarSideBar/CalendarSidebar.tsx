/**
 * CalendarSidebar - 선택된 날짜의 일정 표시 사이드바
 * 
 * @features
 * - 선택된 날짜의 일정 목록 표시
 * - 일정 추가 버튼
 * - 우클릭 삭제/수정 컨텍스트 메뉴
 * - 일정 시간 및 통계 표시
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */


import { PlanResponse } from '../../../types/plan'
import { 
  PlanContextMenu, 
  PlanDeleteModal, 
  usePlanContextMenu, 
  usePlanDelete 
} from '../PlanDelete'

interface CalendarSidebarProps {
  selectedDate: Date | null
  plans: PlanResponse[]
  onAddPlan?: (date: Date) => void
  onEditPlan?: (plan: PlanResponse) => void
}

const CalendarSidebar = ({ selectedDate, plans, onAddPlan, onEditPlan }: CalendarSidebarProps) => {
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

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedDate ? (
            <div>
              <div>{selectedDate.toLocaleDateString('ko-KR', { 
                month: 'long', 
                day: 'numeric',
                weekday: 'long' 
              })}</div>
              <div className="text-sm font-normal text-gray-500 mt-1">
                {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric' })}
              </div>
            </div>
          ) : (
            '날짜를 선택하세요'
          )}
        </h3>
        
        {selectedDate ? (
          <div className="space-y-3">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <div 
                  key={plan.id}
                  className="p-4 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer group"
                  onContextMenu={(e) => handleContextMenu(e, plan, selectedDate.toISOString().split('T')[0])}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-blue-800 group-hover:text-blue-900 truncate">
                        {plan.planName}
                        {plan.isRecurring && (
                          <svg className="inline w-3 h-3 ml-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      {plan.startTime && (
                        <div className="text-sm text-blue-600 mt-1">
                          {plan.startTime} - {plan.endTime}
                        </div>
                      )}
                      {plan.planContent && (
                        <div className="text-sm text-gray-600 mt-1 truncate">
                          {plan.planContent}
                        </div>
                      )}
                    </div>
                    
                    {/* 일정 지속 시간 표시 */}
                    {plan.startTime && plan.endTime && (
                      <div className="ml-3 flex-shrink-0">
                        <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full">
                          {(() => {
                            const start = parseInt(plan.startTime.split(':')[0]) * 60 + parseInt(plan.startTime.split(':')[1])
                            const end = parseInt(plan.endTime.split(':')[0]) * 60 + parseInt(plan.endTime.split(':')[1])
                            const duration = end - start
                            
                            if (duration >= 60) {
                              const hours = Math.floor(duration / 60)
                              const minutes = duration % 60
                              return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`
                            } else {
                              return `${duration}분`
                            }
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-3">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  이 날에는 일정이 없습니다.
                </p>
                <button 
                  onClick={() => selectedDate && onAddPlan?.(selectedDate)}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + 일정 추가
                </button>
              </div>
            )}
            
            {plans.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{plans.length}개의 일정</span>
                  <span>
                    총 {(() => {
                      const totalMinutes = plans.reduce((acc, plan) => {
                        if (!plan.startTime || !plan.endTime) return acc
                        const start = parseInt(plan.startTime.split(':')[0]) * 60 + parseInt(plan.startTime.split(':')[1])
                        const end = parseInt(plan.endTime.split(':')[0]) * 60 + parseInt(plan.endTime.split(':')[1])
                        return acc + (end - start)
                      }, 0)
                      
                      const hours = Math.floor(totalMinutes / 60)
                      const minutes = totalMinutes % 60
                      
                      if (hours > 0) {
                        return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`
                      } else {
                        return `${minutes}분`
                      }
                    })()}
                  </span>
                </div>
                
                {/* 일정이 있어도 추가 버튼 표시 */}
                <button 
                  onClick={() => selectedDate && onAddPlan?.(selectedDate)}
                  className="w-full py-2 text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 hover:border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                >
                  + 일정 추가
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              캘린더에서 날짜를 클릭하면<br />
              해당 날짜의 일정이 표시됩니다.
            </p>
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

export default CalendarSidebar
