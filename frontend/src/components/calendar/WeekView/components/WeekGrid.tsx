/**
 * WeekView 그리드 컴포넌트
 * 시간 슬롯과 일정 표시
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import React from 'react'

interface TimeSlot {
  hour: number
  label: string
  time24: string
}

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
}

interface WeekGridProps {
  timeSlots: TimeSlot[]
  weekDays: Date[]
  onDateSelect: (date: Date) => void
  getEventsForDateTime: (date: Date, hour: number) => Event[]
  getEventStyle: (event: Event, hour: number) => React.CSSProperties | null
}

const WeekGrid = ({ 
  timeSlots, 
  weekDays, 
  onDateSelect, 
  getEventsForDateTime, 
  getEventStyle 
}: WeekGridProps) => {
  
  return (
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
  )
}

export default WeekGrid
