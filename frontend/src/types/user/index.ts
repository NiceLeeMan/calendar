/**
 * User 도메인 타입 통합 export
 * 분할된 User 타입들을 하나로 모아서 export
 * 
 * @author Calendar Team
 * @since 2025-08-27
 */

// Request 타입들
export type {
  SignupRequest,
  SigninRequest,
  EmailVerificationRequest,
  EmailVerifyCodeRequest
} from './requests'

// Response 타입들
export type {
  UserResponse,
  EmailVerificationResponse,
  EmailVerifyCodeResponse,
  LoginResponse,
  LogoutResponse
} from './responses'

// Forms 타입들
export type {
  LoginFormData,
  SignupFormData,
  EmailVerificationState,
  FormValidation,
  FormSubmissionState
} from './forms'
