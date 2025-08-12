/**
 * 캘린더 공통 색상 관리 훅
 * 모든 뷰에서 일관된 색상 사용
 * 
 * @author Calendar Team
 * @since 2025-08-12
 */

interface UseCalendarColorsReturn {
  getColorForPlan: (planId: number) => string
  getColorForPlanWithOpacity: (planId: number, opacity?: number) => string
}

export const useCalendarColors = (): UseCalendarColorsReturn => {
  // 공통 컬러 팔레트 (MonthView와 동일)
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
    'bg-blue-600', 'bg-indigo-500', 'bg-pink-500', 'bg-yellow-500',
    'bg-red-500', 'bg-teal-500', 'bg-rose-500', 'bg-cyan-500',
    'bg-lime-500', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500'
  ]

  // 투명도 없는 기본 색상
  const getColorForPlan = (planId: number): string => {
    return colors[planId % colors.length]
  }

  // 투명도가 적용된 색상 (WeekView, DayView용)
  const getColorForPlanWithOpacity = (planId: number, opacity: number = 60): string => {
    const baseColor = colors[planId % colors.length]
    return `${baseColor} bg-opacity-${opacity}`
  }

  return {
    getColorForPlan,
    getColorForPlanWithOpacity
  }
}
