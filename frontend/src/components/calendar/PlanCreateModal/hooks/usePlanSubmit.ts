import { useState } from 'react'
import { createPlan, convertFormDataToCreateRequest } from '../../../../api/planApi'
import { PlanResponse } from '../../../../types/plan'

export const usePlanSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (
    formData: any,
    onPlanCreated?: (plan: PlanResponse) => void,
    onClose?: () => void,
    resetForm?: () => void,
    onRefreshMonth?: () => Promise<void>, // 월별 데이터 새로고침 콜백 (fallback용)
    currentDate?: Date // 현재 달력 날짜 (사용하지 않지만 호환성 유지)
  ) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const requestData = convertFormDataToCreateRequest(formData)
      const createdPlan = await createPlan(requestData)

      if (createdPlan.isRecurring && createdPlan.recurringResInfo && onRefreshMonth) {
        // 반복 계획인 경우: 새로고침으로 서버에서 인스턴스들 받아오기
        console.log('반복 계획 생성 - 새로고침으로 서버 데이터 로드')
        await onRefreshMonth()
      } else if (!createdPlan.isRecurring && onPlanCreated) {
        // 일반 계획인 경우: 기존 방식으로 실시간 UI 업데이트
        // console.log('일반 계획 생성 - 실시간 UI 업데이트:', createdPlan)
        onPlanCreated(createdPlan)
      } else {
        // fallback: 월별 데이터 새로고침
        console.log('fallback - 월별 데이터 새로고침 실행')
        if (onRefreshMonth) {
          await onRefreshMonth()
        }
      }
      
      if (onClose) {
        onClose()
      }
      
      if (resetForm) {
        resetForm()
      }
    } catch (error) {
      console.error('일정 생성 실패:', error)
      setError(error instanceof Error ? error.message : '일정 생성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    error,
    handleSubmit
  }
}
