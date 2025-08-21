import { useState } from 'react'
import { createPlan, updatePlan, convertFormDataToCreateRequest, convertFormDataToUpdateRequest } from '../../../../api/planApi'
import { PlanResponse } from '../../../../types/plan'

export const usePlanSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (
    formData: any,
    onSuccess?: (plan: PlanResponse) => void, // 생성/수정 성공 콜백 (이름 변경)
    onClose?: () => void,
    resetForm?: () => void,
    onRefreshMonth?: () => Promise<void>, // 월별 데이터 새로고침 콜백 (fallback용)
    currentDate?: Date, // 현재 달력 날짜 (사용하지 않지만 호환성 유지)
    editPlanId?: number, // 수정할 계획 ID (있으면 수정 모드)
    originalPlan?: PlanResponse // 수정 전 원본 계획 (전환 감지용)
  ) => {
    setIsSubmitting(true)
    setError(null)

    try {
      let resultPlan: PlanResponse

      if (editPlanId) {
        // 수정 모드
        const updateRequestData = convertFormDataToUpdateRequest(formData)
        resultPlan = await updatePlan(editPlanId, updateRequestData)
        console.log('계획 수정 완료:', resultPlan)
      } else {
        // 생성 모드
        const createRequestData = convertFormDataToCreateRequest(formData)
        resultPlan = await createPlan(createRequestData)
        console.log('계획 생성 완료:', resultPlan)
      }

      // 성공 후 처리
      if (editPlanId) {
        // 수정 모드 처리
        
        // 반복 → 단일 전환 감지
        const wasRecurring = originalPlan?.isRecurring === true
        const isNowSingle = resultPlan.isRecurring === false
        const isRecurringToSingleConversion = wasRecurring && isNowSingle
        
        if (isRecurringToSingleConversion && onRefreshMonth) {
          // 반복 → 단일 전환: 새로고침으로 기존 반복 인스턴스들 제거
          console.log('반복 → 단일 전환 감지 - 새로고침으로 기존 인스턴스 제거')
          await onRefreshMonth()
        } else if (resultPlan.isRecurring && onRefreshMonth) {
          // 반복 계획 수정: 새로고침으로 서버 데이터 동기화
          console.log('반복 계획 수정 - 새로고침으로 서버 데이터 동기화')
          await onRefreshMonth()
        } else if (onSuccess) {
          // 일반 단일 → 단일 수정: 즉시 UI 업데이트
          console.log('단일 계획 수정 - 즉시 UI 업데이트')
          onSuccess(resultPlan)
        }
      } else {
        // 생성 모드
        if (resultPlan.isRecurring && resultPlan.recurringResInfo && onRefreshMonth) {
          // 반복 계획인 경우: 새로고침으로 서버에서 인스턴스들 받아오기
          console.log('반복 계획 처리 - 새로고침으로 서버 데이터 로드')
          await onRefreshMonth()
        } else if (!resultPlan.isRecurring && onSuccess) {
          // 일반 계획인 경우: 기존 방식으로 실시간 UI 업데이트
          onSuccess(resultPlan)
        } else {
          // fallback: 월별 데이터 새로고침
          console.log('fallback - 월별 데이터 새로고침 실행')
          if (onRefreshMonth) {
            await onRefreshMonth()
          }
        }
      }
      
      if (onClose) {
        onClose()
      }
      
      if (resetForm) {
        resetForm()
      }
    } catch (error) {
      console.error(editPlanId ? '일정 수정 실패:' : '일정 생성 실패:', error)
      setError(error instanceof Error ? error.message : `일정 ${editPlanId ? '수정' : '생성'}에 실패했습니다.`)
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
