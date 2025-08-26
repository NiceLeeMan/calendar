/**
 * 에러 처리 React 훅
 * React 컴포넌트에서 에러 시스템을 사용할 수 있게 연결
 */

import { useCallback, useMemo } from 'react';
import { ErrorHandler } from '../core/ErrorHandler';
import { FriendlyErrorInfo, ErrorHandlerConfig, ErrorNotificationOptions, ErrorType } from '../types';

// 기본 설정
const DEFAULT_CONFIG: ErrorHandlerConfig = {
  defaultNotificationOptions: {
    showToast: true,
    showModal: false,
    logToConsole: true,
    autoHideDuration: 5000,
    priority: 1
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  enableLogging: process.env.NODE_ENV === 'development'
};

/**
 * 에러 처리 훅
 * @param config 사용자 정의 설정 (선택사항)
 * @returns 에러 처리 관련 함수들
 */
export function useErrorHandler(config?: Partial<ErrorHandlerConfig>) {
  // ErrorHandler 인스턴스 생성 (메모이제이션)
  const errorHandler = useMemo(() => {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    return new ErrorHandler(mergedConfig);
  }, [config]);

  /**
   * 일반 에러 처리
   * @param error 에러 객체
   * @param options 알림 옵션
   * @returns 처리된 에러 정보
   */
  const handleError = useCallback((
    error: any, 
    options?: ErrorNotificationOptions
  ): FriendlyErrorInfo => {
    return errorHandler.handleError(error, options);
  }, [errorHandler]);

  /**
   * 유효성 검증 에러 처리
   * @param error 유효성 에러 객체
   * @returns 필드별 에러 메시지
   */
  const handleValidationError = useCallback((error: any): Record<string, string> => {
    return errorHandler.handleValidationError(error);
  }, [errorHandler]);

  /**
   * 중복 에러 확인
   * @param error 에러 객체
   * @param field 필드명
   * @returns 중복 에러 여부
   */
  const isDuplicateFieldError = useCallback((error: any, field: string): boolean => {
    return errorHandler.isDuplicateFieldError(error, field);
  }, [errorHandler]);

  /**
   * 토스트만 표시하는 에러 처리
   * @param error 에러 객체
   * @param duration 표시 시간 (ms)
   * @returns 처리된 에러 정보
   */
  const showErrorToast = useCallback((
    error: any, 
    duration: number = 5000
  ): FriendlyErrorInfo => {
    return handleError(error, {
      showToast: true,
      showModal: false,
      logToConsole: true,
      autoHideDuration: duration
    });
  }, [handleError]);

  /**
   * 모달만 표시하는 에러 처리
   * @param error 에러 객체
   * @returns 처리된 에러 정보
   */
  const showErrorModal = useCallback((error: any): FriendlyErrorInfo => {
    return handleError(error, {
      showToast: false,
      showModal: true,
      logToConsole: true
    });
  }, [handleError]);

  /**
   * 조용한 에러 처리 (UI 알림 없이 로깅만)
   * @param error 에러 객체
   * @returns 처리된 에러 정보
   */
  const handleErrorSilently = useCallback((error: any): FriendlyErrorInfo => {
    return handleError(error, {
      showToast: false,
      showModal: false,
      logToConsole: true
    });
  }, [handleError]);

  /**
   * 특정 에러 타입 확인
   * @param error 에러 객체
   * @param type 확인할 에러 타입
   * @returns 해당 타입 에러 여부
   */
  const isErrorType = useCallback((error: any, type: ErrorType): boolean => {
    const errorInfo = handleErrorSilently(error);
    return errorInfo.type === type;
  }, [handleErrorSilently]);

  return {
    // 기본 에러 처리
    handleError,
    handleValidationError,
    isDuplicateFieldError,
    
    // 특화된 에러 처리
    showErrorToast,
    showErrorModal,
    handleErrorSilently,
    
    // 에러 타입 확인
    isErrorType,
    
    // 편의 함수들
    isNetworkError: (error: any) => isErrorType(error, ErrorType.NETWORK),
    isAuthError: (error: any) => isErrorType(error, ErrorType.AUTHENTICATION),
    isValidationError: (error: any) => isErrorType(error, ErrorType.VALIDATION),
    isDuplicateError: (error: any) => isErrorType(error, ErrorType.DUPLICATE),
    isServerError: (error: any) => isErrorType(error, ErrorType.SERVER),
    
    // ErrorHandler 인스턴스 (고급 사용자용)
    errorHandler
  };
}

/**
 * 인증 에러 전용 훅
 * 로그인/회원가입 등에서 사용
 */
export function useAuthError(config?: Partial<ErrorHandlerConfig>) {
  const { handleError, handleValidationError, isDuplicateFieldError, showErrorToast } = useErrorHandler(config);

  /**
   * 로그인 에러 처리
   * @param error 로그인 에러
   * @returns 처리된 에러 정보
   */
  const handleLoginError = useCallback((error: any): FriendlyErrorInfo => {
    return handleError(error, {
      showToast: true,
      showModal: false,
      logToConsole: true,
      autoHideDuration: 6000 // 로그인 에러는 조금 더 오래 표시
    });
  }, [handleError]);

  /**
   * 회원가입 에러 처리
   * @param error 회원가입 에러
   * @returns 필드별 에러 메시지
   */
  const handleSignupError = useCallback((error: any): Record<string, string> => {
    // 토스트도 함께 표시
    showErrorToast(error, 4000);
    // 필드별 에러 메시지 반환
    return handleValidationError(error);
  }, [handleValidationError, showErrorToast]);

  return {
    handleLoginError,
    handleSignupError,
    handleValidationError,
    isDuplicateFieldError,
    
    // 특정 필드 중복 확인 편의 함수
    isEmailDuplicate: (error: any) => isDuplicateFieldError(error, 'email'),
    isUserIdDuplicate: (error: any) => isDuplicateFieldError(error, 'userId'),
    isPhoneDuplicate: (error: any) => isDuplicateFieldError(error, 'phoneNumber')
  };
}

/**
 * API 에러 전용 훅
 * API 호출에서 발생하는 에러 처리
 */
export function useApiError(config?: Partial<ErrorHandlerConfig>) {
  const { handleError, handleErrorSilently, showErrorToast, showErrorModal } = useErrorHandler(config);

  /**
   * API 에러 처리 (자동 분류)
   * @param error API 에러
   * @param action 수행하려던 작업 (로깅용)
   * @returns 처리된 에러 정보
   */
  const handleApiError = useCallback((
    error: any, 
    action?: string
  ): FriendlyErrorInfo => {
    // 서버 에러는 모달로, 나머지는 토스트로
    const isServerError = error?.response?.status >= 500;
    
    return handleError(error, {
      showToast: !isServerError,
      showModal: isServerError,
      logToConsole: true,
      autoHideDuration: isServerError ? 0 : 5000 // 모달은 자동 숨김 안함
    });
  }, [handleError]);

  /**
   * CRUD 작업 에러 처리
   * @param error 에러 객체
   * @param operation CRUD 작업 타입
   * @returns 처리된 에러 정보
   */
  const handleCrudError = useCallback((
    error: any, 
    operation: 'create' | 'read' | 'update' | 'delete'
  ): FriendlyErrorInfo => {
    return handleApiError(error, `${operation} operation`);
  }, [handleApiError]);

  return {
    handleApiError,
    handleCrudError,
    handleErrorSilently,
    showErrorToast,
    showErrorModal,
    
    // CRUD 전용 편의 함수
    handleCreateError: (error: any) => handleCrudError(error, 'create'),
    handleReadError: (error: any) => handleCrudError(error, 'read'),
    handleUpdateError: (error: any) => handleCrudError(error, 'update'),
    handleDeleteError: (error: any) => handleCrudError(error, 'delete')
  };
}
