import { useState } from 'react'
import CalendarHeader from '../components/calendar/CalendarHeader'
import MonthView from '../components/calendar/MonthView'
import WeekView from '../components/calendar/WeekView'
import DayView from '../components/calendar/DayView'
import CalendarSidebar from '../components/calendar/CalendarSidebar'

interface CalendarPageProps {
  onNavigateToMain: () => void
}

const CalendarPage = ({ onNavigateToMain }: CalendarPageProps) => {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  // 더미 이벤트 데이터 (MonthView와 동일)
  const dummyEvents = [
    { id: 1, title: "All-hands meeting", date: "2025-08-01", startTime: "09:00", endTime: "10:00" },
    { id: 2, title: "Dinner with Candice", date: "2025-08-01", startTime: "19:00", endTime: "21:00" },
    { id: 3, title: "Coffee with Ali", date: "2025-08-04", startTime: "10:00", endTime: "11:00" },
    { id: 4, title: "Marketing site kickoff", date: "2025-08-04", startTime: "14:00", endTime: "15:30" },
    { id: 5, title: "Deep work", date: "2025-08-06", startTime: "09:00", endTime: "11:00" },
    { id: 6, title: "One-on-one w/ Eva", date: "2025-08-06", startTime: "14:00", endTime: "15:00" },
    { id: 7, title: "Design sync", date: "2025-08-06", startTime: "16:00", endTime: "17:00" },
    { id: 8, title: "SEO planning", date: "2025-08-06", startTime: "17:30", endTime: "18:30" },
    { id: 9, title: "Meetup event", date: "2025-08-06", startTime: "19:00", endTime: "21:00" },
    { id: 10, title: "Lunch with Olivia", date: "2025-08-07", startTime: "12:00", endTime: "13:30" }
  ]

  // 선택된 날짜의 이벤트 가져오기
  const getSelectedDateEvents = () => {
    if (!selectedDate) return []
    const dateString = selectedDate.toISOString().split('T')[0]
    return dummyEvents.filter(event => event.date === dateString)
  }

  const selectedEvents = getSelectedDateEvents()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* CalendarHeader 컴포넌트 사용 */}
      <CalendarHeader
        currentView={currentView}
        currentDate={currentDate}
        onViewChange={setCurrentView}
        onDateChange={setCurrentDate}
        onNavigateToMain={onNavigateToMain}
      />

      {/* 메인 캘린더 영역 */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 캘린더 뷰 영역 */}
          <div className="flex-1">
            {currentView === 'month' && (
              <MonthView
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            )}
            
            {currentView === 'week' && (
              <WeekView
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            )}
            
            {currentView === 'day' && (
              <DayView
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            )}
          </div>

          {/* 사이드바 영역 */}
          <CalendarSidebar
            selectedDate={selectedDate}
            events={selectedEvents}
          />
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
