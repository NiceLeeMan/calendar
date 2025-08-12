/**
 * WeekView 메인 컴포넌트 (분할된 버전)
 * 주별 캘린더 뷰 및 일정 관리
 * 
 * @features
 * - 실시간 계획 업데이트 지원 (newPlan prop)
 * - 시간대별 일정 표시
 * - 현재 시간 표시선
 * - 우클릭 삭제/수정 컨텍스트 메뉴
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-12 - 실시간 UI 업데이트 기능 추가
 */

import React from 'react'
import { PlanResponse } from '../../../types/plan'
import { useWeekEvents, useWeekDays } from './hooks'
import { useMonthlyPlans } from '../MonthView/hooks'
import { useCalendarColors } from '../hooks/useCalendarColors'
import { WeekHeader, WeekGrid, CurrentTimeLine } from './components'
import { 
  PlanContextMenu, 
  PlanDeleteModal, 
  usePlanContextMenu, 
  usePlanDelete 
} from '../PlanDelete'

interface WeekViewProps {
  currentDate: Date
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onEditPlan?: (plan: PlanResponse) => void
  newPlan?: PlanResponse | null  // 실시간 UI 업데이트용
}

const WeekView = ({ currentDate, selectedDate, onDateSelect, onEditPlan, newPlan }: WeekViewProps) => {
  // 월별 계획 데이터 가져오기 (실시간 업데이트 포함)
  const { plans } = useMonthlyPlans({ currentDate, newPlan })
  
  // 공통 색상 관리
  const { getColorForPlanWithOpacity } = useCalendarColors()
  
  // 커스텀 훅들로 로직 분리
  const { 
    getEventsForDateTime, 
    getEventStyle,
    getOverlappingEventsForDateTime 
  } = useWeekEvents({ plans, getColorForPlan: getColorForPlanWithOpacity })
  
  const { 
    weekDays, 
    timeSlots, 
    isToday, 
    isSelected, 
    getCurrentTimeLine 
  } = useWeekDays({ currentDate, selectedDate })

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

  const currentTimeLine = getCurrentTimeLine()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
      {/* 헤더: 요일과 날짜 */}
      <WeekHeader 
        weekDays={weekDays}
        onDateSelect={onDateSelect}
        isToday={isToday}
        isSelected={isSelected}
      />

      {/* 시간 그리드 */}
      <WeekGrid 
        timeSlots={timeSlots}
        weekDays={weekDays}
        onDateSelect={onDateSelect}
        getEventsForDateTime={getEventsForDateTime}
        getEventStyle={getEventStyle}
        getOverlappingEventsForDateTime={getOverlappingEventsForDateTime}
        onPlanContextMenu={handlePlanContextMenu}
      />

      {/* 현재 시간 표시선 (오늘인 경우) */}
      <CurrentTimeLine timeLine={currentTimeLine} />

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

export default WeekView
