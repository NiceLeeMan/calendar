/**
 * 폼 유효성 검사 관련 타입
 * 백엔드 validation과 매칭되는 규칙들
 */

// 유효성 검사 규칙 (백엔드 @Pattern과 매칭)
export const ValidationRules = {
  // 사용자 이름: 2-10자
  userName: {
    minLength: 2,
    maxLength: 10,
    pattern: /^[가-힣a-zA-Z\s]{2,10}$/,
    message: '사용자 이름은 2-10자 사이여야 합니다'
  },
  
  // 사용자 아이디: 4-20자, 영문+숫자+언더스코어
  userId: {
    minLength: 4,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]{4,20}$/,
    message: '아이디는 4-20자의 영문, 숫자, 언더스코어만 사용 가능합니다'
  },
  
  // 비밀번호: 8-20자, 영문+숫자+특수문자
  userPassword: {
    minLength: 8,
    maxLength: 20,
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    message: '비밀번호는 8-20자의 영문, 숫자, 특수문자를 포함해야 합니다'
  },
  
  // 이메일
  userEmail: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '올바른 이메일 형식이 아닙니다'
  },
  
  // 휴대폰 번호: 010-0000-0000
  userPhoneNumber: {
    pattern: /^010-\d{4}-\d{4}$/,
    message: '휴대폰 번호 형식이 올바르지 않습니다 (010-0000-0000)'
  },
  
  // 인증번호: 6자리 숫자
  verificationCode: {
    pattern: /^\d{6}$/,
    message: '인증번호는 6자리 숫자입니다'
  }
} as const

// 유효성 검사 결과
export interface ValidationResult {
  isValid: boolean
  message?: string
}

// 필드별 유효성 검사 함수 타입
export type ValidatorFunction = (value: string) => ValidationResult

// 폼 필드 타입
export type FormFieldName = 
  | 'userName' 
  | 'userId' 
  | 'userPassword' 
  | 'userEmail' 
  | 'userPhoneNumber' 
  | 'verificationCode'

// 유효성 검사 에러 맵
export interface ValidationErrors {
  // @ts-ignore
  [key in FormFieldName]?: string | null
}
