/**
 * 사용자 도메인 에러 매핑
 * 백엔드 user/exception/* 에러를 친화적 메시지로 변환
 */

import { BackendErrorResponse, FriendlyErrorInfo, ErrorType, ErrorContext } from '../types';
import { USER_ERROR_CODES, FRIENDLY_ERROR_MESSAGES } from '../constants/errorCodes';

/**
 * 사용자 도메인 에러를 친화적 메시지로 변환
 * @param errorResponse 백엔드에서 받은 에러 응답
 * @returns 사용자 친화적 에러 정보
 */
export function mapUserError(errorResponse: BackendErrorResponse): FriendlyErrorInfo {
  const { errorCode, field, status } = errorResponse;
  
  // 에러코드가 사용자 도메인인지 확인
  if (!errorCode || !isUserErrorCode(errorCode)) {
    return createUnknownUserError(status);
  }
  

  const message = FRIENDLY_ERROR_MESSAGES[errorCode] || '사용자 관련 문제가 발생했어요.';
  const type = determineErrorType(errorCode);
  const context = createErrorContext(errorResponse);
  
  return {
    message,
    type,
    field,
    context
  };
}
/**
 * 중복 에러인지 확인
 * @param errorCode 에러 코드
 * @returns 중복 에러 여부
 */
export function isDuplicateError(errorCode: string): boolean {
  return [
    USER_ERROR_CODES.DUPLICATE_EMAIL,
    USER_ERROR_CODES.DUPLICATE_USER_ID,
    USER_ERROR_CODES.DUPLICATE_PHONE
  ].includes(errorCode as any);
}

/**
 * 인증 관련 에러인지 확인
 * @param errorCode 에러 코드
 * @returns 인증 에러 여부
 */
export function isAuthenticationError(errorCode: string): boolean {
  return [
    USER_ERROR_CODES.INVALID_PASSWORD,
    USER_ERROR_CODES.USER_NOT_FOUND
  ].includes(errorCode as any);
}

/**
 * 특정 필드의 중복 에러인지 확인
 * @param errorResponse 백엔드 에러 응답
 * @param targetField 확인할 필드명
 * @returns 해당 필드의 중복 에러 여부
 */
export function isFieldDuplicateError(errorResponse: BackendErrorResponse, targetField: string): boolean {
  const { errorCode, field } = errorResponse;
  return isDuplicateError(errorCode || '') && field === targetField;
}

// ========== Private Functions ==========

function isUserErrorCode(errorCode: string): boolean {
  return Object.values(USER_ERROR_CODES).includes(errorCode as any);
}

function determineErrorType(errorCode: string): ErrorType {
  if (isDuplicateError(errorCode)) {
    return ErrorType.DUPLICATE;
  }
  
  if (isAuthenticationError(errorCode)) {
    return ErrorType.AUTHENTICATION;
  }
  
  return ErrorType.UNKNOWN;
}

function createErrorContext(errorResponse: BackendErrorResponse): ErrorContext {
  return {
    domain: 'user',
    statusCode: errorResponse.status,
    originalErrorCode: errorResponse.errorCode
  };
}

function createUnknownUserError(status: number): FriendlyErrorInfo {
  return {
    message: '사용자 관련 문제가 발생했어요. 다시 시도해주세요!',
    type: ErrorType.UNKNOWN,
    context: {
      domain: 'user',
      statusCode: status
    }
  };
}
