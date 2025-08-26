/**
 * 컨텍스트별 사용자 친화적 에러 메시지
 * 같은 에러코드도 상황에 따라 다른 메시지 제공
 */

import { ERROR_CODES, type ErrorCode } from './errorCodes'

// 컨텍스트별 메시지 매핑
export const ERROR_MESSAGES = {
  // 회원가입 컨텍스트
  signup: {
    [ERROR_CODES.DUPLICATE_EMAIL]: '이미 가입된 이메일 입니다',
    [ERROR_CODES.DUPLICATE_USER_ID]: '이미 사용중인 아이디 입니다. ',
    [ERROR_CODES.DUPLICATE_PHONE]: '이미 등록된 전화번호 입니다.',
    [ERROR_CODES.VALIDATION_FAILED]: '입력 정보를 다시 확인해주세요!'
  },
  
  // 로그인 컨텍스트
  login: {
    [ERROR_CODES.USER_NOT_FOUND]: '아이디와 비밀번호를 확인해주세요',
  },
  
  // 계획 관리 컨텍스트  
  plan: {
    [ERROR_CODES.NOT_FOUND]: '계획을 찾을 수 없습니다.',
    [ERROR_CODES.VALIDATION_FAILED]: '계획 정보를 올바르게 입력하세요.'
  },
  
  // 공통/기본 메시지
  default: {
    [ERROR_CODES.NETWORK_ERROR]: '인터넷 연결을 확인해주세요!',
    [ERROR_CODES.TIMEOUT_ERROR]: '잠시 후 다시 시도해주세요 ',
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: '서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요 ',
    [ERROR_CODES.VALIDATION_FAILED]: '입력 정보를 확인해주세요!'
  }
} as const

// 메시지 조회 함수
export const getErrorMessage = (
  errorCode: ErrorCode | string,
  context: keyof typeof ERROR_MESSAGES = 'default'
): string => {
  const contextMessages = ERROR_MESSAGES[context]
  const defaultMessages = ERROR_MESSAGES.default
  
  return contextMessages?.[errorCode as ErrorCode] || 
         defaultMessages[errorCode as ErrorCode] || 
         '예상치 못한 문제가 발생했습니다. 새로고침 후 다시 시도해주세요'
}

// 필드별 기본 유효성 메시지
export const FIELD_ERROR_MESSAGES = {
  userName: '이름을 올바르게 입력해주세요',
  userId: '아이디를 올바르게 입력해주세요',  
  userPassword: '비밀번호를 올바르게 입력해주세요',
  userEmail: '이메일을 올바르게 입력해주세요',
  userPhoneNumber: '전화번호를 올바르게 입력해주세요',
  verificationCode: '인증번호를 확인해주세요'
}
