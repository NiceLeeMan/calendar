import { useState, useEffect } from 'react'

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
}

interface MonthViewProps {
  currentDate: Date
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

const MonthView = ({ currentDate, selectedDate, onDateSelect }: MonthViewProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right')
  const [previousDate, setPreviousDate] = useState(currentDate)
  // 날짜 변경 감지 및 애니메이션 처리
  useEffect(() => {
    if (currentDate.getTime() !== previousDate.getTime()) {
      // 월이 변경되었는지 확인
      const currentMonth = currentDate.getMonth()
      const previousMonth = previousDate.getMonth()
      const currentYear = currentDate.getFullYear()
      const previousYear = previousDate.getFullYear()
      
      // 년도나 월이 변경된 경우에만 애니메이션
      if (currentMonth !== previousMonth || currentYear !== previousYear) {
        // 애니메이션 방향 결정
        const isNext = currentYear > previousYear || 
                      (currentYear === previousYear && currentMonth > previousMonth)
        
        setAnimationDirection(isNext ? 'left' : 'right')
        setIsAnimating(true)
        
        // 애니메이션 완료 후 상태 리셋
        setTimeout(() => {
          setIsAnimating(false)
          setPreviousDate(currentDate)
        }, 0)
      } else {
        setPreviousDate(currentDate)
      }
    }
  }, [currentDate, previousDate])
  // 더미 이벤트 데이터 (Untitled UI 참고)
  const dummyEvents: Event[] = [
    { id: 1, title: "All-hands meeting", date: "2025-08-01", startTime: "09:00", endTime: "10:00", color: "bg-blue-500" },
    { id: 2, title: "Dinner with Candice", date: "2025-08-01", startTime: "19:00", endTime: "21:00", color: "bg-green-500" },
    { id: 3, title: "Coffee with Ali", date: "2025-08-04", startTime: "10:00", endTime: "11:00", color: "bg-purple-500" },
    { id: 4, title: "Marketing site kickoff", date: "2025-08-04", startTime: "14:00", endTime: "15:30", color: "bg-orange-500" },
    { id: 5, title: "Deep work", date: "2025-08-06", startTime: "09:00", endTime: "11:00", color: "bg-blue-600" },
    { id: 6, title: "One-on-one w/ Eva", date: "2025-08-06", startTime: "14:00", endTime: "15:00", color: "bg-indigo-500" },
    { id: 7, title: "Design sync", date: "2025-08-06", startTime: "16:00", endTime: "17:00", color: "bg-blue-500" },
    { id: 8, title: "2 more...", date: "2025-08-06", startTime: "", endTime: "", color: "bg-gray-400" },
    { id: 9, title: "Lunch with Olivia", date: "2025-08-07", startTime: "12:00", endTime: "13:30", color: "bg-pink-500" },
    { id: 10, title: "Friday standup", date: "2025-08-08", startTime: "09:00", endTime: "09:30", color: "bg-yellow-500" },
    { id: 11, title: "Olivia x Riley", date: "2025-08-08", startTime: "11:00", endTime: "12:00", color: "bg-green-500" },
    { id: 12, title: "Product demo", date: "2025-08-08", startTime: "15:00", endTime: "16:00", color: "bg-red-500" },
    { id: 13, title: "House inspection", date: "2025-08-09", startTime: "10:00", endTime: "11:30", color: "bg-teal-500" },
    { id: 14, title: "Ava's engagement party", date: "2025-08-10", startTime: "18:00", endTime: "22:00", color: "bg-rose-500" },
    { id: 15, title: "Monday standup", date: "2025-08-11", startTime: "09:00", endTime: "09:30", color: "bg-yellow-500" },
    { id: 16, title: "Content planning", date: "2025-08-11", startTime: "14:00", endTime: "15:30", color: "bg-cyan-500" },
    { id: 17, title: "Product demo", date: "2025-08-12", startTime: "10:00", endTime: "11:00", color: "bg-red-500" },
    { id: 18, title: "Catch up w/ Alex", date: "2025-08-12", startTime: "16:00", endTime: "17:00", color: "bg-lime-500" }
  ]

  // 달력 그리드 생성 (현재 달력과 이전 달력 모두 생성)
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    
    // 이번 달 첫째 날
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    // 첫째 주 시작일 (일요일부터)
    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
    
    // 마지막 주 종료일
    const endDate = new Date(lastDayOfMonth)
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()))
    
    const days = []
    const currentDay = new Date(startDate)
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }
    
    return days
  }

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return dummyEvents.filter(event => event.date === dateString)
  }

  // 날짜가 현재 월에 속하는지 확인
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  // 날짜가 오늘인지 확인
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // 날짜가 선택된 날짜인지 확인
  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const calendarDays = generateCalendarDays(currentDate)
  const previousCalendarDays = generateCalendarDays(previousDate)
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  // 달력 콘텐츠 렌더링 함수
  const renderCalendarGrid = (days: Date[], isCurrentCalendar: boolean = true) => {
    return days.map((date, index) => {
      const events = getEventsForDate(date)
      const isCurrentMonthDay = isCurrentCalendar ? 
        isCurrentMonth(date) : 
        date.getMonth() === previousDate.getMonth()
      const isTodayDay = isToday(date)
      const isSelectedDay = isSelected(date)

      return (
        <div
          key={`${date.getTime()}-${index}`}
          onClick={() => onDateSelect(date)}
          className={`min-h-[120px] p-2 border-r border-b border-gray-100 cursor-pointer transition-colors hover:bg-blue-50 ${
            !isCurrentMonthDay ? 'bg-gray-50' : ''
          } ${
            isSelectedDay ? 'bg-blue-100 ring-2 ring-blue-500 ring-inset' : ''
          }`}
        >
          {/* 날짜 숫자 */}
          <div className="flex justify-between items-start mb-1">
            <span
              className={`text-sm font-medium ${
                !isCurrentMonthDay
                  ? 'text-gray-400'
                  : isTodayDay
                  ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold'
                  : 'text-gray-700'
              }`}
            >
              {date.getDate()}
            </span>
            
            {/* 이벤트 개수 표시 */}
            {events.length > 0 && (
              <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                {events.length}
              </span>
            )}
          </div>

          {/* 이벤트 목록 */}
          <div className="space-y-1">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-2 py-1 rounded text-white truncate font-medium ${
                  event.color || 'bg-blue-500'
                }`}
                title={`${event.title} ${event.startTime ? `(${event.startTime} - ${event.endTime})` : ''}`}
              >
                {event.title}
              </div>
            ))}
            
            {/* 추가 이벤트가 있는 경우 */}
            {events.length > 3 && (
              <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded truncate">
                +{events.length - 3} more
              </div>
            )}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`py-3 text-center text-sm font-semibold ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 - 슬라이드 애니메이션 컨테이너 */}
      <div className="relative overflow-hidden">
        {/* 현재 달력 */}
        <div 
          className={`grid grid-cols-7 transition-transform duration-300 ease-in-out ${
            isAnimating 
              ? animationDirection === 'left' 
                ? 'transform -translate-x-full' 
                : 'transform translate-x-full'
              : 'transform translate-x-0'
          }`}
        >
          {renderCalendarGrid(calendarDays)}
        </div>

        {/* 이전/다음 달력 (애니메이션 중에만 표시) */}
        {isAnimating && (
          <div 
            className={`absolute top-0 left-0 w-full grid grid-cols-7 transition-transform duration-300 ease-in-out ${
              animationDirection === 'left'
                ? 'transform translate-x-0'
                : 'transform -translate-x-0'
            }`}
            style={{
              transform: animationDirection === 'left' 
                ? 'translateX(100%)' 
                : 'translateX(-100%)'
            }}
          >
            {renderCalendarGrid(previousCalendarDays, false)}
          </div>
        )}
      </div>
    </div>
  )
}

export default MonthView
