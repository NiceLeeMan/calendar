import { useState } from 'react'
import { sendEmailVerification, verifyEmailCode } from '../../../../api'
import { useSignupError } from '../../../../errors'
import type { EmailVerificationState } from '../../../../types'

export const useEmailVerification = () => {
  const [emailState, setEmailState] = useState<EmailVerificationState>({
    email: '',
    verificationSent: false,
    emailVerified: false,
    isLoading: false,
    error: null,
    expiresAt: null
  })

  const [showResendModal, setShowResendModal] = useState(false)
  
  const { handleError, isDuplicateFieldError } = useSignupError()

  const sendVerificationCode = async (email: string) => {
    setEmailState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const message = await sendEmailVerification(email)
      
      setEmailState(prev => ({
        ...prev,
        email: email,
        verificationSent: true,
        isLoading: false,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5분 후 만료
      }))
      
      console.log('이메일 인증 발송 성공:', message)
      // 성공 메시지는 별도 토스트나 알림으로 표시
      return { success: true, error: null }
    } catch (error) {
      // 중복 체크 에러 처리
      if (isDuplicateFieldError(error, 'userEmail')) {
        const errorMessage = '이미 가입된 이메일 주소입니다.'
        setEmailState(prev => ({
          ...prev,
          isLoading: false,
          error: null
        }))
        return { success: false, error: errorMessage, isDuplicate: true }
      }

      // 기타 에러 처리
      const errorInfo = handleError(error)
      setEmailState(prev => ({
        ...prev,
        isLoading: false,
        error: errorInfo.message
      }))
      return { success: false, error: errorInfo.message, isDuplicate: false }
    }
  }

  const handleEmailVerification = async (email: string) => {
    if (!email) return

    // 이미 전송된 경우 재전송 모달 표시
    if (emailState.verificationSent) {
      setShowResendModal(true)
      return
    }

    return await sendVerificationCode(email)
  }

  const handleVerificationCheck = async (email: string, verificationCode: string) => {
    if (!email || !verificationCode) return

    setEmailState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const message = await verifyEmailCode(email, verificationCode)
      
      setEmailState(prev => ({
        ...prev,
        emailVerified: true,
        isLoading: false,
        error: null
      }))
      
      console.log('이메일 인증 확인 성공:', message)
      return { success: true, error: null }
    } catch (error) {
      const errorInfo = handleError(error)
      
      setEmailState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }))
      return { success: false, error: errorInfo.message }
    }
  }

  const handleResendConfirm = (email: string) => {
    setShowResendModal(false)
    return sendVerificationCode(email)
  }

  const handleResendCancel = () => {
    setShowResendModal(false)
  }

  // 이메일 변경 시 인증 상태 초기화
  const resetEmailVerification = () => {
    setEmailState(prev => ({
      ...prev,
      verificationSent: false,
      emailVerified: false,
      error: null
    }))
  }

  return {
    emailState,
    showResendModal,
    handleEmailVerification,
    handleVerificationCheck,
    handleResendConfirm,
    handleResendCancel,
    resetEmailVerification
  }
}
