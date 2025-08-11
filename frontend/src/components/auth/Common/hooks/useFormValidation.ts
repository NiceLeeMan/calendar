import { useState } from 'react'

interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const validateField = (fieldName: string, value: string, rules: ValidationRules = {}): string | null => {
    const { required, minLength, maxLength, pattern, custom } = rules

    // Required 검증
    if (required && (!value || value.trim() === '')) {
      return `${fieldName}은(는) 필수입니다`
    }

    // 값이 없으면 나머지 검증 생략
    if (!value || value.trim() === '') {
      return null
    }

    // 최소 길이 검증
    if (minLength && value.length < minLength) {
      return `${fieldName}은(는) 최소 ${minLength}자 이상이어야 합니다`
    }

    // 최대 길이 검증
    if (maxLength && value.length > maxLength) {
      return `${fieldName}은(는) 최대 ${maxLength}자까지 입력 가능합니다`
    }

    // 패턴 검증
    if (pattern && !pattern.test(value)) {
      return `${fieldName} 형식이 올바르지 않습니다`
    }

    // 커스텀 검증
    if (custom) {
      return custom(value)
    }

    return null
  }

  const setFieldError = (fieldName: string, error: string | null) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }))
  }

  const clearFieldError = (fieldName: string) => {
    setFieldError(fieldName, null)
  }

  const clearAllErrors = () => {
    setErrors({})
  }

  const getFieldError = (fieldName: string) => {
    return errors[fieldName] || null
  }

  return {
    errors,
    validateField,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    getFieldError
  }
}
