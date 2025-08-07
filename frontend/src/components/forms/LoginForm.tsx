import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { login } from '../../api'
import type { LoginFormData, FormSubmissionState, SigninRequest } from '../../types'

interface LoginFormProps {
  onNavigateToSignUp: () => void
  onNavigateToMain: () => void
}

const LoginForm = ({ onNavigateToSignUp, onNavigateToMain }: LoginFormProps) => {
  const [formData, setFormData] = useState<LoginFormData>({
    id: '',
    password: ''
  })
  
  const [submissionState, setSubmissionState] = useState<FormSubmissionState>({
    isSubmitting: false,
    error: null,
    success: false
  })

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // 에러 상태 초기화
    if (submissionState.error) {
      setSubmissionState(prev => ({ ...prev, error: null }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setSubmissionState(prev => ({ ...prev, isSubmitting: true }))
    
    try {
      // 폼 데이터를 API 요청 형식으로 변환
      const loginData: SigninRequest = {
        userId: formData.id, // 현재 UI에서는 email 필드를 userId로 사용
        userPassword: formData.password
      }

      const userResponse = await login(loginData)
      
      setSubmissionState({
        isSubmitting: false,
        error: null,
        success: true
      })

      console.log('로그인 성공:', userResponse)
      
      // 메인 페이지로 이동
      setTimeout(() => {
        onNavigateToMain()
      }, 1000)
      
    } catch (error) {
      setSubmissionState({
        isSubmitting: false,
        error: error instanceof Error ? error.message : '로그인에 실패했습니다',
        success: false
      })
    }
  }

  return (
    <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-10">
        Sign In
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-0">
        {submissionState.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {submissionState.error}
          </div>
        )}

        {submissionState.success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
            로그인에 성공했습니다!
          </div>
        )}
        
        <Input
          type="text"
          placeholder="아이디를 입력하세요"
          value={formData.id}
          onChange={handleInputChange('id')}
          required
        />
        
        <Input
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleInputChange('password')}
          required
        />
        
        <div className="pt-4">
          <Button 
            type="submit"
            variant="primary"
            disabled={submissionState.isSubmitting}
          >
            {submissionState.isSubmitting ? '로그인 중...' : 'Sign In'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onNavigateToSignUp}
          className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
        >
          회원가입
        </button>
      </div>
    </div>
  )
}

export default LoginForm
