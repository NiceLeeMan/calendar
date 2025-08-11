/**
 * 날짜 표시 포맷팅 훅
 * 뷰 타입별 날짜 텍스트 생성
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useMemo } from 'react'

interface UseDateDisplayProps {
  currentView: 'month' | 'week' | 'day'
  currentDate: Date
}

interface DateDisplayText {
  primary: string
  secondary: string
}

interface UseDateDisplayReturn {
  dateDisplay: DateDisplayText
}

export const useDateDisplay = ({
  currentView,
  currentDate
}: UseDateDisplayProps): UseDateDisplayReturn => {

  const dateDisplay = useMemo((): DateDisplayText => {
    switch (currentView) {
      case 'month':
        return {
          primary: currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }),
          secondary: `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`
        }
      case 'week':
        const weekStart = new Date(currentDate)
        weekStart.setDate(currentDate.getDate() - currentDate.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return {
          primary: `${weekStart.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}`,
          secondary: `Week ${Math.ceil(currentDate.getDate() / 7)}`
        }
      case 'day':
        return {
          primary: currentDate.toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long' 
          }),
          secondary: currentDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        }
      default:
        return { primary: '', secondary: '' }
    }
  }, [currentView, currentDate])

  return {
    dateDisplay
  }
}
