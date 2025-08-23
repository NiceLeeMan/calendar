/**
 * 일별 이벤트 유틸리티 함수들
 * 날짜 처리, 색상 관리, 공통 유틸리티
 * 
 * @author Calendar Team
 * @since 2025-08-23
 */

// =============================================================================
// 🎨 색상 관리 유틸리티
// =============================================================================

const DEFAULT_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-blue-600', 'bg-indigo-500', 'bg-pink-500', 'bg-yellow-500',
  'bg-red-500', 'bg-teal-500', 'bg-rose-500', 'bg-cyan-500'
]

export const assignColorToPlanBlock = (planId: number, getColorForPlan?: (planId: number) => string): string => {
  if (getColorForPlan) {
    return getColorForPlan(planId)
  }
  return DEFAULT_COLORS[planId % DEFAULT_COLORS.length]
}

// =============================================================================
// 📅 날짜 유틸리티
// =============================================================================

/**
 * Date 객체를 YYYY-MM-DD 문자열로 변환 (로컬 시간대 유지)
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 고유 ID 생성: planId * 100000 + (월 * 100 + 일)
 */
export const generateUniqueId = (planId: number, date: Date): number => {
  return planId * 100000 + (date.getMonth() + 1) * 100 + date.getDate()
}

/**
 * 요일 숫자를 백엔드 요일 문자열로 변환
 */
export const getDayOfWeekString = (dayNumber: number): string => {
  const dayMap: { [key: number]: string } = {
    0: 'SUNDAY', 1: 'MONDAY', 2: 'TUESDAY', 3: 'WEDNESDAY',
    4: 'THURSDAY', 5: 'FRIDAY', 6: 'SATURDAY'
  }
  return dayMap[dayNumber] || 'SUNDAY'
}

/**
 * 백엔드 요일 문자열을 숫자로 변환
 */
export const getDayOfWeekNumber = (dayOfWeek: string): number => {
  const dayMap: { [key: string]: number } = {
    'SUNDAY': 0, 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3,
    'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6
  }
  return dayMap[dayOfWeek] || 0
}

/**
 * 특정 월의 특정 주차에서 특정 요일 찾기
 */
export const findDateByWeekAndDay = (month: Date, weekOfMonth: number, dayOfWeek: string): Date | null => {
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
  const targetDayNumber = getDayOfWeekNumber(dayOfWeek)
  
  // 마지막 주 처리 (-1 또는 5 이상)
  if (weekOfMonth === -1 || weekOfMonth >= 5) {
    // 해당 월의 마지막 날부터 역순으로 찾기
    const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    const currentDate = new Date(lastDayOfMonth)
    
    while (currentDate.getMonth() === month.getMonth()) {
      if (currentDate.getDay() === targetDayNumber) {
        return new Date(currentDate)
      }
      currentDate.setDate(currentDate.getDate() - 1)
    }
    return null
  }
  
  // 첫째~넷째 주 처리
  if (weekOfMonth < 1 || weekOfMonth > 4) {
    return null
  }
  
  // 해당 월의 첫 번째 해당 요일 찾기
  let firstOccurrence = new Date(firstDayOfMonth)
  while (firstOccurrence.getDay() !== targetDayNumber) {
    firstOccurrence.setDate(firstOccurrence.getDate() + 1)
  }
  
  // 목표 주차까지 이동
  const targetDate = new Date(firstOccurrence)
  targetDate.setDate(targetDate.getDate() + (weekOfMonth - 1) * 7)
  
  // 해당 월 내에 있는지 확인
  if (targetDate.getMonth() !== month.getMonth()) {
    return null
  }
  
  return targetDate
}
