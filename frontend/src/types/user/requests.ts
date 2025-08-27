/**
 * User 도메인 Request 타입 정의
 * 백엔드 API 요청 DTO와 매칭
 * 
 * @author Calendar Team
 * @since 2025-08-27
 */

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

// 이메일 인증 요청
export interface EmailVerificationRequest {
  email: string          // 인증할 이메일
}

// 이메일 인증번호 확인 요청
export interface EmailVerifyCodeRequest {
  email: string          // 이메일
  code: string          // 4자리 인증번호
}
