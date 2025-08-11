/**
 * Plan 확장 조회 함수들
 * 기본 CRUD를 활용한 유용한 조회 기능들
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import {
  PlanResponse,
  PlanFilterOptions
} from '../../types/plan'
import { getMonthlyPlans } from './planCrud'

/**
 * 일정 검색 (클라이언트 사이드 필터링)
 * 백엔드에 검색 API가 없으므로 월별 조회 후 클라이언트에서 필터링
 * 
 * @param year 검색할 년도
 * @param month 검색할 월
 * @param options 필터링 옵션
 * @returns 필터링된 일정 목록
 */
export const searchPlans = async (
  year: number, 
  month: number, 
  options: PlanFilterOptions
): Promise<PlanResponse[]> => {
  try {
    let plans = await getMonthlyPlans({ year, month })

    // 반복 일정만 필터링
    if (options.recurringOnly) {
      plans = plans.filter(plan => plan.isRecurring)
    }

    // 알람 있는 일정만 필터링
    if (options.hasAlarmOnly) {
      plans = plans.filter(plan => plan.alarms && plan.alarms.length > 0)
    }

    // 날짜 범위 필터링
    if (options.startDate) {
      plans = plans.filter(plan => plan.startDate >= options.startDate!)
    }
    if (options.endDate) {
      plans = plans.filter(plan => plan.endDate <= options.endDate!)
    }

    return plans
  } catch (error) {
    console.error('일정 검색 실패:', error)
    throw error
  }
}

/**
 * 오늘 일정 조회
 * 현재 날짜가 포함된 월의 일정을 조회한 후 오늘 일정만 필터링
 * 
 * @returns 오늘의 일정 목록
 */
export const getTodayPlans = async (): Promise<PlanResponse[]> => {
  try {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD

    const plans = await getMonthlyPlans({ year, month })
    
    // 오늘 날짜가 일정 기간에 포함되는 일정들 필터링
    return plans.filter(plan => {
      return todayStr >= plan.startDate && todayStr <= plan.endDate
    })
  } catch (error) {
    console.error('오늘 일정 조회 실패:', error)
    throw error
  }
}
