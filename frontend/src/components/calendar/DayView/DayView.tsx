/**
 * DayView 메인 컴포넌트 (분할된 버전)
 * 일별 캘린더 뷰 및 일정 관리
 * 
 * @features
 * - 실시간 계획 업데이트 지원 (newPlan prop)
 * - 시간대별 일정 표시
 * - 일정 겹침 처리
 * - 현재 시간 표시선
 * - 우클릭 삭제/수정 컨텍스트 메뉴
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-12 - 실시간 UI 업데이트 기능 추가
 */

import React from 'react'
import { PlanResponse } from '../../../types/plan'
import { useMonthlyPlans } from '../MonthView/hooks'
import { useCalendarColors } from '../hooks/UseCalendarColors.ts'
import PlanCreateModal from '../PlanCreateModal'
import { useDayEvents, useTimeSlots, usePlanModal } from './hooks'
import { TimeGrid, EventOverlay, DayHeader, DaySidebar } from './components'
import { 
  PlanContextMenu, 
  PlanDeleteModal, 
  usePlanContextMenu, 
  usePlanDelete 
} from '../PlanDelete'

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
  originalPlan?: PlanResponse  // 원본 계획 데이터 추가
}

interface DayViewProps {
  currentDate: Date
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onEditPlan?: (plan: PlanResponse) => void
  events?: Event[]
  newPlan?: PlanResponse | null  // 실시간 UI 업데이트용
}

const DayView = ({ currentDate, selectedDate, onDateSelect, onEditPlan, events = [], newPlan }: DayViewProps) => {
  // 월별 계획 데이터 가져오기 (실시간 업데이트 포함)
  const { plans } = useMonthlyPlans({ currentDate, newPlan })
  
  // 공통 색상 관리 (더 연한 투명도)
  const { getColorForPlanWithOpacity } = useCalendarColors()
  
  // 커스텀 훅들로 로직 분리
  const { 
    getDayEvents, 
    getEventsForHour, 
    getEventStyle, 
    getOverlappingEvents 
  } = useDayEvents({ currentDate, events, plans, getColorForPlan: getColorForPlanWithOpacity })
  
  const { 
    timeSlots, 
    isToday, 
    getCurrentTimePosition 
  } = useTimeSlots({ currentDate })
  
  const { 
    isModalOpen, 
    handleAddPlan, 
    handleCloseModal,
    handlePlanCreated 
  } = usePlanModal()

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

  // 계획 컨텍스트 메뉴 핸들러
  const handlePlanContextMenu = (event: React.MouseEvent, plan: PlanResponse, targetDate: string) => {
    handleContextMenu(event, plan, targetDate)
  }

  const eventsWithPositions = getOverlappingEvents()
  const currentTimePosition = getCurrentTimePosition()

  return (
    <div className="flex gap-6">
      {/* 메인 캘린더 영역 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        {/* 헤더: 날짜 정보 */}
        <DayHeader 
          currentDate={currentDate} 
          isToday={isToday()}
        />

        {/* 시간 그리드와 이벤트 */}
        <TimeGrid 
          timeSlots={timeSlots}
          currentTimePosition={currentTimePosition}
        >
          <EventOverlay 
            eventsWithPositions={eventsWithPositions}
            onDateSelect={onDateSelect}
            currentDate={currentDate}
            onPlanContextMenu={handlePlanContextMenu}
          />
        </TimeGrid>

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

      {/* 미니 달력과 일정 표시 */}
      <DaySidebar 
        currentDate={currentDate}
        onDateSelect={onDateSelect}
        events={events}
        onAddPlan={handleAddPlan}
      />

      {/* 일정 추가 모달 */}
      <PlanCreateModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={currentDate}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  )
}

export default DayView
