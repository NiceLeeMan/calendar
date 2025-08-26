/**
 * 에러 처리 핵심 클래스
 * 모든 에러의 중앙 처리 및 라우팅 담당
 */


import { BackendErrorResponse, FriendlyErrorInfo, ErrorHandlerConfig, ErrorNotificationOptions } from '../types';
import { mapUserError } from '../mappers/userErrorMapper';
import { mapCommonError, mapValidationErrors } from '../mappers/commonErrorMapper';
import { mapNetworkError } from '../mappers/networkErrorMapper';
import { ErrorNotifier } from './ErrorNotifier';
import { USER_ERROR_CODES, COMMON_ERROR_CODES } from '../constants/errorCodes';

export class ErrorHandler {
  private notifier: ErrorNotifier;
  private config: ErrorHandlerConfig;

  constructor(config: ErrorHandlerConfig) {
    this.config = config;
    this.notifier = new ErrorNotifier(config);
  }

  /**
   * 에러 처리 메인 진입점
   * 에러 타입을 분석하고 적절한 처리기로 라우팅
   * @param error 원본 에러 객체
   * @param options 알림 옵션 (선택사항)
   * @returns 처리된 친화적 에러 정보
   */
  public handleError(error: any, options?: ErrorNotificationOptions): FriendlyErrorInfo {
    let errorInfo: FriendlyErrorInfo;

    try {
      // 에러 타입 분석 및 적절한 매퍼로 라우팅
      if (this.isBackendError(error)) {
        errorInfo = this.handleBackendError(error);
      } else if (this.isNetworkError(error)) {
        errorInfo = mapNetworkError(error);
      } else {
        errorInfo = this.handleUnknownError(error);
      }

      // 사용자에게 알림 표시
      this.notifier.notify(errorInfo, options);

      // 개발 환경에서 상세 로깅
      if (this.config.enableLogging) {
        this.logError(error, errorInfo);
      }

      return errorInfo;
    } catch (processingError) {
      // 에러 처리 중 에러 발생 시 폴백
      return this.handleProcessingError(processingError, error);
    }
  }

  /**
   * 유효성 검증 에러 전용 처리
   * 필드별 에러 메시지를 반환
   * @param error 유효성 검증 에러
   * @returns 필드별 에러 메시지 객체
   */
  public handleValidationError(error: any): Record<string, string> {
    if (!this.isBackendError(error)) {
      return {};
    }

    const backendError = this.extractBackendError(error);
    return mapValidationErrors(backendError);
  }

  /**
   * 특정 필드의 중복 에러인지 확인
   * @param error 에러 객체
   * @param field 확인할 필드명
   * @returns 해당 필드의 중복 에러 여부
   */
  public isDuplicateFieldError(error: any, field: string): boolean {
    if (!this.isBackendError(error)) {
      return false;
    }

    const backendError = this.extractBackendError(error);
    const isDuplicateError = Object.values(USER_ERROR_CODES)
      .filter(code => code.startsWith('DUPLICATE_'))
      .includes(backendError.errorCode as any);

    return isDuplicateError && backendError.field === field;
  }

  // ========== Private Methods ==========

  private handleBackendError(error: any): FriendlyErrorInfo {
    const backendError = this.extractBackendError(error);
    
    // 도메인별로 적절한 매퍼 선택
    if (this.isUserDomainError(backendError.errorCode)) {
      return mapUserError(backendError);
    }
    
    if (this.isCommonDomainError(backendError.errorCode)) {
      return mapCommonError(backendError);
    }
    
    // 에러코드가 없으면 공통 매퍼로 처리
    return mapCommonError(backendError);
  }

  private handleUnknownError(error: any): FriendlyErrorInfo {
    return {
      message: '예상치 못한 문제가 발생했어요. 새로고침 후 다시 시도해주세요!',
      type: 'UNKNOWN' as any,
      context: {
        domain: 'unknown',
        originalErrorCode: 'UNKNOWN_ERROR'
      }
    };
  }

  private handleProcessingError(processingError: any, originalError: any): FriendlyErrorInfo {
    console.error('Error occurred while processing error:', processingError);
    console.error('Original error:', originalError);
    
    return {
      message: '시스템에 일시적인 문제가 발생했어요. 잠시 후 다시 시도해주세요!',
      type: 'UNKNOWN' as any,
      context: {
        domain: 'system',
        originalErrorCode: 'ERROR_PROCESSING_FAILED'
      }
    };
  }

  private isBackendError(error: any): boolean {
    return error?.response?.data && 
           typeof error.response.data === 'object' &&
           'status' in error.response.data;
  }

  private isNetworkError(error: any): boolean {
    return error?.isAxiosError || error instanceof Error;
  }

  private extractBackendError(error: any): BackendErrorResponse {
    const responseData = error.response?.data;
    
    return {
      errorCode: responseData?.errorCode,
      field: responseData?.field,
      status: responseData?.status || error.response?.status || 500,
      timestamp: responseData?.timestamp || new Date().toISOString(),
      path: responseData?.path || error.config?.url || '',
      errors: responseData?.errors,
      debugMessage: responseData?.debugMessage
    };
  }

  private isUserDomainError(errorCode?: string): boolean {
    if (!errorCode) return false;
    return Object.values(USER_ERROR_CODES).includes(errorCode as any);
  }

  private isCommonDomainError(errorCode?: string): boolean {
    if (!errorCode) return false;
    return Object.values(COMMON_ERROR_CODES).includes(errorCode as any);
  }

  private logError(originalError: any, processedError: FriendlyErrorInfo): void {
    const logData = {
      timestamp: new Date().toISOString(),
      processedError,
      originalError: {
        message: originalError?.message,
        stack: originalError?.stack,
        response: originalError?.response?.data
      }
    };
    
    console.group('🚨 Error Handled');
    console.error('Processed Error:', processedError.message);
    console.error('Error Type:', processedError.type);
    console.error('Context:', processedError.context);
    console.error('Original Error:', originalError);
    console.groupEnd();
    
    // 향후 에러 추적 서비스(Sentry 등) 연동 지점
    // this.sendToErrorTracking(logData);
  }
}
