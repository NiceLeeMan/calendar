import { useState, useEffect, useRef } from 'react'

interface DatePickerProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  onClose: () => void
}

const DatePicker = ({ currentDate, onDateChange, onClose }: DatePickerProps) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  const [isYearAnimating, setIsYearAnimating] = useState(false)
  const [isMonthAnimating, setIsMonthAnimating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 월 이름 배열
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ]

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // 년도 변경 (슬라이드 애니메이션)
  const changeYear = (direction: 'up' | 'down') => {
    if (isYearAnimating) return
    
    setIsYearAnimating(true)
    const newYear = direction === 'up' ? selectedYear + 1 : selectedYear - 1
    
    // 년도 범위 제한 (1900-2100)
    if (newYear >= 1900 && newYear <= 2100) {
      setTimeout(() => {
        setSelectedYear(newYear)
        setIsYearAnimating(false)
      }, 250)
    } else {
      setIsYearAnimating(false)
    }
  }

  // 월 변경 (슬라이드 애니메이션)
  const changeMonth = (direction: 'up' | 'down') => {
    if (isMonthAnimating) return
    
    setIsMonthAnimating(true)
    let newMonth = direction === 'up' ? selectedMonth + 1 : selectedMonth - 1
    
    // 월 순환 (12월 다음은 1월, 1월 이전은 12월)
    if (newMonth > 12) newMonth = 1
    if (newMonth < 1) newMonth = 12
    
    setTimeout(() => {
      setSelectedMonth(newMonth)
      setIsMonthAnimating(false)
    }, 250)
  }

  // 확인 버튼
  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth - 1, 1)
    onDateChange(newDate)
    onClose()
  }

  // 취소 버튼
  const handleCancel = () => {
    onClose()
  }

  return (
    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[280px]" ref={dropdownRef}>
      {/* 헤더 */}
      <div className="text-center text-sm font-medium text-gray-600 mb-3">날짜 선택</div>
      
      {/* 년도/월 선택 영역 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* 년도 선택 */}
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Year</div>
          <div className="relative">
            {/* 년도 증가 버튼 */}
            <button
              onClick={() => changeYear('up')}
              className="w-full mb-1 p-1 text-gray-400 hover:text-blue-600 transition-colors"
              disabled={isYearAnimating}
            >
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            {/* 년도 표시 */}
            <div className="h-8 overflow-hidden relative">
              <div 
                className={`absolute inset-0 flex items-center justify-center font-semibold text-gray-800 transition-all duration-200 ${
                  isYearAnimating ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
                }`}
              >
                {selectedYear}
              </div>
            </div>
            
            {/* 년도 감소 버튼 */}
            <button
              onClick={() => changeYear('down')}
              className="w-full mt-1 p-1 text-gray-400 hover:text-blue-600 transition-colors"
              disabled={isYearAnimating}
            >
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 월 선택 */}
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Month</div>
          <div className="relative">
            {/* 월 증가 버튼 */}
            <button
              onClick={() => changeMonth('up')}
              className="w-full mb-1 p-1 text-gray-400 hover:text-blue-600 transition-colors"
              disabled={isMonthAnimating}
            >
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            {/* 월 표시 */}
            <div className="h-8 overflow-hidden relative">
              <div 
                className={`absolute inset-0 flex items-center justify-center font-semibold text-gray-800 transition-all duration-200 ${
                  isMonthAnimating ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
                }`}
              >
                {monthNames[selectedMonth - 1]}
              </div>
            </div>
            
            {/* 월 감소 버튼 */}
            <button
              onClick={() => changeMonth('down')}
              className="w-full mt-1 p-1 text-gray-400 hover:text-blue-600 transition-colors"
              disabled={isMonthAnimating}
            >
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200 mb-3"></div>

      {/* 버튼 영역 */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleCancel}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          취소
        </button>
        <button
          onClick={handleConfirm}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  )
}

export default DatePicker