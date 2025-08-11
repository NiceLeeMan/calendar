/**
 * DayView 이벤트 오버레이 컴포넌트
 * 일정들을 시간 그리드 위에 표시
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import React from 'react'

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
}

interface EventOverlayProps {
  eventsWithPositions: Array<Event & { style: React.CSSProperties }>
  onDateSelect: (date: Date) => void
  currentDate: Date
}

const EventOverlay = ({ eventsWithPositions, onDateSelect, currentDate }: EventOverlayProps) => {
  return (
    <>
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
    </>
  )
}

export default EventOverlay
