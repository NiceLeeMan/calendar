/**
 * 주간 날짜 관리 훅
 * 주간 날짜 생성, 시간 슬롯 생성, 날짜 유틸리티
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useMemo } from 'react'

interface TimeSlot {
  hour: number
  label: string
  time24: string
}

interface UseWeekDaysProps {
  currentDate: Date
  selectedDate: Date | null
}

interface UseWeekDaysReturn {
  weekDays: Date[]
  timeSlots: TimeSlot[]
  isToday: (date: Date) => boolean
  isSelected: (date: Date) => boolean
  getCurrentTimeLine: () => { topPosition: number; leftPosition: string; width: string } | null
}

export const useWeekDays = ({ 
  currentDate, 
  selectedDate 
}: UseWeekDaysProps): UseWeekDaysReturn => {

  // 시간 슬롯 생성 (12 AM ~ 11 PM)
  const timeSlots = useMemo((): TimeSlot[] => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      const time12h = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`
      slots.push({
        hour,
        label: time12h,
        time24: `${hour.toString().padStart(2, '0')}:00`
      })
    }
    return slots
  }, [])

  // 현재 주의 날짜들 생성
  const weekDays = useMemo((): Date[] => {
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay()) // 일요일로 설정
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      days.push(day)
    }
    return days
  }, [currentDate])

  // 날짜가 오늘인지 확인
  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // 날짜가 선택된 날짜인지 확인
  const isSelected = (date: Date): boolean => {
    return selectedDate ? date.toDateString() === selectedDate.toDateString() : false
  }

  // 현재 시간 라인 계산
  const getCurrentTimeLine = () => {
    const todayIndex = weekDays.findIndex(date => isToday(date))
    if (todayIndex === -1) return null

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    
    // 헤더 높이(80px) + 현재 시간까지의 높이 계산
    const topPosition = 80 + (currentHour * 64) + (currentMinutes / 60 * 64)
    const leftPosition = `${12.5 + (todayIndex * 12.5)}%`
    const width = '12.5%'

    return {
      topPosition,
      leftPosition,
      width
    }
  }

  return {
    weekDays,
    timeSlots,
    isToday,
    isSelected,
    getCurrentTimeLine
  }
}
