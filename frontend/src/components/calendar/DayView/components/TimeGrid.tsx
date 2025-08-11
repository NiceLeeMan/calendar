/**
 * DayView 시간 그리드 컴포넌트
 * 24시간 시간대 표시 및 현재 시간 라인
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

interface TimeGridProps {
  timeSlots: TimeSlot[]
  currentTimePosition: { topPosition: number; currentTimeLabel: string } | null
  children: React.ReactNode
}

const TimeGrid = ({ timeSlots, currentTimePosition, children }: TimeGridProps) => {
  return (
    <div className="max-h-[600px] overflow-y-auto relative">
      {/* 스크롤 가능한 시간 컨테이너 */}
      <div className="relative" style={{ height: `${timeSlots.length * 60}px` }}>
        {/* 시간 그리드 배경 */}
        {timeSlots.map((slot, index) => (
          <div
            key={slot.hour}
            className={`flex border-b border-gray-100 hover:bg-blue-25 transition-colors ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
            }`}
            style={{ 
              height: '60px',
              position: 'absolute',
              top: `${index * 60}px`,
              left: 0,
              right: 0
            }}
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

        {/* 이벤트 오버레이 */}
        {children}

        {/* 현재 시간 표시선 (오늘인 경우) */}
        {currentTimePosition && (
          <div className="absolute left-0 right-0 pointer-events-none z-20">
            {/* 시간 표시선 */}
            <div
              className="bg-red-500 h-0.5 opacity-90"
              style={{
                position: 'absolute',
                top: `${currentTimePosition.topPosition}px`,
                left: '80px',
                right: '0'
              }}
            />
            {/* 현재 시간 라벨 */}
            <div
              className="bg-red-500 text-white text-xs px-2 py-1 rounded-r-md font-medium"
              style={{
                position: 'absolute',
                top: `${currentTimePosition.topPosition - 12}px`,
                left: '0',
                width: '80px'
              }}
            >
              {currentTimePosition.currentTimeLabel}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TimeGrid
