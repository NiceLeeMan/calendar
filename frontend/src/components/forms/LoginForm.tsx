import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface LoginFormProps {
  onNavigateToSignUp: () => void
}

const LoginForm = ({ onNavigateToSignUp }: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
    // TODO: 실제 로그인 API 호출
  }

  return (
    <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-10">
        Sign In
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-0">
        <Input
          type="email"
          placeholder="아이디를 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <div className="pt-4">
          <Button type="submit">
            Sign In
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
