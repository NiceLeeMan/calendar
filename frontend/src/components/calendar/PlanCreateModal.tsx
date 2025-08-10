import React, { useState } from 'react'

interface AlarmInfo {
  alarmDate: string
  alarmTime: string
}

interface PlanCreateModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
}

const PlanCreateModal = ({ isOpen, onClose, selectedDate }: PlanCreateModalProps) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    planName: '',
    planContent: '',
    startDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    endDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    startTime: '09:00',
    endTime: '10:00',
    isRecurring: false,
    recurringPlan: {
      repeatUnit: 'WEEKLY',
      repeatInterval: 1,
      repeatWeekdays: [] as string[],
      repeatDayOfMonth: null as number | null,
      repeatWeeksOfMonth: [] as number[],
      repeatMonth: null as number | null,
      repeatDayOfYear: null as number | null
    },
    alarms: [] as AlarmInfo[]
  })

  // 입력값 변경 핸들러
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 반복 설정 변경 핸들러
  const handleRecurringChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      recurringPlan: {
        ...prev.recurringPlan,
        [field]: value
      }
    }))
  }

  // 알람 추가
  const addAlarm = () => {
    setFormData(prev => ({
      ...prev,
      alarms: [...prev.alarms, { alarmDate: '', alarmTime: '09:00' }]
    }))
  }

  // 알람 제거
  const removeAlarm = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alarms: prev.alarms.filter((_, i) => i !== index)
    }))
  }

  // 알람 변경
  const updateAlarm = (index: number, field: keyof AlarmInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      alarms: prev.alarms.map((alarm, i) => 
        i === index ? { ...alarm, [field]: value } : alarm
      )
    }))
  }

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Plan data:', formData)
    // TODO: API 호출
    onClose()
  }

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null

  console.log('모달 렌더링 중! isOpen:', isOpen)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">일정 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 폼 내용 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 기본 정보 */}
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

          {/* 날짜 및 시간 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">날짜 및 시간</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작 날짜 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료 날짜 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작 시간 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료 시간 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* 반복 설정 */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isRecurring" className="ml-2 text-sm font-medium text-gray-700">
                반복 일정
              </label>
            </div>

            {formData.isRecurring && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      반복 단위
                    </label>
                    <select
                      value={formData.recurringPlan.repeatUnit}
                      onChange={(e) => handleRecurringChange('repeatUnit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="WEEKLY">주간</option>
                      <option value="MONTHLY">월간</option>
                      <option value="YEARLY">연간</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      반복 간격
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.recurringPlan.repeatInterval}
                      onChange={(e) => handleRecurringChange('repeatInterval', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* 주간 반복 설정 */}
                {formData.recurringPlan.repeatUnit === 'WEEKLY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      반복 요일
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                        <label key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-1 text-sm text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* 월간 반복 설정 */}
                {formData.recurringPlan.repeatUnit === 'MONTHLY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      월간 반복 방식
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="monthlyType" className="h-4 w-4 text-blue-600" />
                        <span className="ml-2 text-sm text-gray-700">매월 특정 날짜</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="monthlyType" className="h-4 w-4 text-blue-600" />
                        <span className="ml-2 text-sm text-gray-700">매월 특정 주차의 요일</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 알람 설정 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">알람</h3>
              <button
                type="button"
                onClick={addAlarm}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                알람 추가
              </button>
            </div>

            {formData.alarms.length > 0 && (
              <div className="space-y-3">
                {formData.alarms.map((alarm, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                    <input
                      type="date"
                      value={alarm.alarmDate}
                      onChange={(e) => updateAlarm(index, 'alarmDate', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="time"
                      value={alarm.alarmTime}
                      onChange={(e) => updateAlarm(index, 'alarmTime', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeAlarm(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlanCreateModal