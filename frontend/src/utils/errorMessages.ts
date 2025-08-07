import type { ErrorCode, ErrorResponse } from '../types/api'

/**
 * 에러 코드별 메시지 매핑
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  'DUPLICATE_EMAIL': '이미 사용 중인 이메일입니다.',
  'DUPLICATE_USER_ID': '이미 사용 중인 아이디입니다.',
  'DUPLICATE_PHONE': '이미 사용 중인 전화번호입니다.',
  'VALIDATION_FAILED': '입력값을 확인해주세요.',
  'NOT_FOUND': '요청한 정보를 찾을 수 없습니다.',
  'ILLEGAL_ARGUMENT': '잘못된 요청입니다.',
  'INTERNAL_SERVER_ERROR': '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
}

/**
 * 에러 응답에서 적절한 메시지를 추출하는 함수
 * @param error - axios 에러 객체
 * @returns 사용자에게 표시할 에러 메시지
 */
export const getErrorMessage = (error: any): string => {
  // axios 에러인지 확인
  if (error?.response?.data) {
    const errorResponse: ErrorResponse = error.response.data
    
    // errorCode가 있으면 매핑된 메시지 반환
    if (errorResponse.errorCode) {
      const message = ERROR_MESSAGES[errorResponse.errorCode as ErrorCode]
      if (message) {
        return message
      }
    }
  }

  // axios 에러이지만 errorCode가 없는 경우 (기존 API 호환)
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  // HTTP 상태 코드 기반 기본 메시지
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        return '잘못된 요청입니다.'
      case 401:
        return '인증이 필요합니다.'
      case 403:
        return '접근 권한이 없습니다.'
      case 404:
        return '요청한 정보를 찾을 수 없습니다.'
      case 409:
        return '중복된 데이터입니다.'
      case 500:
        return '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
      default:
        return '네트워크 오류가 발생했습니다.'
    }
  }

  // 기본 에러 메시지
  if (error?.message) {
    return error.message
  }

  return '알 수 없는 오류가 발생했습니다.'
}

/**
 * 특정 필드의 중복 에러인지 확인하는 함수
 * @param error - axios 에러 객체
 * @param field - 확인할 필드명
 * @returns 해당 필드의 중복 에러 여부
 */
export const isDuplicateFieldError = (error: any, field: string): boolean => {
  const errorResponse: ErrorResponse | undefined = error?.response?.data
  
  if (!errorResponse?.errorCode || !errorResponse?.field) {
    return false
  }

  const isDuplicateError = [
    'DUPLICATE_EMAIL',
    'DUPLICATE_USER_ID', 
    'DUPLICATE_PHONE'
  ].includes(errorResponse.errorCode)

  return isDuplicateError && errorResponse.field === field
}

/**
 * 에러 응답에서 필드별 에러 메시지를 추출하는 함수
 * @param error - axios 에러 객체
 * @returns 필드별 에러 메시지 객체
 */
export const getFieldErrors = (error: any): Record<string, string> => {
  const errorResponse: ErrorResponse | undefined = error?.response?.data
  const fieldErrors: Record<string, string> = {}

  if (!errorResponse?.errorCode) {
    return fieldErrors
  }

  // 중복 에러 처리
  if (errorResponse.field && errorResponse.errorCode.startsWith('DUPLICATE_')) {
    const message = ERROR_MESSAGES[errorResponse.errorCode as ErrorCode]
    if (message) {
      fieldErrors[errorResponse.field] = message
    }
  }

  // 유효성 검증 에러 처리
  if (errorResponse.errorCode === 'VALIDATION_FAILED' && errorResponse.errors) {
    errorResponse.errors.forEach(errorMsg => {
      const [field, message] = errorMsg.split(': ')
      if (field && message) {
        fieldErrors[field] = message
      }
    })
  }

  return fieldErrors
}
