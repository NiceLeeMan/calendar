
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
    
    handleRecurringChange('repeatWeekdays', newWeekdays)
  }

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
  )
}

export default RecurringSection
