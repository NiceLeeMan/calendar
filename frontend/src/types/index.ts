/**
 * 모든 타입 정의를 하나로 모으는 메인 index 파일
 */

// API 관련 타입들
export type { HttpError, ErrorResponse, ErrorCode } from './api/common'

export type {
  SignupRequest,
  SigninRequest,
  UserResponse,
  EmailVerificationRequest,
  EmailVerificationResponse,
  EmailVerifyCodeRequest,
  EmailVerifyCodeResponse,
  LoginResponse,
  LogoutResponse
} from './api/auth'

// 폼 관련 타입들
export type {
  LoginFormData,
  SignupFormData,
  EmailVerificationState,
  FormValidation,
  FormSubmissionState
} from './forms/auth'

export type {
  ValidationResult,
  ValidatorFunction,
  FormFieldName,
  ValidationErrors
} from './forms/validation'

export { ValidationRules } from './forms/validation'

// 유틸리티 타입들
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
