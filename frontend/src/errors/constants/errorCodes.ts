/**
 * 에러 코드 상수 정의
 * 백엔드 GlobalExceptionHandler에서 실제로 사용하는 에러 코드만 정의합니다.
 */

/**
 * 사용자 도메인 에러 코드
 * 백엔드 GlobalExceptionHandler의 @ExceptionHandler들과 정확히 매칭
 */
export const USER_ERROR_CODES = {
  /** DuplicateEmailException → "DUPLICATE_EMAIL" */
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  
  /** DuplicateUserIdException → "DUPLICATE_USER_ID" */
  DUPLICATE_USER_ID: 'DUPLICATE_USER_ID',
  
  /** DuplicatePhoneException → "DUPLICATE_PHONE" */
  DUPLICATE_PHONE: 'DUPLICATE_PHONE',
  
  /** InvalidPasswordException → "INVALID_PASSWORD" */
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  
  /** UserNotFoundException → "USER_NOT_FOUND" */
  USER_NOT_FOUND: 'USER_NOT_FOUND'
} as const;

/**
 * 공통 에러 코드
 * 백엔드 GlobalExceptionHandler의 공통 예외 처리와 매칭
 */
export const COMMON_ERROR_CODES = {
  /** NoHandlerFoundException → "NOT_FOUND" */
  NOT_FOUND: 'NOT_FOUND',
  
  /** MethodArgumentNotValidException → "VALIDATION_FAILED" */
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  
  /** Exception → "INTERNAL_SERVER_ERROR" */
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  
  /** IllegalArgumentException → 에러코드 없음 (상태코드 400만) */
  ILLEGAL_ARGUMENT: 'ILLEGAL_ARGUMENT'
} as const;

/**
 * 네트워크 관련 에러 코드
 * 클라이언트 사이드에서 발생하는 네트워크 에러 (백엔드와 무관)
 */
export const NETWORK_ERROR_CODES = {
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  TIMEOUT: 'TIMEOUT',
  SERVER_UNAVAILABLE: 'SERVER_UNAVAILABLE',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN'
} as const;

/**
 * 실제 백엔드에서 사용하는 에러 코드만 통합
 */
export const BACKEND_ERROR_CODES = {
  ...USER_ERROR_CODES,
  ...COMMON_ERROR_CODES
} as const;

/**
 * 모든 에러 코드 (백엔드 + 클라이언트)
 */
export const ALL_ERROR_CODES = {
  ...BACKEND_ERROR_CODES,
  ...NETWORK_ERROR_CODES
} as const;

/**
 * 백엔드 에러 코드별 사용자 친화적 메시지
 * GlobalExceptionHandler에서 실제 사용하는 에러코드만 매핑
 */
export const FRIENDLY_ERROR_MESSAGES = {
  // 사용자 도메인 에러 (실제 백엔드 에러코드)
  [USER_ERROR_CODES.DUPLICATE_EMAIL]: '이미 가입된 이메일 주소예요. 다른 이메일로 시도해보세요!',
  [USER_ERROR_CODES.DUPLICATE_USER_ID]: '이미 사용중인 아이디예요. 다른 아이디를 입력해주세요!',
  [USER_ERROR_CODES.DUPLICATE_PHONE]: '이미 등록된 전화번호예요. 다른 번호로 시도해보세요!',
  [USER_ERROR_CODES.INVALID_PASSWORD]: '비밀번호가 일치하지 않아요. 다시 확인해주세요!',
  [USER_ERROR_CODES.USER_NOT_FOUND]: '가입되지 않은 아이디예요. 회원가입을 먼저 진행해주세요!',
  
  // 공통 에러 (실제 백엔드 에러코드)
  [COMMON_ERROR_CODES.NOT_FOUND]: '요청하신 페이지나 정보를 찾을 수 없어요!',
  [COMMON_ERROR_CODES.VALIDATION_FAILED]: '입력하신 정보를 다시 확인해주세요!',
  [COMMON_ERROR_CODES.INTERNAL_SERVER_ERROR]: '잠시 서버에 문제가 생겼어요. 조금 후에 다시 시도해주세요!',
  [COMMON_ERROR_CODES.ILLEGAL_ARGUMENT]: '올바르지 않은 요청이에요. 다시 시도해주세요!',
  
  // 클라이언트 네트워크 에러
  [NETWORK_ERROR_CODES.CONNECTION_FAILED]: '인터넷 연결을 확인해주세요!',
  [NETWORK_ERROR_CODES.TIMEOUT]: '요청 시간이 초과되었어요. 다시 시도해주세요!',
  [NETWORK_ERROR_CODES.SERVER_UNAVAILABLE]: '서버에 일시적으로 접속할 수 없어요. 잠시 후 다시 시도해주세요!',
  [NETWORK_ERROR_CODES.UNAUTHORIZED]: '로그인이 필요한 서비스예요!',
  [NETWORK_ERROR_CODES.FORBIDDEN]: '접근 권한이 없어요!'
} as const;

/**
 * 필드별 유효성 검증 에러 메시지
 * VALIDATION_FAILED 에러의 errors 배열 파싱용
 * 백엔드 MethodArgumentNotValidException에서 오는 필드명과 매칭
 */
export const VALIDATION_MESSAGES = {
  // 이메일 관련 (백엔드 필드명: userEmail)
  userEmail: {
    required: '이메일을 입력해주세요!',
    format: '올바른 이메일 주소를 입력해주세요! (예: user@example.com)',
    invalid: '올바른 이메일 주소를 입력해주세요!'
  },
  
  // 비밀번호 관련 (백엔드 필드명: userPassword)
  userPassword: {
    required: '비밀번호를 입력해주세요!',
    format: '비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해주세요!',
    length: '비밀번호는 8자 이상 20자 이하로 입력해주세요!'
  },
  
  // 사용자 ID 관련 (백엔드 필드명: userId)
  userId: {
    required: '아이디를 입력해주세요!',
    format: '아이디는 영문과 숫자만 사용 가능해요!',
    length: '아이디는 4자 이상 20자 이하로 입력해주세요!'
  },
  
  // 전화번호 관련 (백엔드 필드명: userPhoneNumber)
  userPhoneNumber: {
    required: '전화번호를 입력해주세요!',
    format: '올바른 전화번호를 입력해주세요! (예: 010-1234-5678)',
    invalid: '올바른 전화번호 형식이 아니에요!'
  },
  
  // 이름 관련 (백엔드 필드명: userName)
  userName: {
    required: '이름을 입력해주세요!',
    length: '이름은 2자 이상 20자 이하로 입력해주세요!',
    format: '이름은 한글, 영문만 입력 가능해요!'
  }
} as const;

/**
 * HTTP 상태 코드별 기본 메시지
 * 백엔드에서 에러코드 없이 상태코드만 올 때 사용
 */
export const HTTP_STATUS_MESSAGES = {
  400: '요청하신 내용에 문제가 있어요. 다시 확인해주세요!',
  401: '로그인이 필요한 서비스예요!',
  403: '접근 권한이 없어요!',
  404: '요청하신 페이지나 정보를 찾을 수 없어요!',
  409: '이미 존재하는 데이터예요. 다른 값으로 시도해주세요!',
  422: '입력하신 정보가 올바르지 않아요. 다시 확인해주세요!',
  429: '요청이 너무 많아요. 잠시 후에 다시 시도해주세요!',
  500: '서버에 문제가 생겼어요. 잠시 후에 다시 시도해주세요!',
  502: '서버에 일시적으로 접속할 수 없어요. 잠시 후 다시 시도해주세요!',
  503: '서버에 일시적으로 접속할 수 없어요. 잠시 후 다시 시도해주세요!',
  504: '서버 응답 시간이 초과되었어요. 다시 시도해주세요!'
} as const;

/**
 * 성공 메시지
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '로그인 되었어요! 환영합니다! 🎉',
  LOGOUT_SUCCESS: '로그아웃 되었어요! 안전하게 종료되었습니다!',
  SIGNUP_SUCCESS: '회원가입이 완료되었어요! 로그인해주세요! ✨',
  EMAIL_VERIFICATION_SENT: '인증번호를 이메일로 보내드렸어요! 확인해주세요! 📧',
  EMAIL_VERIFIED: '이메일 인증이 완료되었어요! ✅',
  PLAN_CREATED: '일정이 추가되었어요! 📅',
  PLAN_UPDATED: '일정이 수정되었어요! ✏️',
  PLAN_DELETED: '일정이 삭제되었어요! 🗑️'
} as const;
