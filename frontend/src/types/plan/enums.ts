/**
 * Plan 관련 열거형 타입들
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

/**
 * 반복 단위 열거형 (백엔드 RepeatUnit 매핑)
 */
export type RepeatUnit = 'WEEKLY' | 'MONTHLY' | 'YEARLY'

/**
 * 요일 열거형 (백엔드 DayOfWeek 매핑)
 */
export type DayOfWeek = 
  | 'MONDAY' 
  | 'TUESDAY' 
  | 'WEDNESDAY' 
  | 'THURSDAY' 
  | 'FRIDAY' 
  | 'SATURDAY' 
  | 'SUNDAY'
