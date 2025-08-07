import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import { sendEmailVerification, verifyEmailCode, signup } from '../../api'
import { getErrorMessage, getFieldErrors, isDuplicateFieldError } from '../../utils/errorMessages'
import type { 
  SignupFormData, 
  EmailVerificationState, 
  FormSubmissionState,
  SignupRequest 
} from '../../types'

interface SignUpFormProps {
  onNavigateToLogin: () => void
}

// 에러 메시지 상태 타입 추가
interface FieldErrors {
  username: string | null
  email: string | null
  phone: string | null
  verificationCode: string | null
}

const SignUpForm = ({ onNavigateToLogin }: SignUpFormProps) => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    verificationCode: ''
  })
  
  const [emailState, setEmailState] = useState<EmailVerificationState>({
    email: '',
    verificationSent: false,
    emailVerified: false,
    isLoading: false,
    error: null,
    expiresAt: null
  })

  const [submissionState, setSubmissionState] = useState<FormSubmissionState>({
    isSubmitting: false,
    error: null,
    success: false
  })

  // 필드별 에러 메시지 상태 추가
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    username: null,
    email: null,
    phone: null,
    verificationCode: null
  })

  // 재전송 모달 상태 추가
  const [showResendModal, setShowResendModal] = useState(false)

  // 아이디 중복 검사 함수
  const handleUserIdCheck = async (userId: string) => {
    if (!userId.trim()) return

    try {
      // 성공 시 에러 메시지 제거
      setFieldErrors(prev => ({ ...prev, username: null }))
    } catch (error) {
      if (isDuplicateFieldError(error, 'userId')) {
        setFieldErrors(prev => ({
          ...prev,
          username: getErrorMessage(error)
        }))
      }
    }
  }

  // 전화번호 중복 검사 함수
  const handlePhoneCheck = async (phoneNumber: string) => {
    if (!phoneNumber.trim() || phoneNumber.length < 13) return // 010-0000-0000 형식 확인

    try {
      // 성공 시 에러 메시지 제거
      setFieldErrors(prev => ({ ...prev, phone: null }))
    } catch (error) {
      if (isDuplicateFieldError(error, 'phoneNumber')) {
        setFieldErrors(prev => ({
          ...prev,
          phone: getErrorMessage(error)
        }))
      }
    }
  }

  const handleInputChange = (field: keyof SignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value

    // 전화번호 자동 형식화 (010-0000-0000)
    if (field === 'phone') {
      value = value.replace(/\D/g, '') // 숫자만 남기기
      if (value.length >= 3 && value.length <= 7) {
        value = value.replace(/(\d{3})(\d+)/, '$1-$2')
      } else if (value.length > 7) {
        value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
      }
      value = value.slice(0, 13) // 최대 13자 (010-0000-0000)
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // 해당 필드 에러 메시지 초기화
    if (field === 'username' || field === 'email' || field === 'phone') {
      setFieldErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }

    // 이메일 변경 시 인증 상태 초기화
    if (field === 'email' && emailState.verificationSent) {
      setEmailState(prev => ({
        ...prev,
        verificationSent: false,
        emailVerified: false,
        error: null
      }))
    }

    // 인증번호 입력 시 해당 에러 초기화
    if (field === 'verificationCode') {
      setFieldErrors(prev => ({
        ...prev,
        verificationCode: null
      }))
    }
  }

  const handleEmailVerification = async () => {
    if (!formData.email) return

    // 이미 전송된 경우 재전송 모달 표시
    if (emailState.verificationSent) {
      setShowResendModal(true)
      return
    }

    await sendVerificationCode()
  }

  const sendVerificationCode = async () => {
    setEmailState(prev => ({ ...prev, isLoading: true, error: null }))
    // 이메일 에러 초기화
    setFieldErrors(prev => ({ ...prev, email: null }))

    try {
      const message = await sendEmailVerification(formData.email)
      
      setEmailState(prev => ({
        ...prev,
        email: formData.email,
        verificationSent: true,
        isLoading: false,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5분 후 만료
      }))
      
      console.log('이메일 인증 발송 성공:', message)
    } catch (error) {
      // 중복 체크 에러 처리
      if (isDuplicateFieldError(error, 'email')) {
        setFieldErrors(prev => ({
          ...prev,
          email: getErrorMessage(error)
        }))
        setEmailState(prev => ({
          ...prev,
          isLoading: false,
          error: null
        }))
        return
      }

      const errorMessage = getErrorMessage(error)
      setEmailState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
    }
  }

  const handleVerificationCheck = async () => {
    if (!formData.email || !formData.verificationCode) return

    setEmailState(prev => ({ ...prev, isLoading: true, error: null }))
    setFieldErrors(prev => ({ ...prev, verificationCode: null }))

    try {
      const message = await verifyEmailCode(formData.email, formData.verificationCode)
      
      setEmailState(prev => ({
        ...prev,
        emailVerified: true,
        isLoading: false,
        error: null
      }))
      
      console.log('이메일 인증 확인 성공:', message)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      
      // 인증번호 에러는 필드 에러로 표시
      setFieldErrors(prev => ({
        ...prev,
        verificationCode: errorMessage
      }))

      setEmailState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!emailState.emailVerified) {
      alert('이메일 인증을 완료해주세요.')
      return
    }

    setSubmissionState({ isSubmitting: true, error: null, success: false })
    // 필드 에러 초기화
    setFieldErrors({
      username: null,
      email: null,
      phone: null,
      verificationCode: null
    })

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
      
      setSubmissionState({
        isSubmitting: false,
        error: null,
        success: true
      })

      console.log('회원가입 성공:', userResponse)
      
      // 성공 시 로그인 페이지로 이동
      setTimeout(() => {
        onNavigateToLogin()
      }, 1500)

    } catch (error) {
      // 필드별 에러 처리
      const fieldErrorsFromResponse = getFieldErrors(error)
      
      if (Object.keys(fieldErrorsFromResponse).length > 0) {
        // 필드 매핑 (백엔드 필드명 -> 프론트엔드 필드명)
        const mappedErrors: FieldErrors = {
          username: fieldErrorsFromResponse['userId'] || null,
          email: fieldErrorsFromResponse['email'] || null,
          phone: fieldErrorsFromResponse['phoneNumber'] || null,
          verificationCode: null
        }

        setFieldErrors(mappedErrors)
        setSubmissionState({
          isSubmitting: false,
          error: null,
          success: false
        })
      } else {
        // 필드별 에러가 없으면 전체 에러 메시지 표시
        setSubmissionState({
          isSubmitting: false,
          error: getErrorMessage(error),
          success: false
        })
      }
    }
  }

  const handleResendConfirm = () => {
    setShowResendModal(false)
    sendVerificationCode()
  }

  const handleResendCancel = () => {
    setShowResendModal(false)
  }

  return (
    <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-200 w-full max-w-lg">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-10">
        Sign Up
      </h1>
      
      <form onSubmit={handleSubmit}>
        {submissionState.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {submissionState.error}
          </div>
        )}

        {submissionState.success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
            회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...
          </div>
        )}
        
        <Input
          type="text"
          placeholder="아이디를 입력하세요"
          value={formData.username}
          onChange={handleInputChange('username')}
          onBlur={(e) => handleUserIdCheck(e.target.value)}
          error={fieldErrors.username || undefined}
          required
        />
        
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleInputChange('password')}
          required
        />
        
        <Input
          type="text"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={handleInputChange('name')}
          required
        />
        
        <Input
          type="tel"
          placeholder="전화번호를 입력하세요 (010-0000-0000)"
          value={formData.phone}
          onChange={handleInputChange('phone')}
          onBlur={(e) => handlePhoneCheck(e.target.value)}
          error={fieldErrors.phone || undefined}
          required
        />
        
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
            </div>

            <Button
              type="button"
              variant="secondary"
              size="small"
              className="h-12 px-6 whitespace-nowrap flex-shrink-0"
              onClick={handleEmailVerification}
              disabled={!formData.email || emailState.isLoading}
            >
              {emailState.isLoading ? '발송 중...' : 
               emailState.verificationSent ? '재전송' : '인증'}
            </Button>
          </div>
          
          {fieldErrors.email && (
            <p className="text-sm text-red-600 mt-2">
              {fieldErrors.email}
            </p>
          )}

          {emailState.error && (
            <p className="text-sm text-red-600 mt-2">
              {emailState.error}
            </p>
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
                onClick={handleVerificationCheck}
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
            
            {fieldErrors.verificationCode && (
              <p className="text-sm text-red-600 mt-3">
                {fieldErrors.verificationCode}
              </p>
            )}
          </div>
        )}
        
        <div className="pt-4">
          <Button 
            type="submit"
            disabled={submissionState.isSubmitting || !emailState.emailVerified}
          >
            {submissionState.isSubmitting ? '가입 중...' : '회원가입'}
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
        onConfirm={handleResendConfirm}
        onCancel={handleResendCancel}
      />
    </div>
  )
}

export default SignUpForm
