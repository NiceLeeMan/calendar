/**
 * 미니 캘린더 날짜 유틸리티 훅
 * 날짜 비교 및 상태 확인 함수들
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

interface UseDateUtilsProps {
  viewDate: Date
  currentDate: Date
}

interface UseDateUtilsReturn {
  isCurrentMonth: (date: Date) => boolean
  isToday: (date: Date) => boolean
  isSelected: (date: Date) => boolean
}

export const useDateUtils = ({ 
  viewDate, 
  currentDate 
}: UseDateUtilsProps): UseDateUtilsReturn => {

  // 날짜가 현재 월인지 확인
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === viewDate.getMonth()
  }

  // 날짜가 오늘인지 확인
  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // 날짜가 선택된 날인지 확인
  const isSelected = (date: Date): boolean => {
    return date.toDateString() === currentDate.toDateString()
  }

  return {
    isCurrentMonth,
    isToday,
    isSelected
  }
}
