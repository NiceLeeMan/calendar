import Input from '../../../ui/Input'
import { FieldError } from '../../Common/components'
import type { SignupFormData } from '../../../../types'

interface BasicInfoSectionProps {
  formData: SignupFormData
  fieldErrors: Record<string, string | null>
  handleInputChange: (field: keyof SignupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void
  onUserIdBlur: (userId: string) => void
}

const BasicInfoSection = ({ 
  formData, 
  fieldErrors, 
  handleInputChange, 
  onUserIdBlur 
}: BasicInfoSectionProps) => {
  return (
    <>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="아이디를 입력하세요"
          value={formData.username}
          onChange={handleInputChange('username')}
          onBlur={(e) => onUserIdBlur(e.target.value)}
          error={fieldErrors.username || undefined}
          required
        />
        <FieldError error={fieldErrors.username} />
      </div>
      
      <div className="mb-6">
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleInputChange('password')}
          required
        />
      </div>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={handleInputChange('name')}
          required
        />
      </div>
    </>
  )
}

export default BasicInfoSection
