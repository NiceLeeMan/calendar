import Input from '../../../ui/Input'
import { FieldError } from '../../Common/components'
import type { SignupFormData } from '../../../../types'

interface PhoneSectionProps {
  formData: SignupFormData
  fieldErrors: Record<string, string | null>
  handleInputChange: (field: keyof SignupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void
  onPhoneBlur: (phone: string) => void
}

const PhoneSection = ({ 
  formData, 
  fieldErrors, 
  handleInputChange, 
  onPhoneBlur 
}: PhoneSectionProps) => {
  return (
    <div className="mb-6">
      <Input
        type="tel"
        placeholder="전화번호를 입력하세요 (010-0000-0000)"
        value={formData.phone}
        onChange={handleInputChange('phone')}
        onBlur={(e) => onPhoneBlur(e.target.value)}
        error={fieldErrors.phone || undefined}
        required
      />
    </div>
  )
}

export default PhoneSection
