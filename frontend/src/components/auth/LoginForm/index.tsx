import React from 'react'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import { useLoginForm, useLoginSubmit } from './hooks'

interface LoginFormProps {
  onNavigateToSignUp: () => void
  onNavigateToMain: () => void
}

const LoginForm = ({ onNavigateToSignUp, onNavigateToMain }: LoginFormProps) => {
  const {
    formData,
    handleInputChange,
    resetForm
  } = useLoginForm()

  const { 
    isSubmitting, 
    error, 
    success, 
    handleSubmit 
  } = useLoginSubmit()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(formData, onNavigateToMain, resetForm)
  }

  return (
    <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-10">
        Sign In
      </h1>
      
      <form onSubmit={onSubmit} className="space-y-0">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
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
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그인 중...' : 'Sign In'}
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
