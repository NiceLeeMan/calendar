/**
 * 일별 일정 관리 훅
 * 더미 데이터, 일정 필터링, 위치 계산 로직
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useMemo } from 'react'

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
}

interface UseDayEventsProps {
  currentDate: Date
  events?: Event[]
}

interface UseDayEventsReturn {
  getDayEvents: () => Event[]
  getEventsForHour: (hour: number) => Event[]
  getEventStyle: (event: Event) => React.CSSProperties
  getOverlappingEvents: () => Array<Event & { style: React.CSSProperties }>
}

export const useDayEvents = ({ 
  currentDate, 
  events = [] 
}: UseDayEventsProps): UseDayEventsReturn => {

  // 더미 이벤트 데이터
  const dummyEvents: Event[] = [
    { id: 1, title: "Morning standup", date: "2025-08-06", startTime: "09:00", endTime: "09:30", color: "bg-blue-500" },
    { id: 2, title: "Deep work", date: "2025-08-06", startTime: "10:00", endTime: "12:00", color: "bg-blue-600" },
    { id: 3, title: "Lunch break", date: "2025-08-06", startTime: "12:00", endTime: "13:00", color: "bg-green-500" },
    { id: 4, title: "One-on-one w/ Eva", date: "2025-08-06", startTime: "14:00", endTime: "15:00", color: "bg-indigo-500" },
    { id: 5, title: "Design sync", date: "2025-08-06", startTime: "15:30", endTime: "16:30", color: "bg-purple-500" },
    { id: 6, title: "SEO planning", date: "2025-08-06", startTime: "17:00", endTime: "18:00", color: "bg-orange-500" },
    { id: 7, title: "Team retrospective", date: "2025-08-06", startTime: "16:00", endTime: "17:00", color: "bg-teal-500" },
    { id: 8, title: "Meetup event", date: "2025-08-06", startTime: "19:00", endTime: "21:00", color: "bg-red-500" }
  ]

  // 현재 날짜의 이벤트 가져오기
  const getDayEvents = (): Event[] => {
    const dateString = currentDate.toISOString().split('T')[0]
    return dummyEvents.filter(event => event.date === dateString)
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
