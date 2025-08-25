/**
 * 시간 슬롯 생성 훅
 * 24시간 시간대 생성 및 현재 시간 계산
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

interface UseTimeSlotsProps {
  currentDate: Date
}

interface UseTimeSlotsReturn {
  timeSlots: TimeSlot[]
  isToday: () => boolean
  getCurrentTimePosition: () => { topPosition: number; currentTimeLabel: string } | null
}

export const useTimeSlots = ({ 
  currentDate 
}: UseTimeSlotsProps): UseTimeSlotsReturn => {

  // 시간 슬롯 생성 (12 AM ~ 11 PM)
  const createTimeSlots = useMemo((): TimeSlot[] => {
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

  // 날짜가 오늘인지 확인
  const checkCurrentDateEqualsToday = (): boolean => {
    const today = new Date()
    return currentDate.toDateString() === today.toDateString()
  }

  // 현재 시간 위치 계산
  const calculateCurrentTimePosition = () => {
    if (!checkCurrentDateEqualsToday()) return null

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const topPosition = (currentHour * 60) + (currentMinutes / 60 * 60)
    const currentTimeLabel = now.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })

    return {
      topPosition,
      currentTimeLabel
    }
  }

  return {
    timeSlots: createTimeSlots,
    isToday: checkCurrentDateEqualsToday,
    getCurrentTimePosition: calculateCurrentTimePosition
  }
}
