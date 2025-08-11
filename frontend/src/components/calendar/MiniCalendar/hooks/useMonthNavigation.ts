/**
 * 미니 캘린더 월 네비게이션 훅
 * 이전/다음 월 이동 및 빠른 이동 로직
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useState } from 'react'

interface UseMonthNavigationProps {
  currentDate: Date
  onDateSelect: (date: Date) => void
}

interface UseMonthNavigationReturn {
  viewDate: Date
  setViewDate: (date: Date) => void
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  goToToday: () => void
  goToCurrentMonth: () => void
  handleDateClick: (date: Date) => void
}

export const useMonthNavigation = ({ 
  currentDate, 
  onDateSelect 
}: UseMonthNavigationProps): UseMonthNavigationReturn => {

  const [viewDate, setViewDate] = useState(new Date(currentDate))

  // 이전 월로 이동
  const goToPreviousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  // 다음 월로 이동
  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  // 오늘로 이동
  const goToToday = () => {
    const today = new Date()
    setViewDate(today)
    onDateSelect(today)
  }

  // 현재 선택된 날짜의 월로 이동
  const goToCurrentMonth = () => {
    setViewDate(new Date(currentDate))
  }

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    onDateSelect(date)
  }

  return {
    viewDate,
    setViewDate,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    goToCurrentMonth,
    handleDateClick
  }
}
