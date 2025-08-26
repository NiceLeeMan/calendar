/**
 * 공통 에러 매핑
 * 백엔드 common/exception/* 및 전역 에러를 친화적 메시지로 변환
 */

import { BackendErrorResponse, FriendlyErrorInfo, ErrorType, ErrorContext } from '../types';
import { COMMON_ERROR_CODES, FRIENDLY_ERROR_MESSAGES, VALIDATION_MESSAGES } from '../constants/errorCodes';

/**
 * 공통 에러를 친화적 메시지로 변환
 * @param errorResponse 백엔드에서 받은 에러 응답
 * @returns 사용자 친화적 에러 정보
 */
export function mapCommonError(errorResponse: BackendErrorResponse): FriendlyErrorInfo {
  const { errorCode, status } = errorResponse;
  
  if (!errorCode || !isCommonErrorCode(errorCode)) {
    return createUnknownCommonError(status);
  }
  
  const message = FRIENDLY_ERROR_MESSAGES[errorCode] || '일시적인 문제가 발생했어요.';
  const type = determineErrorType(errorCode);
  const context = createErrorContext(errorResponse);
  
  return {
    message,
    type,
    context
  };
}

/**
 * 유효성 검증 에러를 상세 메시지로 변환
 * @param errorResponse VALIDATION_FAILED 에러 응답
 * @returns 필드별 에러 메시지 객체
 */
export function mapValidationErrors(errorResponse: BackendErrorResponse): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  
  if (errorResponse.errorCode !== COMMON_ERROR_CODES.VALIDATION_FAILED || !errorResponse.errors) {
    return fieldErrors;
  }
  
  errorResponse.errors.forEach(errorMsg => {
    const parsed = parseValidationError(errorMsg);
    if (parsed) {
      fieldErrors[parsed.field] = parsed.message;
    }
  });
  
  return fieldErrors;
}

/**
 * 유효성 검증 에러인지 확인
 * @param errorCode 에러 코드
 * @returns 유효성 검증 에러 여부
 */
export function isValidationError(errorCode: string): boolean {
  return errorCode === COMMON_ERROR_CODES.VALIDATION_FAILED;
}

/**
 * 서버 에러인지 확인
 * @param errorCode 에러 코드
 * @returns 서버 에러 여부
 */
export function isServerError(errorCode: string): boolean {
  return errorCode === COMMON_ERROR_CODES.INTERNAL_SERVER_ERROR;
}

// ========== Private Functions ==========

function isCommonErrorCode(errorCode: string): boolean {
  return Object.values(COMMON_ERROR_CODES).includes(errorCode as any);
}

function determineErrorType(errorCode: string): ErrorType {
  switch (errorCode) {
    case COMMON_ERROR_CODES.VALIDATION_FAILED:
      return ErrorType.VALIDATION;
    case COMMON_ERROR_CODES.NOT_FOUND:
      return ErrorType.NOT_FOUND;
    case COMMON_ERROR_CODES.INTERNAL_SERVER_ERROR:
      return ErrorType.SERVER;
    default:
      return ErrorType.UNKNOWN;
  }
}

function createErrorContext(errorResponse: BackendErrorResponse): ErrorContext {
  return {
    domain: 'common',
    statusCode: errorResponse.status,
    originalErrorCode: errorResponse.errorCode
  };
}

function createUnknownCommonError(status: number): FriendlyErrorInfo {
  return {
    message: '일시적인 문제가 발생했어요. 다시 시도해주세요!',
    type: ErrorType.UNKNOWN,
    context: {
      domain: 'common',
      statusCode: status
    }
  };
}

/**
 * 백엔드 유효성 에러 메시지 파싱
 * "userEmail: 이메일 형식이 올바르지 않습니다" → { field: "userEmail", message: "친화적 메시지" }
 */
function parseValidationError(errorMsg: string): { field: string; message: string } | null {
  const [field, originalMessage] = errorMsg.split(': ');
  
  if (!field || !originalMessage) {
    return null;
  }
  
  const friendlyMessage = createFriendlyValidationMessage(field, originalMessage);
  
  return {
    field: field.trim(),
    message: friendlyMessage
  };
}

function createFriendlyValidationMessage(field: string, originalMessage: string): string {
  const fieldMessages = VALIDATION_MESSAGES[field as keyof typeof VALIDATION_MESSAGES];
  
  if (!fieldMessages) {
    return `${field}: ${originalMessage} 다시 확인해주세요!`;
  }
  
  const lowerMessage = originalMessage.toLowerCase();
  
  // 메시지 내용에 따라 적절한 친화적 메시지 선택
  if (lowerMessage.includes('필수') || lowerMessage.includes('required') || lowerMessage.includes('null')) {
    return fieldMessages.required;
  }
  
  if (lowerMessage.includes('형식') || lowerMessage.includes('format') || lowerMessage.includes('pattern') || 
      lowerMessage.includes('invalid') || lowerMessage.includes('올바르지')) {
    return ('format' in fieldMessages ? fieldMessages.format : null) || 
           ('invalid' in fieldMessages ? fieldMessages.invalid : null) || 
           fieldMessages.required;
  }
  
  if (lowerMessage.includes('길이') || lowerMessage.includes('length') || lowerMessage.includes('크기')) {
    return ('length' in fieldMessages ? fieldMessages.length : null) || 
           fieldMessages.required;
  }
  
  // 기본값으로 format 메시지 사용
  return ('format' in fieldMessages ? fieldMessages.format : null) || 
         ('invalid' in fieldMessages ? fieldMessages.invalid : null) || 
         fieldMessages.required;
}
