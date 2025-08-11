import { useState } from 'react'
import type { LoginFormData } from '../../../../types'

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    id: '',
    password: ''
  })

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const resetForm = () => {
    setFormData({
      id: '',
      password: ''
    })
  }

  return {
    formData,
    handleInputChange,
    resetForm
  }
}
