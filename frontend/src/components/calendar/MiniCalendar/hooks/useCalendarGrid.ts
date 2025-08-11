/**
 * 미니 캘린더 그리드 생성 훅
 * 달력 날짜 배열 생성 로직
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useMemo } from 'react'

interface UseCalendarGridProps {
  viewDate: Date
}

interface UseCalendarGridReturn {
  calendarDays: Date[]
  generateCalendarDays: () => Date[]
}

export const useCalendarGrid = ({ 
  viewDate 
}: UseCalendarGridProps): UseCalendarGridReturn => {

  // 캘린더 날짜 배열 생성
  const generateCalendarDays = (): Date[] => {
    // 현재 월의 첫째 날과 마지막 날
    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
    const lastDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
    
    // 캘린더 그리드 시작일 (이전 월의 마지막 주 포함)
    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
    
    // 캘린더 그리드 종료일 (다음 월의 첫 주 포함)
    const endDate = new Date(lastDayOfMonth)
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()))

    const days = []
    const current = new Date(startDate)
    
    while (current <= endDate) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const calendarDays = useMemo(() => generateCalendarDays(), [viewDate])

  return {
    calendarDays,
    generateCalendarDays
  }
}
