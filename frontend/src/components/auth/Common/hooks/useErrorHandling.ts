import { useState } from 'react'
import { getErrorMessage, getFieldErrors, isDuplicateFieldError } from '../../../../utils/errorMessages'

export const useErrorHandling = () => {
  const [globalError, setGlobalError] = useState<string | null>(null)

  const handleError = (error: unknown) => {
    const errorMessage = getErrorMessage(error)
    setGlobalError(errorMessage)
    return errorMessage
  }

  const handleFieldError = (error: unknown, fieldName: string) => {
    return isDuplicateFieldError(error, fieldName) ? getErrorMessage(error) : null
  }

  const getFieldErrorsFromResponse = (error: unknown) => {
    return getFieldErrors(error)
  }

  const clearError = () => {
    setGlobalError(null)
  }

  return {
    globalError,
    handleError,
    handleFieldError,
    getFieldErrorsFromResponse,
    clearError
  }
}
