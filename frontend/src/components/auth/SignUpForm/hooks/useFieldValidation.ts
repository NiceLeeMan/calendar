import { useState } from 'react'
import { useAuthError } from '../../../../errors'

export const useFieldValidation = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({
    username: null,
    email: null,
    phone: null,
    verificationCode: null
  })

  const { isUserIdDuplicate, isPhoneDuplicate, handleError } = useAuthError()

  const handleUserIdCheck = async (userId: string) => {
    if (!userId.trim()) return

    try {
      // 실제 API 호출이 있다면 여기서 처리
      // 현재는 중복 체크 API가 없는 것 같으므로 성공 시 에러 메시지만 제거
      setFieldErrors(prev => ({ ...prev, username: null }))
    } catch (error) {
      if (isUserIdDuplicate(error)) {
        setFieldErrors(prev => ({
          ...prev,
          username: '이미 사용중인 아이디입니다.'
        }))
      }
    }
  }

  const handlePhoneCheck = async (phoneNumber: string) => {
    if (!phoneNumber.trim() || phoneNumber.length < 13) return

    try {
      // 실제 API 호출이 있다면 여기서 처리
      // 현재는 중복 체크 API가 없는 것 같으므로 성공 시 에러 메시지만 제거
      setFieldErrors(prev => ({ ...prev, phone: null }))
    } catch (error) {
      if (isPhoneDuplicate(error)) {
        setFieldErrors(prev => ({
          ...prev,
          phone: '이미 등록된 전화번호입니다.'
        }))
      }
    }
  }

  const setFieldError = (field: string, error: string | null) => {
    setFieldErrors(prev => ({ ...prev, [field]: error }))
  }

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: null }))
  }

  const clearAllFieldErrors = () => {
    setFieldErrors({
      username: null,
      email: null,
      phone: null,
      verificationCode: null
    })
  }

  return {
    fieldErrors,
    handleUserIdCheck,
    handlePhoneCheck,
    setFieldError,
    clearFieldError,
    clearAllFieldErrors
  }
}
