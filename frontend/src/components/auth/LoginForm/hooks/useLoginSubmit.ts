import { useState } from 'react'
import { login } from '../../../../api'
import type { LoginFormData, SigninRequest } from '../../../../types'

export const useLoginSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
      
      // 메인 페이지로 이동
      setTimeout(() => {
        onNavigateToMain()
        resetForm()
      }, 1000)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : '로그인에 실패했습니다')
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
