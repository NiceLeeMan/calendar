import Button from '../../../ui/Button'
import { FieldError } from '../../Common/components'
import type { SignupFormData, EmailVerificationState } from '../../../../types'

interface EmailVerificationSectionProps {
  formData: SignupFormData
  emailState: EmailVerificationState
  fieldErrors: Record<string, string | null>
  handleInputChange: (field: keyof SignupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailVerification: () => void
  onVerificationCheck: () => void
}

const EmailVerificationSection = ({ 
  formData, 
  emailState, 
  fieldErrors,
  handleInputChange, 
  onEmailVerification, 
  onVerificationCheck 
}: EmailVerificationSectionProps) => {
  return (
    <>
      {/* 이메일 인증 섹션 */}
      <div className="w-full mb-8">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input 
              type="email"
              placeholder="이메일 주소를 입력하세요"
              value={formData.email}
              onChange={handleInputChange('email')}
              className="w-full px-0 py-3 text-base bg-transparent
                       border-0 border-b-2 border-gray-300
                       transition-all duration-200 outline-none placeholder:text-gray-400
                       focus:border-blue-500"
              required
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-200 focus-within:w-full"></div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="small"
            className="h-12 px-6 whitespace-nowrap flex-shrink-0"
            onClick={onEmailVerification}
            disabled={!formData.email || emailState.isLoading}
          >
            {emailState.isLoading ? '발송 중...' : 
             emailState.verificationSent ? '재전송' : '인증'}
          </Button>
        </div>
        
        <FieldError error={fieldErrors.email} />
        {emailState.error && (
          <FieldError error={emailState.error} />
        )}
      </div>
      
      {/* 인증번호 입력 섹션 */}
      {emailState.verificationSent && (
        <div className="w-full mb-8">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="인증번호를 입력하세요"
                value={formData.verificationCode}
                onChange={handleInputChange('verificationCode')}
                className="w-full px-0 py-3 text-base bg-transparent
                         border-0 border-b-2 border-gray-300
                         transition-all duration-200 outline-none placeholder:text-gray-400
                         focus:border-blue-500"
                required
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-200 focus-within:w-full"></div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="small"
              className="h-12 px-6 whitespace-nowrap flex-shrink-0"
              onClick={onVerificationCheck}
              disabled={!formData.verificationCode || emailState.emailVerified || emailState.isLoading}
            >
              {emailState.isLoading ? '확인 중...' :
               emailState.emailVerified ? '인증완료' : '확인'}
            </Button>
          </div>
          
          {/* 인증번호 관련 메시지들 */}
          {emailState.emailVerified && (
            <p className="text-sm text-green-600 mt-3">
              ✓ 이메일 인증이 완료되었습니다.
            </p>
          )}
          
          <FieldError error={fieldErrors.verificationCode} />
        </div>
      )}
    </>
  )
}

export default EmailVerificationSection
