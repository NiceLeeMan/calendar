/**
 * Plan CRUD 기본 함수들
 * 백엔드 PlanController와 직접 매핑되는 API 호출 함수들
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import {
  PlanCreateRequest,
  PlanUpdateRequest,
  PlanResponse,
  MonthlyPlanParams
} from '../../types/plan'
import apiClient from '../httpClient'

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
      
      if (endMinutes <= startMinutes) {
        throw new Error('같은 날짜인 경우 종료 시간은 시작 시간 이후여야 합니다')
      }
    }

    // 반복 일정 검증
    if (planData.isRecurring && !planData.recurringPlan) {
      throw new Error('반복 일정인 경우 반복 설정이 필요합니다')
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
