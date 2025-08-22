/**
 * Plan CRUD API 함수들
 * 백엔드 PlanController와 매핑되는 API 호출 함수들
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import {
  PlanCreateRequest,
  PlanUpdateRequest,
  PlanResponse,
  MonthlyPlanParams,
  PlanFilterOptions,
  DayOfWeek,
} from '../types/plan'
import apiClient from './httpClient'

// ==================== CRUD 기본 함수들 ====================

/**
 * 월별 일정 조회
 * GET /plans/{year}/{month}
 * 
 * @param params 년도와 월 정보
 * @returns 해당 월의 모든 일정 목록
 */
export const getMonthlyPlans = async (params: MonthlyPlanParams): Promise<PlanResponse[]> => {
  try {
    const { year, month } = params
    
    // 입력값 검증
    if (month < 1 || month > 12) {
      throw new Error('월은 1-12 사이여야 합니다')
    }
    if (year < 1900 || year > 2100) {
      throw new Error('년도는 1900-2100 사이여야 합니다')
    }

    const response = await apiClient.get<PlanResponse[]>(`/plans/${year}/${month}`)
    return response.data
  } catch (error) {
    console.error('월별 일정 조회 실패:', error)
    throw error
  }
}

/**
 * 일정 생성
 * POST /plans
 * 
 * @param planData 생성할 일정 정보
 * @returns 생성된 일정 정보
 */
export const createPlan = async (planData: PlanCreateRequest): Promise<PlanResponse> => {
  try {
    // 기본 검증
    if (!planData.planName?.trim()) {
      throw new Error('일정 제목은 필수입니다')
    }
    if (planData.planName.length > 30) {
      throw new Error('일정 제목은 30자 이하여야 합니다')
    }
    if (planData.planContent && planData.planContent.length > 300) {
      throw new Error('일정 내용은 300자 이하여야 합니다')
    }

    // 날짜 검증
    const startDate = new Date(planData.startDate)
    const endDate = new Date(planData.endDate)
    if (endDate < startDate) {
      throw new Error('종료 날짜는 시작 날짜 이후여야 합니다')
    }

    // 시간 검증 (같은 날인 경우)
    if (planData.startDate === planData.endDate) {
      const [startHour, startMin] = planData.startTime.split(':').map(Number)
      const [endHour, endMin] = planData.endTime.split(':').map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      
      if (endMinutes < startMinutes) {
        throw new Error('같은 날짜인 경우 종료 시간은 시작 시간 이후이거나 같아야 합니다')
      }
    }

    // 반복 일정 검증
    if (planData.isRecurring && !planData.recurringPlan) {
      throw new Error('반복 일정인 경우 반복 설정이 필요합니다')
    }

    // 월간 반복 추가 검증
    if (planData.isRecurring && planData.recurringPlan?.type === 'MONTHLY') {
      const monthly = planData.recurringPlan
      const hasDayOfMonth = monthly.dayOfMonth
      const hasWeeksAndDays = monthly.weeksOfMonth?.length > 0 && monthly.daysOfWeek?.length > 0
      
      if (!hasDayOfMonth && !hasWeeksAndDays) {
        throw new Error('월간 반복은 특정 날짜 또는 주차+요일 중 하나를 선택해야 합니다')
      }
      
      if (hasDayOfMonth && hasWeeksAndDays) {
        throw new Error('월간 반복은 특정 날짜와 주차+요일을 동시에 설정할 수 없습니다')
      }
    }

    const response = await apiClient.post<PlanResponse>('/plans', planData)
    return response.data
  } catch (error) {
    console.error('일정 생성 실패:', error)
    throw error
  }
}

/**
 * 일정 수정
 * PUT /plans/{planId}
 * 
 * @param planId 수정할 일정 ID
 * @param planData 수정할 일정 정보
 * @returns 수정된 일정 정보
 */
export const updatePlan = async (planId: number, planData: PlanUpdateRequest): Promise<PlanResponse> => {
  try {
    if (!planId || planId <= 0) {
      throw new Error('유효한 일정 ID가 필요합니다')
    }

    // 제목 검증 (있는 경우)
    if (planData.planName !== undefined) {
      if (!planData.planName?.trim()) {
        throw new Error('일정 제목은 필수입니다')
      }
      if (planData.planName.length > 30) {
        throw new Error('일정 제목은 30자 이하여야 합니다')
      }
    }

    // 내용 검증 (있는 경우)
    if (planData.planContent !== undefined && planData.planContent && planData.planContent.length > 300) {
      throw new Error('일정 내용은 300자 이하여야 합니다')
    }

    // 날짜 검증 (둘 다 있는 경우)
    if (planData.startDate && planData.endDate) {
      const startDate = new Date(planData.startDate)
      const endDate = new Date(planData.endDate)
      if (endDate < startDate) {
        throw new Error('종료 날짜는 시작 날짜 이후여야 합니다')
      }
    }

    // 반복 일정 검증
    if (planData.isRecurring === true && !planData.recurringPlan) {
      throw new Error('반복 일정인 경우 반복 설정이 필요합니다')
    }

    // 월간 반복 추가 검증
    if (planData.isRecurring === true && planData.recurringPlan?.type === 'MONTHLY') {
      const monthly = planData.recurringPlan
      const hasDayOfMonth = monthly.dayOfMonth
      const hasWeeksAndDays = monthly.weeksOfMonth?.length > 0 && monthly.daysOfWeek?.length > 0
      
      if (!hasDayOfMonth && !hasWeeksAndDays) {
        throw new Error('월간 반복은 특정 날짜 또는 주차+요일 중 하나를 선택해야 합니다')
      }
      
      if (hasDayOfMonth && hasWeeksAndDays) {
        throw new Error('월간 반복은 특정 날짜와 주차+요일을 동시에 설정할 수 없습니다')
      }
    }

    const response = await apiClient.put<PlanResponse>(`/plans/${planId}`, planData)
    return response.data
  } catch (error) {
    console.error('일정 수정 실패:', error)
    throw error
  }
}

/**
 * 일정 삭제 (단일 일정)
 * DELETE /plans/{planId}
 * 
 * @param planId 삭제할 일정 ID
 */
export const deletePlan = async (planId: number): Promise<void> => {
  try {
    if (!planId || planId <= 0) {
      throw new Error('유효한 일정 ID가 필요합니다')
    }

    await apiClient.delete(`/plans/${planId}`)
  } catch (error) {
    console.error('일정 삭제 실패:', error)
    throw error
  }
}

// ==================== 확장 함수들 ====================

/**
 * 특정 일정 상세 조회
 * 현재 백엔드에는 없는 API이지만, 월별 조회 결과에서 필터링하여 구현
 * 
 * @param planId 조회할 일정 ID
 * @param year 해당 일정이 있는 년도
 * @param month 해당 일정이 있는 월
 * @returns 일정 상세 정보
 */
export const getPlanById = async (planId: number, year: number, month: number): Promise<PlanResponse | null> => {
  try {
    const plans = await getMonthlyPlans({ year, month })
    return plans.find(plan => plan.id === planId) || null
  } catch (error) {
    console.error('일정 상세 조회 실패:', error)
    throw error
  }
}

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

/**
 * 복수 월 일정 조회
 * 여러 달의 일정을 한 번에 조회할 때 사용
 * 
 * @param months 조회할 년월 목록
 * @returns 모든 월의 일정을 합친 목록
 */
export const getMultipleMonthsPlans = async (months: MonthlyPlanParams[]): Promise<PlanResponse[]> => {
  try {
    const promises = months.map(params => getMonthlyPlans(params))
    const results = await Promise.all(promises)
    
    // 모든 결과를 하나의 배열로 합치고 중복 제거
    const allPlans = results.flat()
    const uniquePlans = allPlans.filter((plan, index, self) => 
      self.findIndex(p => p.id === plan.id) === index
    )
    
    return uniquePlans
  } catch (error) {
    console.error('복수 월 일정 조회 실패:', error)
    throw error
  }
}

// ==================== 유틸리티 함수들 ====================

/**
 * 일정 폼 데이터를 API 요청 형식으로 변환
 * PlanCreateModal에서 사용할 변환 함수
 * 
 * @param formData 폼에서 입력된 데이터
 * @returns API 요청용 데이터
 */
export const convertFormDataToCreateRequest = (formData: any): PlanCreateRequest => {
  const request: PlanCreateRequest = {
    planName: formData.planName.trim(),
    planContent: formData.planContent?.trim() || undefined,
    startDate: formData.startDate,
    endDate: formData.endDate,
    startTime: formData.startTime,
    endTime: formData.endTime,
    isRecurring: formData.isRecurring
  }

  // 반복 설정 변환
  if (formData.isRecurring && formData.recurringPlan) {
    console.log('반복 계획 생성 변환 시작:', formData.recurringPlan)
    
    request.recurringPlan = {
      type: formData.recurringPlan.repeatUnit,
      repeatInterval: formData.recurringPlan.repeatInterval || 1
    }

    // 반복 유형별 설정 추가
    const recurring = formData.recurringPlan
    switch (recurring.repeatUnit) {
      case 'WEEKLY':
        if (recurring.repeatWeekdays?.length > 0) {
          request.recurringPlan!.daysOfWeek = recurring.repeatWeekdays as DayOfWeek[]
          console.log('주간 반복 생성 - 선택된 요일:', recurring.repeatWeekdays)
        }
        break
      case 'MONTHLY':
        // 방식 1: 특정 날짜 (dayOfMonth)
        if (recurring.repeatDayOfMonth) {
          request.recurringPlan!.dayOfMonth = recurring.repeatDayOfMonth
          console.log('월간 반복 생성 - 특정 날짜:', recurring.repeatDayOfMonth)
        } 
        // 방식 2: 주차 + 요일 (weeksOfMonth + daysOfWeek)
        else if (recurring.repeatWeeksOfMonth?.length > 0 && recurring.repeatWeekdays?.length > 0) {
          request.recurringPlan!.weeksOfMonth = recurring.repeatWeeksOfMonth
          request.recurringPlan!.daysOfWeek = recurring.repeatWeekdays as DayOfWeek[]
          console.log('월간 반복 생성 - 주차+요일:', {
            weeksOfMonth: recurring.repeatWeeksOfMonth,
            daysOfWeek: recurring.repeatWeekdays
          })
        }
        break
      case 'YEARLY':
        if (recurring.repeatMonth && recurring.repeatDayOfYear) {
          request.recurringPlan!.month = recurring.repeatMonth
          request.recurringPlan!.dayOfYear = recurring.repeatDayOfYear
          console.log('연간 반복 생성:', recurring.repeatMonth, recurring.repeatDayOfYear)
        }
        break
    }
    
    console.log('최종 반복 계획 요청 데이터:', request.recurringPlan)
  }

  // 알람 설정 변환
  if (formData.alarms?.length > 0) {
    request.alarms = formData.alarms
      .filter((alarm: any) => alarm.alarmTime) // 시간이 설정된 알람만
      .map((alarm: any) => ({
        alarmDate: alarm.alarmDate || null,
        alarmTime: alarm.alarmTime
      }))
  }

  console.log('최종 생성 요청 데이터:', request)
  return request
}

/**
 * 일정 폼 데이터를 수정 API 요청 형식으로 변환
 * PlanCreateModal의 수정 모드에서 사용할 변환 함수
 * 
 * @param formData 폼에서 입력된 데이터
 * @returns API 수정 요청용 데이터
 */
export const convertFormDataToUpdateRequest = (formData: any): PlanUpdateRequest => {
  const request: PlanUpdateRequest = {
    planName: formData.planName.trim(),
    planContent: formData.planContent?.trim() || undefined,
    startDate: formData.startDate,
    endDate: formData.endDate,
    startTime: formData.startTime,
    endTime: formData.endTime,
    isRecurring: formData.isRecurring
  }

  // 반복 설정 변환 (생성과 동일한 로직)
  if (formData.isRecurring && formData.recurringPlan) {
    console.log('반복 계획 수정 변환 시작:', formData.recurringPlan)

    const recurring = formData.recurringPlan
    
    request.recurringPlan = {
      type: recurring.repeatUnit || recurring.type,
      repeatInterval: recurring.repeatInterval || 1
    }

    // 반복 유형별 설정 추가
    switch (request.recurringPlan.type) {
      case 'WEEKLY':
        if (recurring.repeatWeekdays?.length > 0) {
          request.recurringPlan.daysOfWeek = recurring.repeatWeekdays
          console.log('주간 반복 수정 - 선택된 요일:', recurring.repeatWeekdays)
        }
        break
      case 'MONTHLY':
        // 방식 1: 특정 날짜 (dayOfMonth)
        if (recurring.repeatDayOfMonth) {
          request.recurringPlan!.dayOfMonth = recurring.repeatDayOfMonth
          console.log('월간 반복 생성 - 특정 날짜:', recurring.repeatDayOfMonth)
        } 
        // 방식 2: 주차 + 요일 (weeksOfMonth + daysOfWeek)
        else if (recurring.repeatWeeksOfMonth?.length > 0 && recurring.repeatWeekdays?.length > 0) {
          request.recurringPlan!.weeksOfMonth = recurring.repeatWeeksOfMonth
          request.recurringPlan!.daysOfWeek = recurring.repeatWeekdays as DayOfWeek[]
          console.log('월간 반복 생성 - 주차+요일:', recurring.repeatWeeksOfMonth, recurring.repeatWeekdays)
        }
        break
      case 'YEARLY':
        if (recurring.repeatMonth && recurring.repeatDayOfYear) {
          request.recurringPlan!.month = recurring.repeatMonth
          request.recurringPlan!.dayOfYear = recurring.repeatDayOfYear
        }
        break
    }
    console.log('최종 반복 계획 수정 요청 데이터:', request.recurringPlan)
  }

  // 알람 설정 변환
  if (formData.alarms?.length > 0) {
    request.alarms = formData.alarms
      .filter((alarm: any) => alarm.alarmTime) // 시간이 설정된 알람만
      .map((alarm: any) => ({
        alarmDate: alarm.alarmDate || null,
        alarmTime: alarm.alarmTime
      }))
  }

  console.log('updated request:', request)
  console.log('최종 생성 요청 데이터:', request)
  return request
}

/**
 * API 응답을 폼 데이터 형식으로 변환
 * 일정 수정 시 기존 데이터를 폼에 로드할 때 사용
 * 
 * @param planResponse API 응답 데이터
 * @returns 폼용 데이터
 */
export const convertResponseToFormData = (planResponse: PlanResponse): any => {

  const formData: any = {
    planName: planResponse.planName,
    planContent: planResponse.planContent || '',
    startDate: planResponse.startDate,
    endDate: planResponse.endDate,
    startTime: planResponse.startTime,
    endTime: planResponse.endTime,
    isRecurring: planResponse.isRecurring,
    recurringPlan: {
      repeatUnit: 'WEEKLY',
      repeatInterval: 1,
      repeatWeekdays: [],
      repeatDayOfMonth: null,
      repeatWeeksOfMonth: [],
      repeatMonth: null,
      repeatDayOfYear: null
    },
    alarms: []
  }

  // 반복 설정 변환
  if (planResponse.isRecurring && planResponse.recurringResInfo) {
    const recurring = planResponse.recurringResInfo
    formData.recurringPlan = {
      repeatUnit: recurring.repeatUnit,
      repeatInterval: recurring.repeatInterval,
      repeatWeekdays: recurring.repeatWeekdays || [],
      repeatDayOfMonth: recurring.repeatDayOfMonth,
      repeatWeeksOfMonth: recurring.repeatWeeksOfMonth || [],
      repeatMonth: recurring.repeatMonth,
      repeatDayOfYear: recurring.repeatDayOfYear
    }
  }

  // 알람 설정 변환
  if (planResponse.alarms && planResponse.alarms.length > 0) {
    formData.alarms = planResponse.alarms.map(alarm => ({
      alarmDate: alarm.alarmDate,
      alarmTime: alarm.alarmTime
    }))
  }

  return formData
}

/**
 * 일정이 특정 날짜에 해당하는지 확인
 * 캘린더에서 일정을 특정 날짜에 표시할지 판단할 때 사용
 * 
 * @param plan 확인할 일정
 * @param targetDate 확인할 날짜 (YYYY-MM-DD)
 * @returns 해당 날짜에 일정이 있으면 true
 */
export const isPlanOnDate = (plan: PlanResponse, targetDate: string): boolean => {
  return targetDate >= plan.startDate && targetDate <= plan.endDate
}

/**
 * 일정의 기간 계산 (며칠간)
 * 
 * @param plan 계산할 일정
 * @returns 기간 (일 수)
 */
export const getPlanDuration = (plan: PlanResponse): number => {
  const start = new Date(plan.startDate)
  const end = new Date(plan.endDate)
  const diffTime = end.getTime() - start.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}
