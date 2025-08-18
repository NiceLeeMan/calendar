/**
 * HTTP 클라이언트 설정
 * axios 기반 API 클라이언트
 */

import axios, { AxiosInstance, AxiosError } from 'axios'

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
    
    // 인증 에러 처리
    if (error.response?.status === 401) {
      // TODO: 로그아웃 처리 또는 로그인 페이지로 리다이렉트
      console.warn('인증이 필요합니다')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
