import { useState } from 'react'
import type { SignupFormData } from '../../../../types'

export const useSignUpForm = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    verificationCode: ''
  })

  const handleInputChange = (field: keyof SignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value

    // 전화번호 자동 형식화 (010-0000-0000)
    if (field === 'phone') {
      value = value.replace(/\D/g, '') // 숫자만 남기기
      if (value.length >= 3 && value.length <= 7) {
        value = value.replace(/(\d{3})(\d+)/, '$1-$2')
      } else if (value.length > 7) {
        value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
      }
      value = value.slice(0, 13) // 최대 13자 (010-0000-0000)
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      name: '',
      phone: '',
      email: '',
      verificationCode: ''
    })
  }

  return {
    formData,
    handleInputChange,
    resetForm
  }
}
