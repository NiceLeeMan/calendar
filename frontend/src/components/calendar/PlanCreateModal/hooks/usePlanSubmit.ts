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
    resetForm?: () => void
  ) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const requestData = convertFormDataToCreateRequest(formData)
      const createdPlan = await createPlan(requestData)
      
      console.log('일정 생성 성공:', createdPlan)
      
      if (onPlanCreated) {
        onPlanCreated(createdPlan)
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
