/**
 * 에러 처리 관련 타입 정의
 * 백엔드 ErrorResponse와 매칭되는 타입들을 정의합니다.
 */

/**
 * 백엔드 ErrorResponse.java와 완전히 동일한 구조
 * 백엔드와의 일관성을 위해 필드명과 타입을 정확히 매칭
 */
export interface BackendErrorResponse {
  /** 구체적인 에러 유형 (DUPLICATE_EMAIL, USER_NOT_FOUND 등) */
  errorCode?: string;
  
  /** 에러 발생 필드명 (중복 검사 등에서 사용) */
  field?: string;
  
  /** HTTP 상태 코드 (예: 400, 404, 500) */
  status: number;
  
  /** 에러 발생 시간 */
  timestamp: string;
  
  /** 에러가 발생한 API 경로 */
  path: string;
  
  /** 상세 에러 목록 (유효성 검증 실패 시 사용) */
  errors?: string[];
  
  /** 개발환경에서만 표시되는 상세 정보 */
  debugMessage?: string;
}

/**
 * 프론트엔드에서 사용하는 에러 정보
 * 사용자에게 표시할 친화적인 메시지 포함
 */
export interface FriendlyErrorInfo {
  /** 사용자에게 표시할 친화적인 메시지 */
  message: string;
  
  /** 에러 유형 (UI 처리를 위한 분류) */
  type: ErrorType;
  
  /** 특정 필드와 관련된 에러인지 여부 */
  field?: string;
  
  /** 추가 컨텍스트 정보 */
  context?: ErrorContext;
}

/**
 * 에러 유형 분류
 * UI 처리 방식을 결정하는데 사용
 */
export enum ErrorType {
  /** 네트워크 연결 관련 에러 */
  NETWORK = 'NETWORK',
  
  /** 인증/권한 관련 에러 */
  AUTHENTICATION = 'AUTHENTICATION',
  
  /** 유효성 검증 실패 에러 */
  VALIDATION = 'VALIDATION',
  
  /** 중복 데이터 에러 */
  DUPLICATE = 'DUPLICATE',
  
  /** 데이터를 찾을 수 없는 에러 */
  NOT_FOUND = 'NOT_FOUND',
  
  /** 서버 내부 에러 */
  SERVER = 'SERVER',
  
  /** 알 수 없는 에러 */
  UNKNOWN = 'UNKNOWN'
}

/**
 * 에러 컨텍스트 정보
 * 에러 발생 상황에 대한 추가 정보
 */
export interface ErrorContext {
  /** 에러가 발생한 도메인 (user, plan, common) */
  domain?: string;
  
  /** 에러가 발생한 액션 (create, update, delete, fetch) */
  action?: string;
  
  /** 원본 에러 객체의 상태 코드 */
  statusCode?: number;
  
  /** 원본 에러 코드 */
  originalErrorCode?: string;
}

/**
 * 도메인별 에러 코드 타입
 * 백엔드의 예외 클래스들과 매칭
 */
export type UserErrorCode = 
  | 'DUPLICATE_EMAIL'
  | 'DUPLICATE_USER_ID' 
  | 'DUPLICATE_PHONE'
  | 'INVALID_PASSWORD'
  | 'USER_NOT_FOUND';

export type PlanErrorCode = 
  | 'PLAN_NOT_FOUND'
  | 'PLAN_CREATE_FAILED'
  | 'PLAN_UPDATE_FAILED'
  | 'PLAN_DELETE_FAILED';

export type CommonErrorCode = 
  | 'VALIDATION_FAILED'
  | 'NOT_FOUND'
  | 'ILLEGAL_ARGUMENT'
  | 'INTERNAL_SERVER_ERROR';

/**
 * 모든 에러 코드의 통합 타입
 */
export type ErrorCode = UserErrorCode | PlanErrorCode | CommonErrorCode;

/**
 * 에러 알림 옵션
 * 에러를 사용자에게 어떻게 표시할지 결정
 */
export interface ErrorNotificationOptions {
  /** 토스트 메시지로 표시할지 여부 */
  showToast?: boolean;
  
  /** 모달로 표시할지 여부 */
  showModal?: boolean;
  
  /** 콘솔에 로그를 남길지 여부 */
  logToConsole?: boolean;
  
  /** 자동으로 사라지는 시간 (ms) */
  autoHideDuration?: number;
  
  /** 에러 표시 우선순위 (높을수록 우선) */
  priority?: number;
}

/**
 * 에러 핸들러 설정
 */
export interface ErrorHandlerConfig {
  /** 기본 알림 옵션 */
  defaultNotificationOptions: ErrorNotificationOptions;
  
  /** 개발 모드 여부 */
  isDevelopment: boolean;
  
  /** 에러 로깅 활성화 여부 */
  enableLogging: boolean;
}
