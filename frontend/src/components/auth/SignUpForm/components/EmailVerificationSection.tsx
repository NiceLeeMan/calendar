import React from 'react'
import Button from '../../../ui/Button'
import { FieldError } from '../../Common/components'
import { useEmailValidation } from '../hooks'
import type { SignupFormData, EmailVerificationState } from '../../../../types'

interface EmailVerificationSectionProps {
  formData: SignupFormData
  emailState: EmailVerificationState
  fieldErrors: Record<string, string | null>
  handleInputChange: (field: keyof SignupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailVerification: () => void
  onVerificationCheck: () => void
}

const EmailVerificationSection = ({ 
  formData, 
  emailState, 
  fieldErrors,
  handleInputChange, 
  onEmailVerification, 
  onVerificationCheck 
}: EmailVerificationSectionProps) => {
  // 이메일 유효성 검증 훅
  const {
    shouldShowError,
    handleEmailChange,
    isValid: isEmailValid,
    errorMessage: validationErrorMessage
  } = useEmailValidation({
    enableSuggestions: true,
    enableDomainTips: true,
    realtime: true,
    debounceMs: 300
  })

  // 외부 formData와 내부 검증 동기화
  React.useEffect(() => {
    handleEmailChange(formData.email)
  }, [formData.email, handleEmailChange])

  // 표시할 에러 메시지 결정 (서버 에러 > 유효성 검증 에러)
  const displayEmailError = fieldErrors.email || emailState.error || (shouldShowError ? validationErrorMessage : null)

  // 이메일 인증 버튼 활성화 조건
  const canSendVerification = formData.email && isEmailValid && !emailState.isLoading

  return (
    <>
      {/* 이메일 인증 섹션 */}
      <div className="w-full mb-8">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              value={formData.email}
              onChange={handleInputChange('email')}
              className="w-full px-0 py-3 text-base bg-transparent
                       border-0 border-b-2 border-gray-300
                       transition-all duration-200 outline-none placeholder:text-gray-400
                       focus:border-blue-500"
              required
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-200 focus-within:w-full"></div>

            {/* 유효성 검증 상태 표시 */}
            {formData.email && isEmailValid && !displayEmailError && (
              <div className="absolute right-0 top-3">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="small"
            className="h-12 px-6 whitespace-nowrap flex-shrink-0"
            onClick={onEmailVerification}
            disabled={!canSendVerification}
          >
            {emailState.isLoading ? '발송 중...' : 
             emailState.verificationSent ? '재전송' : '인증'}
          </Button>
        </div>

        {/* 에러 메시지 */}
        {displayEmailError && (
          <div className="mt-2 flex items-start">
            <svg className="h-4 w-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-600">{displayEmailError}</p>
          </div>
        )}
      </div>
      
      {/* 인증번호 입력 섹션 */}
      {emailState.verificationSent && (
        <div className="w-full mb-8">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="인증번호를 입력하세요"
                value={formData.verificationCode}
                onChange={handleInputChange('verificationCode')}
                className="w-full px-0 py-3 text-base bg-transparent
                         border-0 border-b-2 border-gray-300
                         transition-all duration-200 outline-none placeholder:text-gray-400
                         focus:border-blue-500"
                required
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-200 focus-within:w-full"></div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="small"
              className="h-12 px-6 whitespace-nowrap flex-shrink-0"
              onClick={onVerificationCheck}
              disabled={!formData.verificationCode || emailState.emailVerified || emailState.isLoading}
            >
              {emailState.isLoading ? '확인 중...' :
               emailState.emailVerified ? '인증완료' : '확인'}
            </Button>
          </div>
          
          {/* 인증번호 관련 메시지들 */}
          {emailState.emailVerified && (
            <p className="text-sm text-green-600 mt-3">
              ✓ 이메일 인증이 완료되었습니다.
            </p>
          )}
          
          <FieldError error={fieldErrors.verificationCode} />
        </div>
      )}
    </>
  )
}

export default EmailVerificationSection
