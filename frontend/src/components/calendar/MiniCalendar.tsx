import { useState } from 'react'

interface MiniCalendarProps {
  currentDate: Date
  onDateSelect: (date: Date) => void
}

const MiniCalendar = ({ currentDate, onDateSelect }: MiniCalendarProps) => {
  const [viewDate, setViewDate] = useState(new Date(currentDate))

  // 현재 월의 첫째 날과 마지막 날
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
  const lastDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
  
  // 캘린더 그리드 시작일 (이전 월의 마지막 주 포함)
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
  
  // 캘린더 그리드 종료일 (다음 월의 첫 주 포함)
  const endDate = new Date(lastDayOfMonth)
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()))

  // 캘린더 날짜 배열 생성
  const generateCalendarDays = () => {
    const days = []
    const current = new Date(startDate)
    
    while (current <= endDate) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  // 날짜가 현재 월인지 확인
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === viewDate.getMonth()
  }

  // 날짜가 오늘인지 확인
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // 날짜가 선택된 날인지 확인
  const isSelected = (date: Date) => {
    return date.toDateString() === currentDate.toDateString()
  }

  // 이전 월로 이동
  const goToPreviousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  // 다음 월로 이동
  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    onDateSelect(date)
  }

  const calendarDays = generateCalendarDays()
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* 헤더: 월/년 네비게이션 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="이전 월"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-sm font-semibold text-gray-800">
          {viewDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="다음 월"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const currentMonth = isCurrentMonth(date)
          const today = isToday(date)
          const selected = isSelected(date)
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                w-8 h-8 text-xs rounded transition-colors relative
                ${currentMonth 
                  ? 'text-gray-900 hover:bg-blue-50' 
                  : 'text-gray-300 hover:bg-gray-50'
                }
                ${selected 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : ''
                }
                ${today && !selected 
                  ? 'bg-blue-100 text-blue-600 font-semibold' 
                  : ''
                }
              `}
              title={date.toLocaleDateString('ko-KR')}
            >
              {date.getDate()}
              
              {/* 오늘 날짜 표시 점 (선택되지 않은 경우) */}
              {today && !selected && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* 빠른 이동 버튼들 */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => {
            const today = new Date()
            setViewDate(today)
            onDateSelect(today)
          }}
          className="flex-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          오늘
        </button>
        <button
          onClick={() => setViewDate(new Date(currentDate))}
          className="flex-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
        >
          현재 월
        </button>
      </div>
    </div>
  )
}

export default MiniCalendar
