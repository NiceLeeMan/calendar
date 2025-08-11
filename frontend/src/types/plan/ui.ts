/**
 * Plan 프론트엔드 전용 타입들
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { RepeatUnit, DayOfWeek } from './enums'
import { PlanResponse } from './responses'

/**
 * 월별 일정 조회 요청 파라미터
 */
export interface MonthlyPlanParams {
  /** 년도 */
  year: number
  /** 월 (1-12) */
  month: number
}

/**
 * 일정 필터링 옵션
 */
export interface PlanFilterOptions {
  /** 시작 날짜 */
  startDate?: string
  /** 종료 날짜 */
  endDate?: string
  /** 반복 일정만 조회 */
  recurringOnly?: boolean
  /** 알람 있는 일정만 조회 */
  hasAlarmOnly?: boolean
}

/**
 * 일정 폼 데이터 (PlanCreateModal에서 사용)
 */
export interface PlanFormData {
  planName: string
  planContent: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  isRecurring: boolean
  recurringPlan: {
    repeatUnit: RepeatUnit
    repeatInterval: number
    repeatWeekdays: DayOfWeek[]
    repeatDayOfMonth: number | null
    repeatWeeksOfMonth: number[]
    repeatMonth: number | null
    repeatDayOfYear: number | null
  }
  alarms: Array<{
    alarmDate: string
    alarmTime: string
  }>
}

/**
 * 월별 일정 캐시 타입 (백엔드 캐싱 구조 지원)
 */
export interface MonthlyPlanCache {
  year: number
  month: number
  plans: PlanResponse[]
  lastUpdated: string
}
