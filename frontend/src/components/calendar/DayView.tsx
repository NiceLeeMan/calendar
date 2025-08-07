import React from 'react'

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
}

interface DayViewProps {
  currentDate: Date
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

const DayView = ({ currentDate, selectedDate, onDateSelect }: DayViewProps) => {
  // 더미 이벤트 데이터
  const dummyEvents: Event[] = [
    { id: 1, title: "Morning standup", date: "2025-08-06", startTime: "09:00", endTime: "09:30", color: "bg-blue-500" },
    { id: 2, title: "Deep work", date: "2025-08-06", startTime: "10:00", endTime: "12:00", color: "bg-blue-600" },
    { id: 3, title: "Lunch break", date: "2025-08-06", startTime: "12:00", endTime: "13:00", color: "bg-green-500" },
    { id: 4, title: "One-on-one w/ Eva", date: "2025-08-06", startTime: "14:00", endTime: "15:00", color: "bg-indigo-500" },
    { id: 5, title: "Design sync", date: "2025-08-06", startTime: "15:30", endTime: "16:30", color: "bg-purple-500" },
    { id: 6, title: "SEO planning", date: "2025-08-06", startTime: "17:00", endTime: "18:00", color: "bg-orange-500" },
    { id: 7, title: "Team retrospective", date: "2025-08-06", startTime: "16:00", endTime: "17:00", color: "bg-teal-500" },
    { id: 8, title: "Meetup event", date: "2025-08-06", startTime: "19:00", endTime: "21:00", color: "bg-red-500" }
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

  // 현재 날짜의 이벤트 가져오기
  const getDayEvents = () => {
    const dateString = currentDate.toISOString().split('T')[0]
    return dummyEvents.filter(event => event.date === dateString)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  // 특정 시간대의 이벤트 가져오기
  const getEventsForHour = (hour: number) => {
    const dayEvents = getDayEvents()
    return dayEvents.filter(event => {
      const eventStart = parseInt(event.startTime.split(':')[0])
      const eventEnd = parseInt(event.endTime.split(':')[0])
      return hour >= eventStart && hour < eventEnd
    })
  }

  // 이벤트의 위치와 크기 계산
  const getEventStyle = (event: Event) => {
    const eventStart = parseInt(event.startTime.split(':')[0])
    const eventStartMinutes = parseInt(event.startTime.split(':')[1])
    const eventEnd = parseInt(event.endTime.split(':')[0])
    const eventEndMinutes = parseInt(event.endTime.split(':')[1])
    
    const totalStartMinutes = eventStart * 60 + eventStartMinutes
    const totalEndMinutes = eventEnd * 60 + eventEndMinutes
    const durationMinutes = totalEndMinutes - totalStartMinutes
    
    // 하루를 1440분(24시간 * 60분)으로 계산
    const topPercentage = (totalStartMinutes / 1440) * 100
    const heightPercentage = (durationMinutes / 1440) * 100
    
    return {
      position: 'absolute' as const,
      top: `${topPercentage}%`,
      left: '8px',
      right: '8px',
      height: `${heightPercentage}%`,
      zIndex: 10,
      minHeight: '32px' // 최소 높이 보장
    }
  }

  // 겹치는 이벤트들의 위치 조정
  const getOverlappingEvents = () => {
    const dayEvents = getDayEvents()
    const eventsWithStyles = dayEvents.map(event => ({
      ...event,
      style: getEventStyle(event)
    }))

    // 겹치는 이벤트들을 그룹으로 묶기
    const overlappingGroups: Array<Array<typeof eventsWithStyles[0]>> = []
    
    eventsWithStyles.forEach(event => {
      const eventStart = parseInt(event.startTime.split(':')[0]) * 60 + parseInt(event.startTime.split(':')[1])
      const eventEnd = parseInt(event.endTime.split(':')[0]) * 60 + parseInt(event.endTime.split(':')[1])
      
      let addedToGroup = false
      
      for (let group of overlappingGroups) {
        const hasOverlap = group.some(groupEvent => {
          const groupStart = parseInt(groupEvent.startTime.split(':')[0]) * 60 + parseInt(groupEvent.startTime.split(':')[1])
          const groupEnd = parseInt(groupEvent.endTime.split(':')[0]) * 60 + parseInt(groupEvent.endTime.split(':')[1])
          
          return (eventStart < groupEnd && eventEnd > groupStart)
        })
        
        if (hasOverlap) {
          group.push(event)
          addedToGroup = true
          break
        }
      }
      
      if (!addedToGroup) {
        overlappingGroups.push([event])
      }
    })

    // 각 그룹의 이벤트들 위치 조정
    return overlappingGroups.flatMap(group => 
      group.map((event, index) => ({
        ...event,
        style: {
          ...event.style,
          left: `${8 + (index * (100 / group.length) * 0.9)}%`,
          width: `${(100 / group.length) * 0.9}%`
        }
      }))
    )
  }

  // 날짜가 오늘인지 확인
  const isToday = () => {
    const today = new Date()
    return currentDate.toDateString() === today.toDateString()
  }

  const timeSlots = generateTimeSlots()
  const eventsWithPositions = getOverlappingEvents()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 헤더: 날짜 정보 */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {currentDate.toLocaleDateString('ko-KR', { weekday: 'long' })}
          </div>
          <div className={`text-3xl font-bold mt-1 ${
            isToday() 
              ? 'text-blue-600'
              : 'text-gray-800'
          }`}>
            {currentDate.getDate()}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {/* 시간 그리드와 이벤트 */}
      <div className="relative">
        {/* 시간 그리드 배경 */}
        <div className="max-h-[600px] overflow-y-auto">
          {timeSlots.map((slot, index) => (
            <div
              key={slot.hour}
              className={`flex border-b border-gray-100 hover:bg-blue-25 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}
              style={{ height: '60px' }}
            >
              {/* 시간 레이블 */}
              <div className="w-20 p-3 text-xs text-gray-500 text-right border-r border-gray-100 bg-gray-50 flex-shrink-0">
                <div className="font-medium">{slot.label}</div>
              </div>
              
              {/* 메인 영역 (이벤트가 들어갈 공간) */}
              <div className="flex-1 relative p-2">
                {/* 30분 구분선 */}
                <div 
                  className="absolute left-0 right-0 border-t border-gray-100 opacity-50"
                  style={{ top: '50%' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 이벤트 오버레이 */}
        <div className="absolute inset-0" style={{ top: '80px' }}>
          <div className="relative" style={{ height: `${timeSlots.length * 60}px` }}>
            {eventsWithPositions.map((event) => (
              <div
                key={event.id}
                style={event.style}
                className={`${event.color || 'bg-blue-500'} text-white rounded-lg shadow-md border-2 border-white border-opacity-20 cursor-pointer transition-all hover:shadow-lg hover:scale-105`}
                title={`${event.title} (${event.startTime} - ${event.endTime})`}
                onClick={() => onDateSelect(currentDate)}
              >
                <div className="p-3 h-full flex flex-col">
                  <div className="font-semibold text-sm leading-tight mb-1">
                    {event.title}
                  </div>
                  <div className="text-xs opacity-90">
                    {event.startTime} - {event.endTime}
                  </div>
                  
                  {/* 이벤트가 길 경우 추가 정보 표시 */}
                  {parseInt(event.endTime.split(':')[0]) - parseInt(event.startTime.split(':')[0]) >= 2 && (
                    <div className="mt-auto pt-2 text-xs opacity-75">
                      {parseInt(event.endTime.split(':')[0]) - parseInt(event.startTime.split(':')[0])}시간
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 현재 시간 표시선 (오늘인 경우) */}
        {isToday() && (
          <div className="absolute left-0 right-0 pointer-events-none z-20">
            {(() => {
              const now = new Date()
              const currentHour = now.getHours()
              const currentMinutes = now.getMinutes()
              const topPosition = 80 + (currentHour * 60) + (currentMinutes / 60 * 60)
              
              return (
                <>
                  {/* 시간 표시선 */}
                  <div
                    className="bg-red-500 h-0.5 opacity-90"
                    style={{
                      position: 'absolute',
                      top: `${topPosition}px`,
                      left: '80px',
                      right: '0'
                    }}
                  />
                  {/* 현재 시간 라벨 */}
                  <div
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded-r-md font-medium"
                    style={{
                      position: 'absolute',
                      top: `${topPosition - 12}px`,
                      left: '0',
                      width: '80px'
                    }}
                  >
                    {now.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    })}
                  </div>
                </>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

export default DayView
