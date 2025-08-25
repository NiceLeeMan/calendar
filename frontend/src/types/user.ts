/**
 * 사용자 도메인 관련 모든 타입 정의
 * API 요청/응답 타입 + 폼 상태 타입
 */

// ============================================
// API 관련 타입 (백엔드 DTO와 매칭)
// ============================================

// 회원가입 요청 - SignupReq.java와 매칭
export interface SignupRequest {
  userName: string        // 사용자 실명 (2-10자)
  userId: string         // 사용자 아이디 (4-20자, 영문+숫자+언더스코어)
  userPassword: string   // 비밀번호 (8-20자, 영문+숫자+특수문자)
  userEmail: string      // 이메일 주소
  userPhoneNumber: string // 휴대폰 번호 (010-0000-0000)
}

// 로그인 요청 - SigninReq.java와 매칭
export interface SigninRequest {
  userId: string         // 사용자 아이디
  userPassword: string   // 비밀번호
}

// 사용자 응답 - UserResponse.java와 매칭
export interface UserResponse {
  userId: string         // 사용자 아이디
  userName: string       // 사용자 실명
  userEmail: string      // 이메일 주소
  userPhoneNumber: string // 휴대폰 번호
  createdAt: string      // 생성일시 (ISO 8601)
}

// 이메일 인증 관련
export interface EmailVerificationRequest {
  email: string          // 인증할 이메일
}

export interface EmailVerificationResponse {
  message: string        // 응답 메시지
  expiresIn?: number     // 만료 시간 (초)
}

export interface EmailVerifyCodeRequest {
  email: string          // 이메일
  code: string          // 4자리 인증번호
}

export interface EmailVerifyCodeResponse {
  message: string        // 응답 메시지
  verified: boolean      // 인증 성공 여부
}

// JWT 관련 (쿠키 기반이므로 응답에는 토큰 없음)
export interface LoginResponse extends UserResponse {
  // JWT는 HttpOnly 쿠키로 설정되므로 응답 바디에는 사용자 정보만
}

export interface LogoutResponse {
  message: string        // 로그아웃 메시지
}

// ============================================
// 폼 상태 관련 타입
// ============================================

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
