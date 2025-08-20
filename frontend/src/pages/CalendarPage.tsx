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
import { useNavigate } from 'react-router-dom'
import CalendarHeader from '../components/calendar/CalendarHeader/CalendarHeader.tsx'
import MonthView from '../components/calendar/MonthView/MonthView.tsx'
import WeekView from '../components/calendar/WeekView/WeekView.tsx'
import DayView from '../components/calendar/DayView/DayView.tsx'
import CalendarSidebar from '../components/calendar/CalendarSideBar/CalendarSidebar.tsx'
import PlanCreateModal from '../components/calendar/PlanCreateModal/PlanCreateModal.tsx'
import { PlanResponse } from '../types'
import { useMonthlyPlans } from '../components/calendar/MonthView/hooks'

const CalendarPage = () => {

  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PlanResponse | null>(null) // 수정할 계획
  
  // 새로 생성된 계획 상태 - 실시간 UI 업데이트용
  const [newCreatedPlan, setNewCreatedPlan] = useState<PlanResponse | null>(null)

  const handleNavigateToMain = () => {
    navigate('/')
  }

  // 일정 추가 버튼 클릭 핸들러
  const handleOpenPlanCreateModal = (date?: Date) => {
    if (date) {
      setSelectedDate(date) // 전달받은 날짜로 선택된 날짜 설정
    }
    setIsModalOpen(true)
  }

  // 모달 닫기 핸들러
  const handleClosePlanCreateModal = () => {
    setIsModalOpen(false)
    setEditingPlan(null) // 수정 상태 초기화
  }

  // 계획 수정 핸들러
  const handleEditPlan = (plan: PlanResponse) => {
    setEditingPlan(plan)
    setIsModalOpen(true)
  }

  // 계획 생성 성공 핸들러 - 실시간 UI 업데이트
  const handlePlanCreated = (createdPlan: PlanResponse) => {
    setNewCreatedPlan(createdPlan)
    
    // 일정 시간 후 상태 초기화 (다음 생성을 위해)
    setTimeout(() => {
      setNewCreatedPlan(null)
    }, 1000)
  }

  // 계획 수정 성공 핸들러 - 실시간 UI 업데이트
  const handlePlanUpdated = (updatedPlan: PlanResponse) => {
    // 수정된 계획으로 실시간 업데이트 (생성과 동일한 메커니즘 사용)
    setNewCreatedPlan(updatedPlan)
    
    // 일정 시간 후 상태 초기화
    setTimeout(() => {
      setNewCreatedPlan(null)
    }, 1000)
  }

  // 월별 계획 데이터 가져오기 (모든 View와 사이드바용)
  const { 
    plans,
    isLoading,
    error,
    getPlansForDate, 
    getColorForPlan,
    refreshCurrentMonth 
  } = useMonthlyPlans({
    currentDate, 
    newPlan: newCreatedPlan
  })

  // 선택된 날짜의 계획 가져오기 (메모이제이션)
  const selectedDatePlans = useMemo(() => {
    return selectedDate ? getPlansForDate(selectedDate) : []
  }, [selectedDate, getPlansForDate])



  return (
    <div className="min-h-screen bg-gray-50">
      {/* CalendarHeader 컴포넌트 사용 */}
      <CalendarHeader
        currentView={currentView}
        currentDate={currentDate}
        onViewChange={setCurrentView}
        onDateChange={setCurrentDate}
        onNavigateToMain={handleNavigateToMain}
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
                onEditPlan={handleEditPlan}
                plans={plans}
                isLoading={isLoading}
                error={error}
                getPlansForDate={getPlansForDate}
                getColorForPlan={getColorForPlan}
                newPlan={newCreatedPlan}
              />
            )}
            
            {currentView === 'week' && (
              <WeekView
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onEditPlan={handleEditPlan}
                plans={plans}
              />
            )}
            
            {currentView === 'day' && (
              <DayView
                currentDate={currentDate}
                onDateSelect={(date) => {
                  setCurrentDate(date)
                  setSelectedDate(date)
                }}
                onEditPlan={handleEditPlan}
                plans={plans}
                onPlanCreated={handlePlanCreated}
                onPlanUpdated={handlePlanUpdated}
                onRefreshMonth={refreshCurrentMonth}
              />
            )}
          </div>

          {/* 사이드바 영역 - DayView가 아닐 때만 표시 */}
          {currentView !== 'day' && (
            <CalendarSidebar
              selectedDate={selectedDate}
              plans={selectedDatePlans}
              onAddPlan={handleOpenPlanCreateModal}
            />
          )}
        </div>
      </div>

      {/* 일정 추가/수정 모달 - Month와 Week 뷰용 (Day는 자체 모달 사용) */}
      {currentView !== 'day' && (
        <PlanCreateModal 
          isOpen={isModalOpen}
          onClose={handleClosePlanCreateModal}
          selectedDate={selectedDate || currentDate}
          editPlan={editingPlan}
          onPlanCreated={handlePlanCreated}
          onPlanUpdated={handlePlanUpdated}
          onRefreshMonth={refreshCurrentMonth}
          currentDate={currentDate}
        />
      )}
    </div>
  )
}

export default CalendarPage
