/**
 * 에러 처리 시스템 통합 Export
 * 모든 에러 관련 기능을 하나의 진입점에서 제공
 */

// ========== Core Classes ==========
export { ErrorHandler } from './core/ErrorHandler';
export { ErrorNotifier } from './core/ErrorNotifier';

// ========== React Hooks ==========
export { 
  useErrorHandler,
  useAuthError, 
  useApiError 
} from './hooks/useErrorHandler';

// ========== Types ==========
export type {
  BackendErrorResponse,
  FriendlyErrorInfo,
  ErrorContext,
  ErrorHandlerConfig,
  ErrorNotificationOptions,
  UserErrorCode,
  PlanErrorCode,
  CommonErrorCode,
  ErrorCode
} from './types';

export { ErrorType } from './types';

// ========== Constants ==========
export {
  USER_ERROR_CODES,
  COMMON_ERROR_CODES,
  NETWORK_ERROR_CODES,
  BACKEND_ERROR_CODES,
  ALL_ERROR_CODES,
  FRIENDLY_ERROR_MESSAGES,
  VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
  HTTP_STATUS_MESSAGES
} from './constants/errorCodes';

// ========== Mappers ==========
export {
  mapUserError,
  isDuplicateError,
  isAuthenticationError,
  isFieldDuplicateError
} from './mappers/userErrorMapper';

export {
  mapCommonError,
  mapValidationErrors,
  isValidationError,
  isServerError
} from './mappers/commonErrorMapper';

export {
  mapNetworkError,
  isConnectionError,
  isTimeoutError,
  isAuthNetworkError
} from './mappers/networkErrorMapper';

// ========== Convenience Exports ==========
/**
 * 기본 에러 처리 인스턴스
 * 간단한 사용을 위한 사전 구성된 인스턴스
 */
export const defaultErrorHandler = new ErrorHandler({
  defaultNotificationOptions: {
    showToast: true,
    showModal: false,
    logToConsole: true,
    autoHideDuration: 5000,
    priority: 1
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  enableLogging: process.env.NODE_ENV === 'development'
});

/**
 * 빠른 에러 처리 함수
 * 훅을 사용하지 않고 직접 에러 처리할 때 사용
 * @param error 에러 객체
 * @param options 알림 옵션
 * @returns 처리된 에러 정보
 */
export const handleError = (error: any, options?: ErrorNotificationOptions) => {
  return defaultErrorHandler.handleError(error, options);
};

/**
 * 빠른 유효성 에러 처리 함수
 * @param error 유효성 에러 객체
 * @returns 필드별 에러 메시지
 */
export const handleValidationError = (error: any) => {
  return defaultErrorHandler.handleValidationError(error);
};

/**
 * 빠른 중복 에러 확인 함수
 * @param error 에러 객체
 * @param field 필드명
 * @returns 중복 에러 여부
 */
export const isDuplicateFieldError = (error: any, field: string) => {
  return defaultErrorHandler.isDuplicateFieldError(error, field);
};

/**
 * 에러 처리 시스템 설정
 * 전역 설정을 변경할 때 사용
 */
export interface ErrorSystemConfig {
  /** 기본 토스트 표시 시간 (ms) */
  defaultToastDuration?: number;
  /** 개발 모드에서 상세 로깅 여부 */
  enableDevLogging?: boolean;
  /** 에러 추적 서비스 연동 여부 */
  enableErrorTracking?: boolean;
}

// ========== Legacy Support ==========
/**
 * 기존 errorMessages.ts와의 호환성을 위한 export
 * @deprecated useErrorHandler 훅 사용을 권장
 */
export const ERROR_MESSAGES = FRIENDLY_ERROR_MESSAGES;
export const getErrorMessage = (error: any): string => {
  const errorInfo = defaultErrorHandler.handleError(error, { 
    showToast: false, 
    showModal: false, 
    logToConsole: false 
  });
  return errorInfo.message;
};

/**
 * 기존 getFieldErrors 함수와의 호환성
 * @deprecated handleValidationError 사용을 권장
 */
export const getFieldErrors = handleValidationError;

// ========== 사용 예시 (JSDoc) ==========
/**
 * @example
 * // React 컴포넌트에서 사용
 * import { useErrorHandler } from '@/errors';
 * 
 * function MyComponent() {
 *   const { handleError, showErrorToast } = useErrorHandler();
 *   
 *   const handleSubmit = async () => {
 *     try {
 *       await api.submitData();
 *     } catch (error) {
 *       handleError(error);
 *     }
 *   };
 * }
 * 
 * @example
 * // 훅 없이 직접 사용
 * import { handleError } from '@/errors';
 * 
 * try {
 *   await api.getData();
 * } catch (error) {
 *   handleError(error);
 * }
 * 
 * @example
 * // 유효성 검증 에러 처리
 * import { useAuthError } from '@/errors';
 * 
 * function SignupForm() {
 *   const { handleSignupError, isEmailDuplicate } = useAuthError();
 *   
 *   const handleSubmit = async (data) => {
 *     try {
 *       await signupAPI(data);
 *     } catch (error) {
 *       const fieldErrors = handleSignupError(error);
 *       setFieldErrors(fieldErrors);
 *       
 *       if (isEmailDuplicate(error)) {
 *         // 이메일 중복 특별 처리
 *       }
 *     }
 *   };
 * }
 */
