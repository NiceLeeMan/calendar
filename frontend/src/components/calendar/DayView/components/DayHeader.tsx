/**
 * DayView 헤더 컴포넌트
 * 날짜 정보 표시
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import React from 'react'

interface DayHeaderProps {
  currentDate: Date
  isToday: boolean
}

const DayHeader = ({ currentDate, isToday }: DayHeaderProps) => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 p-4">
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          {currentDate.toLocaleDateString('ko-KR', { weekday: 'long' })}
        </div>
        <div className={`text-3xl font-bold mt-1 ${
          isToday 
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
  )
}

export default DayHeader
