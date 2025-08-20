/**
 * 달력 그리드 생성 훅
 * 달력 날짜 배열 생성 및 날짜 유틸리티 함수들
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useMemo } from 'react'

interface UseCalendarDaysProps {
  currentDate: Date
  selectedDate: Date | null
}

interface UseCalendarDaysReturn {
  calendarDays: Date[]
  isCurrentMonth: (date: Date) => boolean
  isToday: (date: Date) => boolean
  isSelected: (date: Date) => boolean
}

export const useCalendarDays = ({ 
  currentDate, 
  selectedDate 
}: UseCalendarDaysProps): UseCalendarDaysReturn => {
  
  // 달력 그리드 생성
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // 이번 달 첫째 날
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    // 첫째 주 시작일 (일요일부터)
    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
    
    // 마지막 주 종료일
    const endDate = new Date(lastDayOfMonth)
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()))
    
    const days = []
    const currentDay = new Date(startDate)
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }
    
    return days
  }, [currentDate])

  // 날짜가 현재 월에 속하는지 확인
  const CheckDateIsCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth()
  }

  // 날짜가 오늘인지 확인
  const CheckDateIsToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // 날짜가 선택된 날짜인지 확인
  const CheckDateIsSelected = (date: Date): boolean => {
    return selectedDate ? date.toDateString() === selectedDate.toDateString() : false
  }

  return {
    calendarDays,
    isCurrentMonth: CheckDateIsCurrentMonth,
    isToday: CheckDateIsToday,
    isSelected: CheckDateIsSelected
  }
}
