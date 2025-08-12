/**
 * WeekView 메인 컴포넌트 (분할된 버전)
 * 주별 캘린더 뷰 및 일정 관리
 * 
 * @features
 * - 실시간 계획 업데이트 지원 (newPlan prop)
 * - 시간대별 일정 표시
 * - 현재 시간 표시선
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-12 - 실시간 UI 업데이트 기능 추가
 */

import { PlanResponse } from '../../../types/plan'
import { useWeekEvents, useWeekDays } from './hooks'
import { useMonthlyPlans } from '../MonthView/hooks'
import { useCalendarColors } from '../hooks/useCalendarColors'
import { WeekHeader, WeekGrid, CurrentTimeLine } from './components'

interface WeekViewProps {
  currentDate: Date
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  newPlan?: PlanResponse | null  // 실시간 UI 업데이트용
}

const WeekView = ({ currentDate, selectedDate, onDateSelect, newPlan }: WeekViewProps) => {
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
      />

      {/* 현재 시간 표시선 (오늘인 경우) */}
      <CurrentTimeLine timeLine={currentTimeLine} />
    </div>
  )
}

export default WeekView
