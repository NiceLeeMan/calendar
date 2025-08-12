/**
 * DayView 메인 컴포넌트 (분할된 버전)
 * 일별 캘린더 뷰 및 일정 관리
 * 
 * @features
 * - 실시간 계획 업데이트 지원 (newPlan prop)
 * - 시간대별 일정 표시
 * - 일정 겹침 처리
 * - 현재 시간 표시선
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-12 - 실시간 UI 업데이트 기능 추가
 */

import React from 'react'
import { PlanResponse } from '../../../types/plan'
import { useMonthlyPlans } from '../MonthView/hooks'
import { useCalendarColors } from '../hooks/useCalendarColors'
import PlanCreateModal from '../PlanCreateModal'
import { useDayEvents, useTimeSlots, usePlanModal } from './hooks'
import { TimeGrid, EventOverlay, DayHeader, DaySidebar } from './components'

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
}

interface DayViewProps {
  currentDate: Date
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  events?: Event[]
  newPlan?: PlanResponse | null  // 실시간 UI 업데이트용
}

const DayView = ({ currentDate, selectedDate, onDateSelect, events = [], newPlan }: DayViewProps) => {
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

  const eventsWithPositions = getOverlappingEvents()
  const currentTimePosition = getCurrentTimePosition()

  return (
    <div className="flex gap-6">
      {/* 메인 캘린더 영역 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
          />
        </TimeGrid>
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
