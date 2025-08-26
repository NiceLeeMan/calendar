/**
 * HTTP 클라이언트 설정
 * axios 기반 API 클라이언트
 */

import axios, { AxiosInstance, AxiosError } from 'axios'
import { getErrorMessage, ERROR_CODES } from '../errors'

// API 기본 설정
const API_BASE_URL = 'http://localhost:8080/api'

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초로 증가 (이메일 발송 시간 고려)
  withCredentials: true, // JWT 쿠키 전송을 위해 필요
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // 에러 응답 로깅 (개발용)
    if (error.response?.data) {
      console.error('[API Response Error]', {
        status: error.response.status,
        errorCode: (error.response.data as any)?.errorCode,
        field: (error.response.data as any)?.field,
        url: error.config?.url
      })
    } else {
      console.error('[API Network Error]', error.message)
    }
    
    // 401 인증 에러 처리
    if (error.response?.status === 401) {
      // 로그인 관련 페이지나 API 호출인 경우 처리 안 함
      const isAuthPage = window.location.pathname === '/signIn' || 
                        window.location.pathname === '/signup' ||
                        error.config?.url?.includes('/login') ||
                        error.config?.url?.includes('/users/me')
      
      if (!isAuthPage) {
        // 인증 만료 메시지 표시 (간단한 alert 사용)
        const message = getErrorMessage(ERROR_CODES.USER_NOT_FOUND, 'login')
        alert(`세션이 만료되었습니다! 다시 로그인해주세요.\n\n${message}`)
        
        // localStorage 클리어
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        
        // 로그인 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = '/signIn'
        }, 1000)
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
