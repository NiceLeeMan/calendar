/**
 * DayView 메인 컴포넌트 (분할된 버전)
 * 일별 캘린더 뷰 및 일정 관리
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import React from 'react'
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
}

const DayView = ({ currentDate, selectedDate, onDateSelect, events = [] }: DayViewProps) => {
  // 커스텀 훅들로 로직 분리
  const { 
    getDayEvents, 
    getEventsForHour, 
    getEventStyle, 
    getOverlappingEvents 
  } = useDayEvents({ currentDate, events })
  
  const { 
    timeSlots, 
    isToday, 
    getCurrentTimePosition 
  } = useTimeSlots({ currentDate })
  
  const { 
    isModalOpen, 
    handleAddPlan, 
    handleCloseModal 
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2>테스트 모달</h2>
            <p>모달이 정상적으로 열렸습니다!</p>
            <button 
              onClick={handleCloseModal}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              닫기
            </button>
          </div>
        </div>
      )}
      <PlanCreateModal 
        isOpen={false}
        onClose={handleCloseModal}
        selectedDate={currentDate}
      />
    </div>
  )
}

export default DayView
