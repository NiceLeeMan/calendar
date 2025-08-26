import { useState } from 'react'
import { login } from '../../../../api'
import { useAuthError } from '../../../../errors'
import type { LoginFormData, SigninRequest } from '../../../../types'

export const useLoginSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const { handleError } = useAuthError()

  const handleSubmit = async (
    formData: LoginFormData,
    onNavigateToMain: () => void,
    resetForm: () => void
  ) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const loginData: SigninRequest = {
        userId: formData.id,
        userPassword: formData.password
      }

      const userResponse = await login(loginData)
      
      setSuccess(true)
      console.log('로그인 성공:', userResponse)
      
      // 성공 토스트 표시
      // 성공은 에러 시스템이 아닌 별도로 처리하거나 토스트 라이브러리 사용
      
      // 메인 페이지로 이동
      setTimeout(() => {
        onNavigateToMain()
        resetForm()
      }, 1000)
      
    } catch (error) {
      const errorInfo = handleError(error)
      setError(errorInfo.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    error,
    success,
    handleSubmit
  }
}
