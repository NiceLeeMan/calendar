/**
 * 공통 API 관련 타입 정의
 */

// 백엔드 에러 응답 구조
export interface ErrorResponse {
  status: number
  errorCode: string
  field?: string
  timestamp: string
  path: string
  errors?: string[]
  debugMessage?: string
}

// HTTP 에러 상태 (axios 에러 처리용)
export interface HttpError {
  status: number
  statusText: string
  data?: ErrorResponse
}

// 에러 메시지 매핑 함수용 타입
export type ErrorCode = 
  | 'DUPLICATE_EMAIL'
  | 'DUPLICATE_USER_ID' 
  | 'DUPLICATE_PHONE'
  | 'VALIDATION_FAILED'
  | 'NOT_FOUND'
  | 'ILLEGAL_ARGUMENT'
  | 'INTERNAL_SERVER_ERROR'
