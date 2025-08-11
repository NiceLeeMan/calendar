import { useState } from 'react'
import { isDuplicateFieldError, getErrorMessage } from '../../../../utils/errorMessages'

export const useFieldValidation = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({
    username: null,
    email: null,
    phone: null,
    verificationCode: null
  })

  const handleUserIdCheck = async (userId: string) => {
    if (!userId.trim()) return

    try {
      // 성공 시 에러 메시지 제거
      setFieldErrors(prev => ({ ...prev, username: null }))
    } catch (error) {
      if (isDuplicateFieldError(error, 'userId')) {
        setFieldErrors(prev => ({
          ...prev,
          username: getErrorMessage(error)
        }))
      }
    }
  }

  const handlePhoneCheck = async (phoneNumber: string) => {
    if (!phoneNumber.trim() || phoneNumber.length < 13) return

    try {
      // 성공 시 에러 메시지 제거
      setFieldErrors(prev => ({ ...prev, phone: null }))
    } catch (error) {
      if (isDuplicateFieldError(error, 'phoneNumber')) {
        setFieldErrors(prev => ({
          ...prev,
          phone: getErrorMessage(error)
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
