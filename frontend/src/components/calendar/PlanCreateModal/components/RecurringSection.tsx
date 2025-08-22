import React, { useState, useEffect } from 'react'

interface RecurringSectionProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
  handleRecurringChange: (field: string, value: any) => void
}

// 요일명 ↔ 인덱스 변환 함수
const WEEKDAY_NAMES = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const WEEKDAY_KOREAN = ['월', '화', '수', '목', '금', '토', '일']

const indexToWeekdayName = (index: number): string => {
  return WEEKDAY_NAMES[index]
}

const RecurringSection = ({ formData, handleInputChange, handleRecurringChange }: RecurringSectionProps) => {
  // 월간 반복 방식 상태 관리 (특정날짜 vs 주차+요일)
  const [monthlyType, setMonthlyType] = useState<'date' | 'weekday'>('date')

  // 월간 반복 방식 결정 (기존 데이터 기반)
  useEffect(() => {
    if (formData.recurringPlan.repeatUnit === 'MONTHLY') {
      if (formData.recurringPlan.repeatDayOfMonth) {
        setMonthlyType('date')
      } else if (formData.recurringPlan.repeatWeeksOfMonth?.length > 0 && 
                 formData.recurringPlan.repeatWeekdays?.length > 0) {
        setMonthlyType('weekday')
      } else {
        // 기본값: 특정 날짜
        setMonthlyType('date')
        // 기본값으로 현재 날짜의 일 설정
        if (formData.startDate && !formData.recurringPlan.repeatDayOfMonth) {
          const day = new Date(formData.startDate).getDate()
          handleRecurringChange('repeatDayOfMonth', day)
        }
      }
    }
  }, [formData.recurringPlan.repeatUnit, formData.startDate])

  // 요일 선택 핸들러 (인덱스 → 요일명으로 변환하여 저장)
  const handleWeekdayChange = (dayIndex: number, checked: boolean) => {
    const currentWeekdays = formData.recurringPlan.repeatWeekdays || []
    const weekdayName = indexToWeekdayName(dayIndex)
    let newWeekdays: string[]
    
    if (checked) {
      // 중복 방지: 이미 포함되어 있지 않은 경우만 추가
      if (!currentWeekdays.includes(weekdayName)) {
        newWeekdays = [...currentWeekdays, weekdayName]
      } else {
        newWeekdays = currentWeekdays // 이미 있으면 변경하지 않음
      }
    } else {
      newWeekdays = currentWeekdays.filter((day: string) => day !== weekdayName)
    }
    
    // 요일 업데이트
    handleRecurringChange('repeatWeekdays', newWeekdays)
    
    // 주간 반복에서 모든 요일이 해제되면 반복 일정 자체를 해제
    if (formData.recurringPlan.repeatUnit === 'WEEKLY' && newWeekdays.length === 0) {
      console.log('주간 반복에서 모든 요일 해제 - 반복 일정을 false로 변경')
      handleInputChange('isRecurring', false)
    }
  }

  // 월간 반복 방식 변경 핸들러
  const handleMonthlyTypeChange = (type: 'date' | 'weekday') => {
    setMonthlyType(type)
    
    if (type === 'date') {
      // 특정 날짜 방식: 주차+요일 데이터 초기화
      handleRecurringChange('repeatWeeksOfMonth', [])
      handleRecurringChange('repeatWeekdays', [])
      
      // 기본값으로 현재 시작 날짜의 일 설정
      if (formData.startDate && !formData.recurringPlan.repeatDayOfMonth) {
        const day = new Date(formData.startDate).getDate()
        handleRecurringChange('repeatDayOfMonth', day)
      }
    } else {
      // 주차+요일 방식: 특정 날짜 데이터 초기화
      handleRecurringChange('repeatDayOfMonth', null)
    }
  }

  // 1~31일 옵션 생성
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
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
                {WEEKDAY_KOREAN.map((day, index) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.recurringPlan.repeatWeekdays?.includes(indexToWeekdayName(index)) || false}
                      onChange={(e) => handleWeekdayChange(index, e.target.checked)}
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                월간 반복 방식
              </label>
              
              {/* 방식 선택 라디오 버튼 */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="monthlyType" 
                    value="date"
                    checked={monthlyType === 'date'}
                    onChange={() => handleMonthlyTypeChange('date')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="ml-2 text-sm text-gray-700">매월 특정 날짜</span>
                </label>                
                {/* 특정 날짜 선택 UI */}
                {monthlyType === 'date' && (
                  <div className="ml-6 flex items-center gap-2">
                    <span className="text-sm text-gray-600">매월</span>
                    <select
                      value={formData.recurringPlan.repeatDayOfMonth || 1}
                      onChange={(e) => handleRecurringChange('repeatDayOfMonth', parseInt(e.target.value))}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[60px]"
                    >
                      {dayOptions.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">일에 반복</span>
                  </div>
                )}

                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="monthlyType" 
                    value="weekday"
                    checked={monthlyType === 'weekday'}
                    onChange={() => handleMonthlyTypeChange('weekday')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="ml-2 text-sm text-gray-700">매월 특정 주차의 요일</span>
                </label>
                
                {/* 주차+요일 선택 UI (향후 구현 예정) */}
                {monthlyType === 'weekday' && (
                  <div className="ml-6 mt-2 p-3 bg-gray-100 rounded-md">
                    <p className="text-sm text-gray-600">
                      🚧 주차+요일 선택 기능은 다음 단계에서 구현됩니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 연간 반복 설정 (기존과 동일) */}
          {formData.recurringPlan.repeatUnit === 'YEARLY' && (
            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-600">
                🚧 연간 반복 설정은 향후 구현 예정입니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RecurringSection
