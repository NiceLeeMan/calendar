import { useState } from 'react'
import { signup } from '../../../../api'
import { useAuthError} from '../../../../errors'
import type { SignupFormData, SignupRequest } from '../../../../types'

export const useSignUpSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const { handleSignupError, isEmailDuplicate, isUserIdDuplicate, isPhoneDuplicate } = useAuthError()

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
      // 새로운 에러 시스템으로 처리
      const fieldErrorsFromResponse = handleSignupError(error)
      
      if (Object.keys(fieldErrorsFromResponse).length > 0) {
        // 필드 매핑 (백엔드 필드명 -> 프론트엔드 필드명)
        const mappedErrors: Record<string, string> = {}
        
        if (fieldErrorsFromResponse['userId']) {
          mappedErrors['username'] = fieldErrorsFromResponse['userId']
        }
        if (fieldErrorsFromResponse['userEmail']) {
          mappedErrors['email'] = fieldErrorsFromResponse['userEmail']
        }
        if (fieldErrorsFromResponse['userPhoneNumber']) {
          mappedErrors['phone'] = fieldErrorsFromResponse['userPhoneNumber']
        }
        if (fieldErrorsFromResponse['userName']) {
          mappedErrors['name'] = fieldErrorsFromResponse['userName']
        }
        if (fieldErrorsFromResponse['userPassword']) {
          mappedErrors['password'] = fieldErrorsFromResponse['userPassword']
        }

        onFieldErrors(mappedErrors)
      } else {
        // 필드별 에러가 없으면 error state에 메시지 설정 (이미 토스트로 표시됨)
        if (isEmailDuplicate(error)) {
          onFieldErrors({ email: '이미 가입된 이메일 주소입니다.' })
        } else if (isUserIdDuplicate(error)) {
          onFieldErrors({ username: '이미 사용중인 아이디입니다.' })
        } else if (isPhoneDuplicate(error)) {
          onFieldErrors({ phone: '이미 등록된 전화번호입니다.' })
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
