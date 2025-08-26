import { useState, useCallback, useEffect } from 'react'

interface EmailValidationOptions {
  enableSuggestions?: boolean
  enableDomainTips?: boolean
  realtime?: boolean
  debounceMs?: number
}

interface EmailValidationResult {
  isValid: boolean
  errorMessage: string | null
  suggestions?: string[]
}

export const useEmailValidation = (options: EmailValidationOptions = {}) => {
  const {
    enableDomainTips = false,
    realtime = true,
    debounceMs = 300
  } = options

  const [email, setEmail] = useState('')
  const [validationResult, setValidationResult] = useState<EmailValidationResult>({
    isValid: false,
    errorMessage: null
  })
  const [shouldShowError, setShouldShowError] = useState(false)
  const [hasBlurred, setHasBlurred] = useState(false)

  // 이메일 유효성 검증 함수
  const validateEmail = useCallback((emailValue: string): EmailValidationResult => {
    if (!emailValue) {
      return { isValid: false, errorMessage: null }
    }

    // 기본 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailValue)) {
      return { 
        isValid: false, 
        errorMessage: '올바른 이메일 형식이 아닙니다.' 
      }
    }

    // 추가 검증: 도메인 부분 확인
    const [localPart, domain] = emailValue.split('@')
    
    // 로컬 파트 검증
    if (localPart.length < 1 || localPart.length > 64) {
      return { 
        isValid: false, 
        errorMessage: '이메일 주소가 너무 길거나 짧습니다.' 
      }
    }

    // 도메인 검증
    const domainParts = domain.split('.')
    if (domainParts.some(part => part.length === 0)) {
      return { 
        isValid: false, 
        errorMessage: '도메인 형식이 올바르지 않습니다.' 
      }
    }

    // 일반적인 오타 체크 (옵션)
    if (enableDomainTips) {
      const commonDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com', 'hanmail.net']
      const domainLower = domain.toLowerCase()
      
      // 유사 도메인 체크
      const suggestions: string[] = []
      for (const commonDomain of commonDomains) {
        if (domainLower !== commonDomain && levenshteinDistance(domainLower, commonDomain) <= 2) {
          suggestions.push(`${localPart}@${commonDomain}`)
        }
      }

      if (suggestions.length > 0) {
        return {
          isValid: true,
          errorMessage: null,
          suggestions
        }
      }
    }

    return { isValid: true, errorMessage: null }
  }, [enableDomainTips])

  // 디바운스된 검증
  useEffect(() => {
    if (!realtime || !email) return

    const timeoutId = setTimeout(() => {
      const result = validateEmail(email)
      setValidationResult(result)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [email, validateEmail, realtime, debounceMs])

  // 이메일 변경 핸들러
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value)
    if (value === '') {
      setShouldShowError(false)
      setValidationResult({ isValid: false, errorMessage: null })
    }
  }, [])

  // 블러 핸들러
  const handleEmailBlur = useCallback(() => {
    setHasBlurred(true)
    if (email) {
      const result = validateEmail(email)
      setValidationResult(result)
      setShouldShowError(!result.isValid)
    }
  }, [email, validateEmail])

  return {
    validationResult,
    shouldShowError: shouldShowError || (hasBlurred && !validationResult.isValid),
    handleEmailChange,
    handleEmailBlur,
    isValid: validationResult.isValid,
    errorMessage: validationResult.errorMessage,
    suggestions: validationResult.suggestions
  }
}

// Levenshtein Distance 알고리즘 (문자열 유사도 측정)
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}
