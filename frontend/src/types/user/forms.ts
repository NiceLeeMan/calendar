/**
 * User 도메인 폼 상태 타입 정의
 * UI 폼 데이터 및 상태 관리용 타입
 * 
 * @author Calendar Team
 * @since 2025-08-27
 */

// 로그인 폼 데이터
export interface LoginFormData {
  id: string          // 현재 폼에서는 email을 userId로 사용
  password: string
}

// 회원가입 폼 데이터 (UI 상태 포함)
export interface SignupFormData {
  username: string       // userId
  password: string       // userPassword
  name: string          // userName
  phone: string         // userPhoneNumber
  email: string         // userEmail
  verificationCode: string // 이메일 인증번호
}

// 이메일 인증 상태
export interface EmailVerificationState {
  email: string
  verificationSent: boolean
  emailVerified: boolean
  isLoading: boolean
  error: string | null
  expiresAt: Date | null
}

// 폼 유효성 검사 관련
export interface FormValidation {
  isValid: boolean
  errors: {
    [key: string]: string | undefined
  }
}

// 폼 제출 상태
export interface FormSubmissionState {
  isSubmitting: boolean
  error: string | null
  success: boolean
}
