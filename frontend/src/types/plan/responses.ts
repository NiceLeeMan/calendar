/**
 * Plan API 응답 타입들
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { RepeatUnit, DayOfWeek } from './enums'

/**
 * 알람 응답 정보 (간소화됨 - 날짜/시간만)
 */
export interface AlarmResInfo {
  /** 알람 날짜 (yyyy-MM-dd 형식) */
  alarmDate: string
  /** 알람 시간 (HH:mm 형식) */
  alarmTime: string
}

/**
 * 반복 일정 응답 정보 (백엔드 RecurringResInfo 매핑)
 */
export interface RecurringResInfo {
  /** 반복 ID */
  id: number
  /** 반복 단위 */
  repeatUnit: RepeatUnit
  /** 반복 간격 */
  repeatInterval: number
  
  // 주간 반복
  /** 반복 요일들 */
  repeatWeekdays?: DayOfWeek[]
  
  // 월간 반복
  /** 매월 반복할 날짜 */
  repeatDayOfMonth?: number | null
  /** 반복할 주차들 */
  repeatWeeksOfMonth?: number[]
  
  // 연간 반복
  /** 월 */
  repeatMonth?: number | null
  /** 일 */
  repeatDayOfYear?: number | null
  
  /** 예외 날짜들 */
  exceptionDates?: string[]
  /** 반복 종료 날짜 */
  endDate?: string | null
}

/**
 * 일정 응답 (백엔드 PlanResponse 매핑)
 */
export interface PlanResponse {
  /** 일정 ID */
  id: number
  /** 일정 제목 */
  planName: string
  /** 일정 내용 */
  planContent?: string
  /** 시작 날짜 (yyyy-MM-dd) */
  startDate: string
  /** 종료 날짜 (yyyy-MM-dd) */
  endDate: string
  /** 시작 시간 (HH:mm) */
  startTime: string
  /** 종료 시간 (HH:mm) */
  endTime: string
  /** 반복 일정 여부 */
  isRecurring: boolean
  /** 반복 정보 (반복 일정인 경우) */
  recurringResInfo?: RecurringResInfo
  /** 알람 정보들 (간소화됨) */
  alarms?: AlarmResInfo[]
  /** 생성 일시 */
  createdAt: string
  /** 수정 일시 */
  updatedAt: string
  /** 사용자 ID */
  userId: number
  /** 사용자 이름 */
  userName: string
}
