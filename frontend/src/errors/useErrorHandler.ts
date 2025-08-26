/**
 * 컨텍스트 인식 에러 처리 훅
 * 토스트 알림과 필드별 에러 처리 제공
 */

import { useCallback } from 'react'
import { getErrorMessage, ERROR_MESSAGES } from './errorMessages'
import { ERROR_CODES } from './errorCodes'

type ErrorContext = keyof typeof ERROR_MESSAGES

interface ErrorHandlerResult {
  errorCode: string
  message: string
  field?: string
  isFieldError: boolean
}

interface FieldErrors {
  [fieldName: string]: string
}

export const useErrorHandler = (context: ErrorContext = 'default') => {
  
  // 기본 에러 처리
  const handleError = useCallback((error: any): ErrorHandlerResult => {
    // 네트워크 에러 체크
    if (!error?.response) {
      const message = getErrorMessage(ERROR_CODES.NETWORK_ERROR, context)
      return {
        errorCode: ERROR_CODES.NETWORK_ERROR,
        message,
        isFieldError: false
      }
    }

    // 백엔드 에러 응답에서 정보 추출
    const errorCode = error.response?.data?.errorCode || ERROR_CODES.INTERNAL_SERVER_ERROR
    const field = error.response?.data?.field
    
    // 컨텍스트에 맞는 사용자 친화적 메시지
    const message = getErrorMessage(errorCode, context)
    
    return { 
      errorCode, 
      message, 
      field,
      isFieldError: !!field 
    }
  }, [context])

  // 유효성 검증 에러를 필드별로 처리
  const handleValidationError = useCallback((error: any): FieldErrors => {
    const fieldErrors: FieldErrors = {}
    
    // 백엔드에서 오는 errors 배열 처리
    const errors = error?.response?.data?.errors || []
    
    errors.forEach((errorString: string) => {
      // "fieldName: error message" 형태를 파싱
      const colonIndex = errorString.indexOf(': ')
      if (colonIndex > 0) {
        const fieldName = errorString.substring(0, colonIndex)
        const errorMessage = errorString.substring(colonIndex + 2)
        fieldErrors[fieldName] = errorMessage
      }
    })
    
    return fieldErrors
  }, [])

  // 특정 필드의 중복 에러인지 확인
  const isDuplicateFieldError = useCallback((error: any, fieldName: string): boolean => {
    const errorCode = error?.response?.data?.errorCode
    const field = error?.response?.data?.field
    
    const duplicateErrorCodes = [
      ERROR_CODES.DUPLICATE_EMAIL,
      ERROR_CODES.DUPLICATE_USER_ID, 
      ERROR_CODES.DUPLICATE_PHONE
    ]
    
    return duplicateErrorCodes.includes(errorCode) && field === fieldName
  }, [])

  // 토스트 메시지 표시 (실제 토스트 라이브러리 연동 시 사용)
  const showErrorToast = useCallback((error: any) => {
    const result = handleError(error)
    
    // 토스트 라이브러리가 설치되어 있다면 아래 주석 해제
    // toast.error(result.message, {
    //   duration: 4000,
    //   icon: '😅'
    // })
    
    // 임시로 console.error 사용
    console.error('Error:', result.message)
    
    return result
  }, [handleError])

  return {
    handleError,
    handleValidationError,
    isDuplicateFieldError,
    showErrorToast
  }
}

// 간편 사용을 위한 개별 컨텍스트 훅들
export const useAuthError = () => useErrorHandler('login')
export const useSignupError = () => useErrorHandler('signup') 
export const usePlanError = () => useErrorHandler('plan')
