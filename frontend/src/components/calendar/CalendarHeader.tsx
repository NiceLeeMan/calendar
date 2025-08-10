import React, { useState } from 'react'
import DatePicker from '../ui/DatePicker'

interface CalendarHeaderProps {
  currentView: 'month' | 'week' | 'day'
  currentDate: Date
  onViewChange: (view: 'month' | 'week' | 'day') => void
  onDateChange: (date: Date) => void
  onNavigateToMain: () => void
}

const CalendarHeader = ({
  currentView,
  currentDate,
  onViewChange,
  onDateChange,
  onNavigateToMain
}: CalendarHeaderProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  
  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    onDateChange(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  // 날짜 선택기 열기/닫기
  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen)
  }

  const handleDatePickerChange = (date: Date) => {
    onDateChange(date)
    setIsDatePickerOpen(false)
  }

  const getDateDisplayText = () => {
    switch (currentView) {
      case 'month':
        return {
          primary: currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }),
          secondary: `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`
        }
      case 'week':
        const weekStart = new Date(currentDate)
        weekStart.setDate(currentDate.getDate() - currentDate.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return {
          primary: `${weekStart.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}`,
          secondary: `Week ${Math.ceil(currentDate.getDate() / 7)}`
        }
      case 'day':
        return {
          primary: currentDate.toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long' 
          }),
          secondary: currentDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        }
      default:
        return { primary: '', secondary: '' }
    }
  }

  const dateDisplay = getDateDisplayText()

  return (
    <>
      {/* 상단 헤더 - 타이틀과 뷰 전환 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* 좌측: 타이틀과 메인으로 버튼 */}
            <div className="flex items-center gap-4">
              <button
                onClick={onNavigateToMain}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                메인으로
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-blue-600">Calendar</h1>
            </div>

            {/* 우측: 뷰 전환 버튼 */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['month', 'week', 'day'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => onViewChange(view)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === view
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {view === 'month' && 'Month'}
                  {view === 'week' && 'Week'}
                  {view === 'day' && 'Day'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 헤더 - 날짜 이동 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* 날짜 네비게이션 */}
            <div className="flex items-center gap-6">
              <button
                onClick={navigatePrevious}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                이전
              </button>
              
              <div className="text-center min-w-[200px] relative">
                <button
                  onClick={toggleDatePicker}
                  className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {dateDisplay.primary}
                </button>
                <p className="text-sm text-gray-500 mt-1">
                  {dateDisplay.secondary}
                </p>
                
                {/* 날짜 선택기 */}
                {isDatePickerOpen && (
                  <DatePicker
                    currentDate={currentDate}
                    onDateChange={handleDatePickerChange}
                    onClose={() => setIsDatePickerOpen(false)}
                  />
                )}
              </div>

              <button
                onClick={navigateNext}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                다음
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 우측: 오늘 버튼과 추가 액션 */}
            <div className="flex items-center gap-3">
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              >
                오늘
              </button>
              
              {/* 미니 캘린더 토글 버튼 (미래 구현용) */}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CalendarHeader
