import React from 'react'

interface BasicInfoSectionProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
}

const BasicInfoSection = ({ formData, handleInputChange }: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          일정 제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.planName}
          onChange={(e) => handleInputChange('planName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="일정 제목을 입력하세요"
          maxLength={30}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          상세 내용
        </label>
        <textarea
          value={formData.planContent}
          onChange={(e) => handleInputChange('planContent', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="상세 내용을 입력하세요 (선택사항)"
          rows={3}
          maxLength={300}
        />
      </div>
    </div>
  )
}

export default BasicInfoSection
