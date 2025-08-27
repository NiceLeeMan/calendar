import { useState } from 'react'
import { signup } from '../../../../api'
import { useSignupError } from '../../../../errors'
import type { SignupFormData, SignupRequest } from '../../../../types'

export const useSignUpSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const { handleError, handleValidationError, isDuplicateFieldError } = useSignupError()

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
      // 유효성 검증 에러 처리
      const fieldErrors = handleValidationError(error)
      
      if (Object.keys(fieldErrors).length > 0) {
        // 필드 매핑 (백엔드 필드명 -> 프론트엔드 필드명)
        const mappedErrors: Record<string, string> = {}
        
        if (fieldErrors['userId']) {
          mappedErrors['username'] = fieldErrors['userId']
        }
        if (fieldErrors['userEmail']) {
          mappedErrors['email'] = fieldErrors['userEmail']
        }
        if (fieldErrors['phoneNumber']) {
          mappedErrors['phone'] = fieldErrors['phoneNumber']
        }
        if (fieldErrors['userName']) {
          mappedErrors['name'] = fieldErrors['userName']
        }
        if (fieldErrors['userPassword']) {
          mappedErrors['password'] = fieldErrors['userPassword']
        }

        onFieldErrors(mappedErrors)
      } else {
        // 중복 에러 확인
        if (isDuplicateFieldError(error, 'userEmail')) {
          onFieldErrors({ email: '이미 가입된 이메일 주소입니다.' })
        } else if (isDuplicateFieldError(error, 'userId')) {
          onFieldErrors({ username: '이미 사용중인 아이디입니다.' })
        } else if (isDuplicateFieldError(error, 'phoneNumber')) {
          onFieldErrors({ phone: '이미 등록된 전화번호입니다.' })
        } else {
          // 기타 에러 처리 (토스트로 표시)
          const errorInfo = handleError(error)
          setError(errorInfo.message)
        }
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
