/**
 * 날짜 네비게이션 훅
 * 이전/다음 버튼, 오늘 버튼 로직
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

interface UseDateNavigationProps {
  currentView: 'month' | 'week' | 'day'
  currentDate: Date
  onDateChange: (date: Date) => void
}

interface UseDateNavigationReturn {
  navigatePrevious: () => void
  navigateNext: () => void
  goToToday: () => void
}

export const useDateNavigation = ({
  currentView,
  currentDate,
  onDateChange
}: UseDateNavigationProps): UseDateNavigationReturn => {

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    onDateChange(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  return {
    navigatePrevious,
    navigateNext,
    goToToday
  }
}
