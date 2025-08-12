/**
 * CalendarPage - 메인 캘린더 페이지
 * 
 * @features
 * - 실시간 계획 추가 및 UI 업데이트
 * - Month/Week/Day 뷰 지원
 * - 계획 데이터와 사이드바 연동
 * - 상태 관리 최적화 (메모이제이션)
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-12 - 실시간 UI 업데이트 기능 추가
 */

import { useState, useMemo } from 'react'
import CalendarHeader from '../components/calendar/CalendarHeader'
import MonthView from '../components/calendar/MonthView'
import WeekView from '../components/calendar/WeekView'
import DayView from '../components/calendar/DayView'
import CalendarSidebar from '../components/calendar/CalendarSidebar'
import PlanCreateModal from '../components/calendar/PlanCreateModal'
import { PlanResponse } from '../types/plan'
import { useMonthlyPlans } from '../components/calendar/MonthView/hooks'

interface CalendarPageProps {
  onNavigateToMain: () => void
}

const CalendarPage = ({ onNavigateToMain }: CalendarPageProps) => {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // 새로 생성된 계획 상태 - 실시간 UI 업데이트용
  const [newCreatedPlan, setNewCreatedPlan] = useState<PlanResponse | null>(null)

  // 일정 추가 버튼 클릭 핸들러
  const handleAddPlan = () => {
    setIsModalOpen(true)
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // 계획 생성 성공 핸들러 - 실시간 UI 업데이트
  const handlePlanCreated = (createdPlan: PlanResponse) => {
    setNewCreatedPlan(createdPlan)
    
    // 일정 시간 후 상태 초기화 (다음 생성을 위해)
    setTimeout(() => {
      setNewCreatedPlan(null)
    }, 1000)
  }

  // 월별 계획 데이터 가져오기 (사이드바용)
  const { getPlansForDate } = useMonthlyPlans({ 
    currentDate, 
    newPlan: newCreatedPlan 
  })

  // 선택된 날짜의 계획 가져오기 (메모이제이션)
  const selectedDatePlans = useMemo(() => {
    return selectedDate ? getPlansForDate(selectedDate) : []
  }, [selectedDate, getPlansForDate])

  // 더미 이벤트 데이터 (DayView용 - 추후 실제 API로 교체 예정)
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

  // 현재 날짜의 이벤트 가져오기 (DayView용)
  const getCurrentDateEvents = () => {
    const dateString = currentDate.toISOString().split('T')[0]
    return dummyEvents.filter(event => event.date === dateString)
  }

  const currentDateEvents = getCurrentDateEvents()

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
                newPlan={newCreatedPlan}
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
                onDateSelect={(date) => {
                  setCurrentDate(date)
                  setSelectedDate(date)
                }}
                events={currentDateEvents}
              />
            )}
          </div>

          {/* 사이드바 영역 - DayView가 아닐 때만 표시 */}
          {currentView !== 'day' && (
            <CalendarSidebar
              selectedDate={selectedDate}
              plans={selectedDatePlans}
              onAddPlan={handleAddPlan}
            />
          )}
        </div>
      </div>

      {/* 일정 추가 모달 - Month와 Week 뷰용 */}
      {currentView !== 'day' && (
        <PlanCreateModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedDate={selectedDate || currentDate}
          onPlanCreated={handlePlanCreated}
        />
      )}
    </div>
  )
}

export default CalendarPage
