/**
 * DayView 이벤트 오버레이 컴포넌트
 * 일정들을 시간 그리드 위에 표시
 * 
 * @features
 * - 우클릭 컨텍스트 메뉴 지원
 * - 일정 삭제/수정 기능
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import React from 'react'
import { PlanResponse } from '../../../../types/plan'

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
  originalPlan?: PlanResponse  // 원본 계획 데이터
}

interface EventOverlayProps {
  eventsWithPositions: Array<Event & { style: React.CSSProperties }>
  onDateSelect: (date: Date) => void
  currentDate: Date
  onPlanContextMenu?: (event: React.MouseEvent, plan: PlanResponse, targetDate: string) => void
}

const DayPlanBlock = ({ eventsWithPositions, currentDate, onPlanContextMenu }: EventOverlayProps) => {
  const handlePlanContextMenu = (event: React.MouseEvent, planEvent: Event & { style: React.CSSProperties }) => {
    if (onPlanContextMenu && planEvent.originalPlan) {
      const targetDate = currentDate.toISOString().split('T')[0]
      onPlanContextMenu(event, planEvent.originalPlan, targetDate)
    }
  }

  return (
    <>
      {eventsWithPositions.map((event) => (
        <div
          key={event.id}
          style={event.style}
          className={`${event.color || 'bg-blue-500'} text-white rounded-lg shadow-md border-2 border-white border-opacity-20 cursor-pointer transition-all hover:shadow-lg hover:scale-105`}
          title={`${event.title} (${event.startTime} - ${event.endTime})`}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handlePlanContextMenu(e, event)
          }}
          onClick={(e) => {
            e.stopPropagation() // 날짜 선택 이벤트 방지
          }}
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

export default DayPlanBlock
