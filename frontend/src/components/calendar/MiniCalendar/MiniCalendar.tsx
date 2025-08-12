/**
 * MiniCalendar 메인 컴포넌트 (분할된 버전)
 * 작은 캘린더 위젯
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useCalendarGrid, useDateUtils, useMonthNavigation } from './hooks'

interface MiniCalendarProps {
  currentDate: Date
  onDateSelect: (date: Date) => void
}

const MiniCalendar = ({ currentDate, onDateSelect }: MiniCalendarProps) => {
  
  // 커스텀 훅들로 로직 분리
  const {
    viewDate,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    goToCurrentMonth,
    handleDateClick
  } = useMonthNavigation({ currentDate, onDateSelect })
  
  const { calendarDays } = useCalendarGrid({ viewDate })
  
  const { 
    isCurrentMonth, 
    isToday, 
    isSelected 
  } = useDateUtils({ viewDate, currentDate })

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
          onClick={goToToday}
          className="flex-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          오늘
        </button>
        <button
          onClick={goToCurrentMonth}
          className="flex-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
        >
          현재 월
        </button>
      </div>
    </div>
  )
}

export default MiniCalendar
