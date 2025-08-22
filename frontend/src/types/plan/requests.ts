/**
 * Plan API 요청 타입들
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-22 - 백엔드 RecurringReqInfo 매핑 완성
 */

import { RepeatUnit, DayOfWeek } from './enums'

/**
 * 알람 요청 정보 (간소화됨)
 */
export interface AlarmReqInfo {
  /** 알람 날짜 (null이면 시작일에 설정) */
  alarmDate?: string | null
  /** 알람 시간 (HH:mm 형식) */
  alarmTime: string
}

/**
 * 반복 일정 요청 정보 (백엔드 RecurringReqInfo와 완전 매핑)
 * 
 * @JsonProperty 매핑:
 * - type → repeatUnit
 * - daysOfWeek → repeatWeekdays  
 * - dayOfMonth → repeatDayOfMonth
 * - weeksOfMonth → repeatWeeksOfMonth
 * - month → repeatMonth
 * - dayOfYear → repeatDayOfYear
 */
export interface RecurringReqInfo {
  /** 반복 단위 (백엔드: @JsonProperty("type")) */
  type: RepeatUnit
  
  /** 반복 간격 (1-20) */
  repeatInterval?: number
  
  // === 주간 반복 ===
  /** 반복 요일들 (백엔드: @JsonProperty("daysOfWeek")) */
  daysOfWeek?: DayOfWeek[]
  
  // === 월간 반복 - 방식 1: 특정 날짜 ===
  /** 매월 반복할 날짜 (1-31) (백엔드: @JsonProperty("dayOfMonth")) */
  dayOfMonth?: number | null
  
  // === 월간 반복 - 방식 2: 주차 + 요일 ===
  /** 반복할 주차들 (1-5, -1=마지막주) (백엔드: @JsonProperty("weeksOfMonth")) */
  weeksOfMonth?: number[]
  
  // === 연간 반복 ===
  /** 월 (1-12) (백엔드: @JsonProperty("month")) */
  month?: number | null
  /** 일 (1-366) (백엔드: @JsonProperty("dayOfYear")) */
  dayOfYear?: number | null
}

/**
 * 일정 생성 요청 (백엔드 PlanCreateReq 매핑)
 */
export interface PlanCreateRequest {
  /** 일정 제목 (최대 30자) */
  planName: string
  /** 일정 내용 (최대 300자) */
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
  /** 반복 설정 (반복 일정인 경우 필수) */
  recurringPlan?: RecurringReqInfo
  /** 알람 설정들 */
  alarms?: AlarmReqInfo[]
}

/**
 * 일정 수정 요청 (백엔드 PlanUpdateReq 매핑)
 */
export interface PlanUpdateRequest {
  /** 일정 제목 */
  planName?: string
  /** 일정 내용 */
  planContent?: string
  /** 시작 날짜 */
  startDate?: string
  /** 종료 날짜 */
  endDate?: string
  /** 시작 시간 */
  startTime?: string
  /** 종료 시간 */
  endTime?: string
  /** 반복 일정 여부 */
  isRecurring?: boolean
  /** 반복 설정 */
  recurringPlan?: RecurringReqInfo
  /** 알람 설정들 */
  alarms?: AlarmReqInfo[]
}
