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
import { PlanResponse } from '../../../types'
import { useCalendarColors } from '../hooks'
import PlanCreateModal from '../PlanCreateModal/PlanCreateModal.tsx'
import { useDayEvents, useTimeSlots, usePlanModal } from './hooks'
import { DayTimeGrid, DayPlanBlock, DayHeader, DaySidebar } from './components'
import { 
  PlanContextMenu, 
  PlanDeleteModal, 
  usePlanContextMenu, 
  usePlanDelete 
} from '../PlanDelete'

interface PlanBlock {
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
  onDateSelect: (date: Date) => void
  onEditPlan?: (plan: PlanResponse) => void
  plans: PlanResponse[]
  events?: PlanBlock[]// 실시간 UI 업데이트용
  onPlanCreated?: (plan: PlanResponse) => void
  onPlanUpdated?: (plan: PlanResponse) => void
  onRefreshMonth?: () => Promise<void>
}

const DayView = ({ 
  currentDate,
  onDateSelect, 
  onEditPlan,
  plans,
  events = [],
  onPlanCreated,
  onPlanUpdated,
  onRefreshMonth
}: DayViewProps) => {
  // 공통 색상 관리 (더 연한 투명도)
  const { getColorForPlanWithOpacity } = useCalendarColors()
  
  // 커스텀 훅들로 로직 분리
  const {
    arrangeOverlappingBlocks 
  } = useDayEvents({ currentDate, events, plans, getColorForPlan: getColorForPlanWithOpacity })
  
  const { 
    timeSlots, 
    isToday, 
    getCurrentTimePosition 
  } = useTimeSlots({ currentDate })
  
  const { 
    isModalOpen,
    editingPlan,
    handleAddPlan, 
    handleEditPlan: handleModalEditPlan,
    handleCloseModal,
    handlePlanCreated: handleInternalPlanCreated,
    handlePlanUpdated: handleInternalPlanUpdated 
  } = usePlanModal({
    onPlanCreated,
    onPlanUpdated,
    onRefreshMonth
  })

  // 컨텍스트 메뉴 및 삭제 훅
  const { contextMenu, handleContextMenu, closeContextMenu } = usePlanContextMenu()
  const { deleteModal, openDeleteModal, closeDeleteModal, handleDeleteConfirm } = usePlanDelete()

  // 계획 수정 핸들러 - 외부(CalendarPage)에서 오는 경우와 내부 모달용 통합
  const handleEditPlan = (plan: PlanResponse) => {
    if (onEditPlan) {
      // 외부 모달 사용 (CalendarPage에서 전달받은 핸들러)
      onEditPlan(plan)
    } else {
      // 내부 모달 사용 (DayView 자체 모달)
      handleModalEditPlan(plan)
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

  const eventsWithPositions = arrangeOverlappingBlocks()
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
        <DayTimeGrid 
          timeSlots={timeSlots}
          currentTimePosition={currentTimePosition}
        >
          <DayPlanBlock 
            eventsWithPositions={eventsWithPositions}
            onDateSelect={onDateSelect}
            currentDate={currentDate}
            onPlanContextMenu={handlePlanContextMenu}
          />
        </DayTimeGrid>

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

      {/* 일정 추가/수정 모달 */}
      <PlanCreateModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={currentDate}
        editPlan={editingPlan}
        onPlanCreated={handleInternalPlanCreated}
        onPlanUpdated={handleInternalPlanUpdated}
        onRefreshMonth={onRefreshMonth}
        currentDate={currentDate}
      />
    </div>
  )
}

export default DayView
