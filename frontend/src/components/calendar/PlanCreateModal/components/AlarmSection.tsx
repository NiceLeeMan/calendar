
interface AlarmSectionProps {
  formData: any
  addAlarm: () => void
  removeAlarm: (index: number) => void
  updateAlarm: (index: number, field: string, value: string) => void
}

const AlarmSection = ({ formData, addAlarm, removeAlarm, updateAlarm }: AlarmSectionProps) => {
  // 현재 날짜 확인
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD 형태
  const isPastDate = formData.startDate && formData.startDate < today
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">알람</h3>
        <button
          type="button"
          onClick={addAlarm}
          disabled={isPastDate}
          className={`text-sm font-medium flex items-center ${
            isPastDate 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:text-blue-800'
          }`}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          알람 추가
        </button>
      </div>

      {isPastDate && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            과거 날짜 계획에는 알람을 설정할 수 없습니다.
          </p>
        </div>
      )}

      {!isPastDate && formData.alarms.length > 0 && (
        <div className="space-y-3">
          {formData.alarms.map((alarm: any, index: number) => (
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
  )
}

export default AlarmSection
