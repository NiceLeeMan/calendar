/**
 * WeekView 메인 컴포넌트 (분할된 버전)
 * 주별 캘린더 뷰 및 일정 관리
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import React from 'react'
import { useWeekEvents, useWeekDays } from './hooks'
import { WeekHeader, WeekGrid, CurrentTimeLine } from './components'

interface WeekViewProps {
  currentDate: Date
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

const WeekView = ({ currentDate, selectedDate, onDateSelect }: WeekViewProps) => {
  // 커스텀 훅들로 로직 분리
  const { 
    getEventsForDateTime, 
    getEventStyle 
  } = useWeekEvents()
  
  const { 
    weekDays, 
    timeSlots, 
    isToday, 
    isSelected, 
    getCurrentTimeLine 
  } = useWeekDays({ currentDate, selectedDate })

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
      />

      {/* 현재 시간 표시선 (오늘인 경우) */}
      <CurrentTimeLine timeLine={currentTimeLine} />
    </div>
  )
}

export default WeekView
