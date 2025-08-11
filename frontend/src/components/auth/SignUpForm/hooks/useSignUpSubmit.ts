import { useState } from 'react'
import { signup } from '../../../../api'
import { getErrorMessage, getFieldErrors } from '../../../../utils/errorMessages'
import type { SignupFormData, SignupRequest } from '../../../../types'

export const useSignUpSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (
    formData: SignupFormData,
    isEmailVerified: boolean,
    onNavigateToLogin: () => void,
    onFieldErrors: (errors: Record<string, string>) => void,
    resetForm: () => void
  ) => {
    if (!isEmailVerified) {
      alert('이메일 인증을 완료해주세요.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // 폼 데이터를 API 요청 형식으로 변환
      const signupData: SignupRequest = {
        userName: formData.name,
        userId: formData.username,
        userPassword: formData.password,
        userEmail: formData.email,
        userPhoneNumber: formData.phone
      }

      const userResponse = await signup(signupData)
      
      setSuccess(true)
      console.log('회원가입 성공:', userResponse)
      
      // 성공 시 로그인 페이지로 이동
      setTimeout(() => {
        onNavigateToLogin()
        resetForm()
      }, 1500)

    } catch (error) {
      // 필드별 에러 처리
      const fieldErrorsFromResponse = getFieldErrors(error)
      
      if (Object.keys(fieldErrorsFromResponse).length > 0) {
        // 필드 매핑 (백엔드 필드명 -> 프론트엔드 필드명)
        const mappedErrors: Record<string, string> = {}
        
        if (fieldErrorsFromResponse['userId']) {
          mappedErrors['username'] = fieldErrorsFromResponse['userId']
        }
        if (fieldErrorsFromResponse['email']) {
          mappedErrors['email'] = fieldErrorsFromResponse['email']
        }
        if (fieldErrorsFromResponse['phoneNumber']) {
          mappedErrors['phone'] = fieldErrorsFromResponse['phoneNumber']
        }

        onFieldErrors(mappedErrors)
      } else {
        // 필드별 에러가 없으면 전체 에러 메시지 표시
        setError(getErrorMessage(error))
      }
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
