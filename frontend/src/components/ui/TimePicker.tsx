import { useState, useEffect, useRef } from 'react'

interface TimePickerProps {
  value: string // "HH:MM" 형식
  onChange: (time: string) => void
  placeholder?: string
}

const TimePicker = ({ value, onChange, placeholder = "시간 선택" }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHour, setSelectedHour] = useState(9)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // value 파싱해서 시/분 설정
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':').map(Number)
      setSelectedHour(hour)
      setSelectedMinute(minute)
    }
  }, [value])

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // 확인 버튼 클릭 시에만 onChange 호출
  const handleConfirm = () => {
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`
    onChange(timeString)
    setIsOpen(false)
  }

  // 시간 배열 생성
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i) // 1분 단위

  // 표시용 시간 포맷
  const displayTime = value || placeholder

  return (
    <div className="relative">
      {/* 시간 입력 필드 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {displayTime}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* 드롭다운 */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64"
        >
          {/* 간단한 헤더 */}
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="text-xs text-gray-500 text-center">
              {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')}
            </div>
          </div>

          {/* 시간 선택 영역 */}
          <div className="p-2">
            <div className="grid grid-cols-2 gap-2">
              {/* 시간 선택 */}
              <div>
                <div className="text-xs text-gray-500 mb-1 text-center">시</div>
                <div className="h-24 overflow-y-auto border border-gray-200 rounded">
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => setSelectedHour(hour)}
                      className={`w-full px-2 py-1 text-xs text-center hover:bg-blue-50 ${
                        selectedHour === hour ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {hour.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              {/* 분 선택 */}
              <div>
                <div className="text-xs text-gray-500 mb-1 text-center">분</div>
                <div className="h-24 overflow-y-auto border border-gray-200 rounded">
                  {minutes.map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => setSelectedMinute(minute)}
                      className={`w-full px-2 py-1 text-xs text-center hover:bg-blue-50 ${
                        selectedMinute === minute ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 확인 버튼 */}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleConfirm}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimePicker
