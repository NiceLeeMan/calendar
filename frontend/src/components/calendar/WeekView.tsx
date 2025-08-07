import React from 'react'

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
}

interface WeekViewProps {
  currentDate: Date
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

const WeekView = ({ currentDate, selectedDate, onDateSelect }: WeekViewProps) => {
  // 더미 이벤트 데이터 (MonthView와 동일하지만 시간대 정보 활용)
  const dummyEvents: Event[] = [
    { id: 1, title: "All-hands meeting", date: "2025-08-04", startTime: "09:00", endTime: "10:00", color: "bg-blue-500" },
    { id: 2, title: "Coffee with Ali", date: "2025-08-04", startTime: "10:00", endTime: "11:00", color: "bg-purple-500" },
    { id: 3, title: "Marketing site kickoff", date: "2025-08-04", startTime: "14:00", endTime: "15:30", color: "bg-orange-500" },
    
    { id: 4, title: "Deep work", date: "2025-08-05", startTime: "09:00", endTime: "11:00", color: "bg-blue-600" },
    { id: 5, title: "One-on-one w/ Eva", date: "2025-08-05", startTime: "14:00", endTime: "15:00", color: "bg-indigo-500" },
    { id: 6, title: "Design sync", date: "2025-08-05", startTime: "16:00", endTime: "17:00", color: "bg-blue-500" },
    
    { id: 7, title: "Deep work", date: "2025-08-06", startTime: "09:00", endTime: "11:00", color: "bg-blue-600" },
    { id: 8, title: "One-on-one w/ Eva", date: "2025-08-06", startTime: "14:00", endTime: "15:00", color: "bg-indigo-500" },
    { id: 9, title: "Design sync", date: "2025-08-06", startTime: "16:00", endTime: "17:00", color: "bg-blue-500" },
    { id: 10, title: "SEO planning", date: "2025-08-06", startTime: "17:30", endTime: "18:30", color: "bg-green-500" },
    { id: 11, title: "Meetup event", date: "2025-08-06", startTime: "19:00", endTime: "21:00", color: "bg-red-500" },
    
    { id: 12, title: "Lunch with Olivia", date: "2025-08-07", startTime: "12:00", endTime: "13:30", color: "bg-pink-500" },
    
    { id: 13, title: "Friday standup", date: "2025-08-08", startTime: "09:00", endTime: "09:30", color: "bg-yellow-500" },
    { id: 14, title: "Olivia x Riley", date: "2025-08-08", startTime: "11:00", endTime: "12:00", color: "bg-green-500" },
    { id: 15, title: "Product demo", date: "2025-08-08", startTime: "15:00", endTime: "16:00", color: "bg-red-500" },
    
    { id: 16, title: "House inspection", date: "2025-08-09", startTime: "10:00", endTime: "11:30", color: "bg-teal-500" }
  ]

  // 시간 슬롯 생성 (12 AM ~ 11 PM)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      const time12h = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`
      slots.push({
        hour,
        label: time12h,
        time24: `${hour.toString().padStart(2, '0')}:00`
      })
    }
    return slots
  }

  // 현재 주의 날짜들 생성
  const generateWeekDays = () => {
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay()) // 일요일로 설정
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      days.push(day)
    }
    return days
  }

  // 특정 날짜와 시간의 이벤트 가져오기
  const getEventsForDateTime = (date: Date, hour: number) => {
    const dateString = date.toISOString().split('T')[0]
    return dummyEvents.filter(event => {
      if (event.date !== dateString) return false
      
      const eventStart = parseInt(event.startTime.split(':')[0])
      const eventEnd = parseInt(event.endTime.split(':')[0])
      
      // 이벤트가 이 시간대에 걸쳐있는지 확인
      return hour >= eventStart && hour < eventEnd
    })
  }

  // 이벤트의 시간대별 위치와 높이 계산
  const getEventStyle = (event: Event, hour: number) => {
    const eventStart = parseInt(event.startTime.split(':')[0])
    const eventStartMinutes = parseInt(event.startTime.split(':')[1])
    const eventEnd = parseInt(event.endTime.split(':')[0])
    const eventEndMinutes = parseInt(event.endTime.split(':')[1])
    
    const totalStartMinutes = eventStart * 60 + eventStartMinutes
    const totalEndMinutes = eventEnd * 60 + eventEndMinutes
    const durationMinutes = totalEndMinutes - totalStartMinutes
    
    // 현재 시간 슬롯에서 이벤트가 시작하는지 확인
    if (hour === eventStart) {
      const topOffset = (eventStartMinutes / 60) * 100
      const height = (durationMinutes / 60) * 100
      
      return {
        position: 'absolute' as const,
        top: `${topOffset}%`,
        left: '4px',
        right: '4px',
        height: `${height}%`,
        zIndex: 10
      }
    }
    
    return null
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

  const timeSlots = generateTimeSlots()
  const weekDays = generateWeekDays()
  const weekDayNames = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 헤더: 요일과 날짜 */}
      <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
        {/* 시간 열 헤더 */}
        <div className="p-3 text-center text-sm font-semibold text-gray-500 border-r border-gray-200">
          시간
        </div>
        
        {/* 요일 헤더 */}
        {weekDays.map((date, index) => (
          <div
            key={date.toISOString()}
            onClick={() => onDateSelect(date)}
            className={`p-3 text-center cursor-pointer transition-colors hover:bg-blue-50 border-r border-gray-200 last:border-r-0 ${
              isSelected(date) ? 'bg-blue-100' : ''
            }`}
          >
            <div className={`text-sm font-semibold ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
            }`}>
              {weekDayNames[index]}
            </div>
            <div className={`text-lg font-bold mt-1 ${
              isToday(date) 
                ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto'
                : isSelected(date)
                ? 'text-blue-600'
                : 'text-gray-800'
            }`}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* 시간 그리드 */}
      <div className="max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-8">
          {timeSlots.map((slot) => (
            <React.Fragment key={slot.hour}>
              {/* 시간 레이블 */}
              <div className="h-16 p-2 text-xs text-gray-500 text-right border-r border-b border-gray-100 bg-gray-50">
                {slot.label}
              </div>
              
              {/* 각 요일별 시간 슬롯 */}
              {weekDays.map((date) => {
                const events = getEventsForDateTime(date, slot.hour)
                
                return (
                  <div
                    key={`${date.toISOString()}-${slot.hour}`}
                    className="h-16 border-r border-b border-gray-100 last:border-r-0 relative hover:bg-blue-25 cursor-pointer"
                    onClick={() => onDateSelect(date)}
                  >
                    {/* 이벤트 표시 */}
                    {events.map((event) => {
                      const eventStyle = getEventStyle(event, slot.hour)
                      if (!eventStyle) return null
                      
                      return (
                        <div
                          key={event.id}
                          style={eventStyle}
                          className={`${event.color || 'bg-blue-500'} text-white text-xs p-1.5 rounded-md shadow-sm border border-white border-opacity-20`}
                          title={`${event.title} (${event.startTime} - ${event.endTime})`}
                        >
                          <div className="font-semibold truncate leading-tight">{event.title}</div>
                          {event.startTime && (
                            <div className="text-xs opacity-90 mt-0.5">
                              {event.startTime} - {event.endTime}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 현재 시간 표시선 (오늘인 경우) */}
      {weekDays.some(date => isToday(date)) && (
        <div className="absolute inset-0 pointer-events-none">
          {(() => {
            const now = new Date()
            const currentHour = now.getHours()
            const currentMinutes = now.getMinutes()
            const todayIndex = weekDays.findIndex(date => isToday(date))
            
            if (todayIndex === -1) return null
            
            // 헤더 높이(80px) + 현재 시간까지의 높이 계산
            const topPosition = 80 + (currentHour * 64) + (currentMinutes / 60 * 64)
            const leftPosition = `${12.5 + (todayIndex * 12.5)}%`
            const width = '12.5%'
            
            return (
              <div
                className="bg-red-500 h-0.5 opacity-75 z-20"
                style={{
                  position: 'absolute',
                  top: `${topPosition}px`,
                  left: leftPosition,
                  width: width
                }}
              />
            )
          })()}
        </div>
      )}
    </div>
  )
}

export default WeekView
