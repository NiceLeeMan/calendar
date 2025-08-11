/**
 * 모든 타입 정의를 하나로 모으는 메인 index 파일
 */

// API 관련 타입들
export type { HttpError, ErrorResponse, ErrorCode } from './api'

// 사용자 도메인 관련 타입들 (API + 폼)
export type {
  SignupRequest,
  SigninRequest,
  UserResponse,
  EmailVerificationRequest,
  EmailVerificationResponse,
  EmailVerifyCodeRequest,
  EmailVerifyCodeResponse,
  LoginResponse,
  LogoutResponse,
  LoginFormData,
  SignupFormData,
  EmailVerificationState,
  FormValidation,
  FormSubmissionState
} from './user'

// 유효성 검사 관련 타입들
export type {
  ValidationResult,
  ValidatorFunction,
  FormFieldName,
  ValidationErrors
} from './validation'

export { ValidationRules } from './validation'

// Plan 도메인 관련 타입들
export type {
  RepeatUnit,
  DayOfWeek,
  AlarmReqInfo,
  RecurringReqInfo,
  PlanCreateRequest,
  PlanUpdateRequest,
  AlarmResInfo,
  RecurringResInfo,
  PlanResponse,
  MonthlyPlanParams,
  PlanFilterOptions,
  PlanFormData,
  MonthlyPlanCache
} from './plan'

// 유틸리티 타입들
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
