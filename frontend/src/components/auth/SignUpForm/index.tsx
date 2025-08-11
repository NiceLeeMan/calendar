import React from 'react'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import { BasicInfoSection, PhoneSection, EmailVerificationSection } from './components'
import { useSignUpForm, useFieldValidation, useEmailVerification, useSignUpSubmit } from './hooks'

interface SignUpFormProps {
  onNavigateToLogin: () => void
}

const SignUpForm = ({ onNavigateToLogin }: SignUpFormProps) => {
  const {
    formData,
    handleInputChange,
    resetForm
  } = useSignUpForm()

  const {
    fieldErrors,
    handleUserIdCheck,
    handlePhoneCheck,
    setFieldError,
    clearFieldError,
  } = useFieldValidation()

  const {
    emailState,
    showResendModal,
    handleEmailVerification,
    handleVerificationCheck,
    handleResendConfirm,
    handleResendCancel,
    resetEmailVerification
  } = useEmailVerification()

  const { 
    isSubmitting, 
    error, 
    success, 
    handleSubmit 
  } = useSignUpSubmit()

  // 입력 변경 시 에러 처리
  const onInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(field)(e)
    
    // 해당 필드 에러 메시지 초기화
    if (field === 'username' || field === 'email' || field === 'phone') {
      clearFieldError(field)
    }
    
    // 이메일 변경 시 인증 상태 초기화
    if (field === 'email' && emailState.verificationSent) {
      resetEmailVerification()
    }
    
    // 인증번호 입력 시 해당 에러 초기화
    if (field === 'verificationCode') {
      clearFieldError('verificationCode')
    }
  }

  // 이메일 인증 처리
  const onEmailVerification = async () => {
    const result = await handleEmailVerification(formData.email)
    if (result && !result.success && result.isDuplicate) {
      setFieldError('email', result.error)
    }
  }

  // 인증번호 확인 처리
  const onVerificationCheck = async () => {
    const result = await handleVerificationCheck(formData.email, formData.verificationCode)
    if (result && !result.success) {
      setFieldError('verificationCode', result.error)
    }
  }

  // 재전송 확인 처리
  const onResendConfirm = async () => {
    const result = await handleResendConfirm(formData.email)
    if (result && !result.success && result.isDuplicate) {
      setFieldError('email', result.error)
    }
  }

  // 폼 제출 처리
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const handleFieldErrors = (errors: Record<string, string>) => {
      Object.entries(errors).forEach(([field, error]) => {
        setFieldError(field as any, error)
      })
    }

    await handleSubmit(
      formData,
      emailState.emailVerified,
      onNavigateToLogin,
      handleFieldErrors,
      resetForm
    )
  }

  return (
    <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-200 w-full max-w-lg">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-10">
        Sign Up
      </h1>
      
      <form onSubmit={onSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
            회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...
          </div>
        )}
        
        <BasicInfoSection
          formData={formData}
          fieldErrors={fieldErrors}
          handleInputChange={onInputChange}
          onUserIdBlur={handleUserIdCheck}
        />

        <PhoneSection
          formData={formData}
          fieldErrors={fieldErrors}
          handleInputChange={onInputChange}
          onPhoneBlur={handlePhoneCheck}
        />

        <EmailVerificationSection
          formData={formData}
          emailState={emailState}
          fieldErrors={fieldErrors}
          handleInputChange={onInputChange}
          onEmailVerification={onEmailVerification}
          onVerificationCheck={onVerificationCheck}
        />
        
        <div className="pt-4">
          <Button 
            type="submit"
            disabled={isSubmitting || !emailState.emailVerified}
          >
            {isSubmitting ? '가입 중...' : '회원가입'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onNavigateToLogin}
          className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
        >
          이미 계정이 있나요? 로그인
        </button>
      </div>

      {/* 재전송 확인 모달 */}
      <Modal
        isOpen={showResendModal}
        onClose={handleResendCancel}
        title="인증번호 재전송"
        message="재전송 하시겠습니까?"
        confirmText="확인"
        cancelText="아니오"
        onConfirm={onResendConfirm}
        onCancel={handleResendCancel}
      />
    </div>
  )
}

export default SignUpForm
