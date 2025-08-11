/**
 * WeekView 헤더 컴포넌트
 * 요일과 날짜 표시
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import React from 'react'

interface WeekHeaderProps {
  weekDays: Date[]
  onDateSelect: (date: Date) => void
  isToday: (date: Date) => boolean
  isSelected: (date: Date) => boolean
}

const WeekHeader = ({ weekDays, onDateSelect, isToday, isSelected }: WeekHeaderProps) => {
  const weekDayNames = ['일', '월', '화', '수', '목', '금', '토']

  return (
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
  )
}

export default WeekHeader
