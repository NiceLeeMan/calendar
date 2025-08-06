import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    verificationCode: ''
  })
  
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleEmailVerification = () => {
    console.log('이메일 인증 요청:', formData.email)
    setVerificationSent(true)
    // TODO: 실제 이메일 인증 API 호출
  }

  const handleVerificationCheck = () => {
    console.log('인증번호 확인:', formData.verificationCode)
    setEmailVerified(true)
    // TODO: 실제 인증번호 확인 API 호출
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailVerified) {
      alert('이메일 인증을 완료해주세요.')
      return
    }
    console.log('회원가입 요청:', formData)
    // TODO: 실제 회원가입 API 호출
  }

  return (
    <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-200 w-full max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-10">
        Sign Up
      </h1>
      
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="아이디를 입력하세요"
          value={formData.username}
          onChange={handleInputChange('username')}
          required
        />
        
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleInputChange('password')}
          required
        />
        
        <Input
          type="text"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={handleInputChange('name')}
          required
        />
        
        <Input
          type="tel"
          placeholder="전화번호를 입력하세요"
          value={formData.phone}
          onChange={handleInputChange('phone')}
          required
        />
        
        {/* 이메일 인증 섹션 */}
        <div className="w-full mb-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <input 
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={formData.email}
                onChange={handleInputChange('email')}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base 
                         transition-all duration-200 outline-none placeholder:text-gray-400
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="small"
              className="h-12 px-6 whitespace-nowrap flex-shrink-0"
              onClick={handleEmailVerification}
              disabled={!formData.email || verificationSent}
            >
              {verificationSent ? '전송됨' : '인증'}
            </Button>
          </div>
        </div>
        
        {/* 인증번호 입력 섹션 */}
        {verificationSent && (
          <div className="w-full mb-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="인증번호를 입력하세요"
                  value={formData.verificationCode}
                  onChange={handleInputChange('verificationCode')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-base 
                           transition-all duration-200 outline-none placeholder:text-gray-400
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="small"
                className="h-12 px-6 whitespace-nowrap flex-shrink-0"
                onClick={handleVerificationCheck}
                disabled={!formData.verificationCode || emailVerified}
              >
                {emailVerified ? '인증완료' : '확인'}
              </Button>
            </div>
            {emailVerified && (
              <p className="text-sm text-green-600 mt-2">
                ✓ 이메일 인증이 완료되었습니다.
              </p>
            )}
          </div>
        )}
        
        <div className="pt-4">
          <Button type="submit">
            회원가입
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignUpForm
