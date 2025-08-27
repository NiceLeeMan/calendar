/**
 * User 도메인 Response 타입 정의
 * 백엔드 API 응답 DTO와 매칭
 * 
 * @author Calendar Team
 * @since 2025-08-27
 */

// 사용자 응답 - UserResponse.java와 매칭
export interface UserResponse {
  userId: string         // 사용자 아이디
  userName: string       // 사용자 실명
  userEmail: string      // 이메일 주소
  userPhoneNumber: string // 휴대폰 번호
  createdAt: string      // 생성일시 (ISO 8601)
}

// 이메일 인증 응답
export interface EmailVerificationResponse {
  message: string        // 응답 메시지
  expiresIn?: number     // 만료 시간 (초)
}

// 이메일 인증번호 확인 응답
export interface EmailVerifyCodeResponse {
  message: string        // 응답 메시지
  verified: boolean      // 인증 성공 여부
}

// JWT 기반 로그인 응답 (쿠키 기반이므로 응답에는 토큰 없음)
export interface LoginResponse extends UserResponse {
  // JWT는 HttpOnly 쿠키로 설정되므로 응답 바디에는 사용자 정보만
}

// 로그아웃 응답
export interface LogoutResponse {
  message: string        // 로그아웃 메시지
}
