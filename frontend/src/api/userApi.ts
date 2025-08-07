/**
 * 사용자 관련 API 함수들
 * 회원가입, 로그인, 이메일 인증 등
 * 
 * 에러 처리: 원본 axios error를 그대로 throw하여 
 * 컴포넌트에서 errorMessages.ts 유틸리티로 처리
 */

import apiClient from './httpClient'
import {
  SignupRequest,
  SigninRequest,
  UserResponse,
} from '../types'

/**
 * 이메일 인증번호 발송
 * POST /users/send-verification?email={email}
 */
export const sendEmailVerification = async (email: string): Promise<string> => {
  const response = await apiClient.post('/users/send-verification', null, {
    params: { email }
  })
  console.log("이메일 인증 발송 응답:", response.data)
  return response.data
}

/**
 * 이메일 인증번호 확인
 * POST /users/verify-email?email={email}&code={code}
 */
export const verifyEmailCode = async (
  email: string, 
  code: string
): Promise<string> => {
  const response = await apiClient.post('/users/verify-email', null, {
    params: { email, code }
  })
  return response.data
}

/**
 * 회원가입
 * POST /users/signup
 */
export const signup = async (signupData: SignupRequest): Promise<UserResponse> => {
  const response = await apiClient.post('/users/signup', signupData)
  return response.data
}

/**
 * 로그인
 * POST /users/login
 */
export const login = async (loginData: SigninRequest): Promise<UserResponse> => {
  const response = await apiClient.post('/users/login', loginData)
  return response.data
}

/**
 * 로그아웃
 * POST /users/logout
 */
export const logout = async (): Promise<string> => {
  const response = await apiClient.post('/users/logout')
  return response.data
}

/**
 * 내 정보 조회
 * GET /users/me
 */
export const getMyInfo = async (): Promise<UserResponse> => {
  const response = await apiClient.get('/users/me')
  return response.data
}
