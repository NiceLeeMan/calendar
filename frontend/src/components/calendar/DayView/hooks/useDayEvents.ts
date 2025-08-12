/**
 * 일별 일정 관리 훅
 * 실제 API 데이터와 더미 데이터 혼합, 일정 필터링, 위치 계산 로직
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-12 - 실시간 계획 업데이트 지원
 */

import { useMemo } from 'react'
import { PlanResponse } from '../../../../types/plan'

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
  originalPlanId?: number  // 원본 계획 ID (다중 날짜 이벤트 추적용)
}

interface UseDayEventsProps {
  currentDate: Date
  events?: Event[]
  plans?: PlanResponse[]
  getColorForPlan?: (planId: number) => string
}

interface UseDayEventsReturn {
  getDayEvents: () => Event[]
  getEventsForHour: (hour: number) => Event[]
  getEventStyle: (event: Event) => React.CSSProperties
  getOverlappingEvents: () => Array<Event & { style: React.CSSProperties }>
}

export const useDayEvents = ({ 
  currentDate, 
  events = [],
  plans = [],
  getColorForPlan
}: UseDayEventsProps): UseDayEventsReturn => {

  // 기본 컬러 팔레트 (fallback)
  const defaultColors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
    'bg-blue-600', 'bg-indigo-500', 'bg-pink-500', 'bg-yellow-500',
    'bg-red-500', 'bg-teal-500', 'bg-rose-500', 'bg-cyan-500'
  ]

  // 색상 할당 함수
  const getEventColor = (planId: number): string => {
    if (getColorForPlan) {
      return getColorForPlan(planId)
    }
    return defaultColors[planId % defaultColors.length]
  }

  // 실제 계획을 Event 형태로 변환 (다중 날짜 지원)
  const convertPlansToEvents = (plans: PlanResponse[]): Event[] => {
    const events: Event[] = []
    
    plans.forEach(plan => {
      const startDate = new Date(plan.startDate)
      const endDate = new Date(plan.endDate)
      
      // 시작일부터 종료일까지 각 날짜별로 이벤트 생성
      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        events.push({
          id: plan.id + parseInt(currentDate.getTime().toString().slice(-3)), // 고유 ID 생성
          title: plan.planName,
          date: currentDate.toISOString().split('T')[0],
          startTime: plan.startTime || '00:00',
          endTime: plan.endTime || '23:59',
          color: getEventColor(plan.id),
          originalPlanId: plan.id // 원본 계획 ID 추가
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })
    
    return events
  }

  // 더미 이벤트 데이터
  const dummyEvents: Event[] = [
    { id: 2001, title: "Morning standup", date: "2025-08-06", startTime: "09:00", endTime: "09:30", color: "bg-blue-500" },
    { id: 2002, title: "Deep work", date: "2025-08-06", startTime: "10:00", endTime: "12:00", color: "bg-blue-600" },
    { id: 2003, title: "Lunch break", date: "2025-08-06", startTime: "12:00", endTime: "13:00", color: "bg-green-500" },
    { id: 2004, title: "One-on-one w/ Eva", date: "2025-08-06", startTime: "14:00", endTime: "15:00", color: "bg-indigo-500" },
    { id: 2005, title: "Design sync", date: "2025-08-06", startTime: "15:30", endTime: "16:30", color: "bg-purple-500" },
    { id: 2006, title: "SEO planning", date: "2025-08-06", startTime: "17:00", endTime: "18:00", color: "bg-orange-500" },
    { id: 2007, title: "Team retrospective", date: "2025-08-06", startTime: "16:00", endTime: "17:00", color: "bg-teal-500" },
    { id: 2008, title: "Meetup event", date: "2025-08-06", startTime: "19:00", endTime: "21:00", color: "bg-red-500" }
  ]

  // 모든 이벤트 결합 (실제 계획 + 기존 더미 + 전달받은 이벤트)
  const allEvents = useMemo(() => {
    return [...convertPlansToEvents(plans), ...dummyEvents, ...events]
  }, [plans, events])

  // 현재 날짜의 이벤트 가져오기
  const getDayEvents = (): Event[] => {
    const dateString = currentDate.toISOString().split('T')[0]
    return allEvents.filter(event => event.date === dateString)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  // 특정 시간대의 이벤트 가져오기
  const getEventsForHour = (hour: number): Event[] => {
    const dayEvents = getDayEvents()
    return dayEvents.filter(event => {
      const eventStart = parseInt(event.startTime.split(':')[0])
      const eventEnd = parseInt(event.endTime.split(':')[0])
      return hour >= eventStart && hour < eventEnd
    })
  }

  // 이벤트의 위치와 크기 계산
  const getEventStyle = (event: Event): React.CSSProperties => {
    const eventStart = parseInt(event.startTime.split(':')[0])
    const eventStartMinutes = parseInt(event.startTime.split(':')[1])
    const eventEnd = parseInt(event.endTime.split(':')[0])
    const eventEndMinutes = parseInt(event.endTime.split(':')[1])
    
    const totalStartMinutes = eventStart * 60 + eventStartMinutes
    const totalEndMinutes = eventEnd * 60 + eventEndMinutes
    const durationMinutes = totalEndMinutes - totalStartMinutes
    
    // 하루를 1440분(24시간 * 60분)으로 계산
    const topPercentage = (totalStartMinutes / 1440) * 100
    const heightPercentage = (durationMinutes / 1440) * 100
    
    return {
      position: 'absolute',
      top: `${topPercentage}%`,
      left: '8px',
      right: '8px',
      height: `${heightPercentage}%`,
      zIndex: 10,
      minHeight: '32px' // 최소 높이 보장
    }
  }

  // 겹치는 이벤트들의 위치 조정
  const getOverlappingEvents = () => {
    const dayEvents = getDayEvents()
    const eventsWithStyles = dayEvents.map(event => ({
      ...event,
      style: getEventStyle(event)
    }))

    // 겹치는 이벤트들을 그룹으로 묶기
    const overlappingGroups: Array<Array<typeof eventsWithStyles[0]>> = []
    
    eventsWithStyles.forEach(event => {
      const eventStart = parseInt(event.startTime.split(':')[0]) * 60 + parseInt(event.startTime.split(':')[1])
      const eventEnd = parseInt(event.endTime.split(':')[0]) * 60 + parseInt(event.endTime.split(':')[1])
      
      let addedToGroup = false
      
      for (let group of overlappingGroups) {
        const hasOverlap = group.some(groupEvent => {
          const groupStart = parseInt(groupEvent.startTime.split(':')[0]) * 60 + parseInt(groupEvent.startTime.split(':')[1])
          const groupEnd = parseInt(groupEvent.endTime.split(':')[0]) * 60 + parseInt(groupEvent.endTime.split(':')[1])
          
          return (eventStart < groupEnd && eventEnd > groupStart)
        })
        
        if (hasOverlap) {
          group.push(event)
          addedToGroup = true
          break
        }
      }
      
      if (!addedToGroup) {
        overlappingGroups.push([event])
      }
    })

    // 각 그룹의 이벤트들 위치 조정
    return overlappingGroups.flatMap(group => 
      group.map((event, index) => ({
        ...event,
        style: {
          ...event.style,
          left: `${8 + (index * (100 / group.length) * 0.9)}%`,
          width: `${(100 / group.length) * 0.9}%`
        }
      }))
    )
  }

  return {
    getDayEvents,
    getEventsForHour,
    getEventStyle,
    getOverlappingEvents
  }
}
