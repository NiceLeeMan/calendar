/**
 * 주별 일정 관리 훅
 * 더미 데이터, 일정 필터링, 위치 계산 로직
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
}

interface UseWeekEventsReturn {
  getEventsForDateTime: (date: Date, hour: number) => Event[]
  getEventStyle: (event: Event, hour: number) => React.CSSProperties | null
}

export const useWeekEvents = (): UseWeekEventsReturn => {

  // 더미 이벤트 데이터 (MonthView와 동일하지만 시간대 정보 활용)
  const dummyEvents: Event[] = [
    { id: 1, title: "All-hands meeting", date: "2025-08-04", startTime: "09:00", endTime: "10:00", color: "bg-blue-500" },
    { id: 2, title: "Coffee with Ali", date: "2025-08-04", startTime: "10:00", endTime: "11:00", color: "bg-purple-500" },
    { id: 3, title: "Marketing site kickoff", date: "2025-08-04", startTime: "14:00", endTime: "15:30", color: "bg-orange-500" },
    
    { id: 4, title: "Deep work", date: "2025-08-05", startTime: "09:00", endTime: "11:00", color: "bg-blue-600" },
    { id: 5, title: "One-on-one w/ Eva", date: "2025-08-05", startTime: "14:00", endTime: "15:00", color: "bg-indigo-500" },
    { id: 6, title: "Design sync", date: "2025-08-05", startTime: "16:00", endTime: "17:00", color: "bg-blue-500" },
    
    { id: 7, title: "Deep work", date: "2025-08-06", startTime: "09:00", endTime: "11:00", color: "bg-blue-600" },
    { id: 8, title: "One-on-one w/ Eva", date: "2025-08-06", startTime: "14:00", endTime: "15:00", color: "bg-indigo-500" },
    { id: 9, title: "Design sync", date: "2025-08-06", startTime: "16:00", endTime: "17:00", color: "bg-blue-500" },
    { id: 10, title: "SEO planning", date: "2025-08-06", startTime: "17:30", endTime: "18:30", color: "bg-green-500" },
    { id: 11, title: "Meetup event", date: "2025-08-06", startTime: "19:00", endTime: "21:00", color: "bg-red-500" },
    
    { id: 12, title: "Lunch with Olivia", date: "2025-08-07", startTime: "12:00", endTime: "13:30", color: "bg-pink-500" },
    
    { id: 13, title: "Friday standup", date: "2025-08-08", startTime: "09:00", endTime: "09:30", color: "bg-yellow-500" },
    { id: 14, title: "Olivia x Riley", date: "2025-08-08", startTime: "11:00", endTime: "12:00", color: "bg-green-500" },
    { id: 15, title: "Product demo", date: "2025-08-08", startTime: "15:00", endTime: "16:00", color: "bg-red-500" },
    
    { id: 16, title: "House inspection", date: "2025-08-09", startTime: "10:00", endTime: "11:30", color: "bg-teal-500" }
  ]

  // 특정 날짜와 시간의 이벤트 가져오기
  const getEventsForDateTime = (date: Date, hour: number): Event[] => {
    const dateString = date.toISOString().split('T')[0]
    return dummyEvents.filter(event => {
      if (event.date !== dateString) return false
      
      const eventStart = parseInt(event.startTime.split(':')[0])
      const eventEnd = parseInt(event.endTime.split(':')[0])
      
      // 이벤트가 이 시간대에 걸쳐있는지 확인
      return hour >= eventStart && hour < eventEnd
    })
  }

  // 이벤트의 시간대별 위치와 높이 계산
  const getEventStyle = (event: Event, hour: number): React.CSSProperties | null => {
    const eventStart = parseInt(event.startTime.split(':')[0])
    const eventStartMinutes = parseInt(event.startTime.split(':')[1])
    const eventEnd = parseInt(event.endTime.split(':')[0])
    const eventEndMinutes = parseInt(event.endTime.split(':')[1])
    
    const totalStartMinutes = eventStart * 60 + eventStartMinutes
    const totalEndMinutes = eventEnd * 60 + eventEndMinutes
    const durationMinutes = totalEndMinutes - totalStartMinutes
    
    // 현재 시간 슬롯에서 이벤트가 시작하는지 확인
    if (hour === eventStart) {
      const topOffset = (eventStartMinutes / 60) * 100
      const height = (durationMinutes / 60) * 100
      
      return {
        position: 'absolute',
        top: `${topOffset}%`,
        left: '4px',
        right: '4px',
        height: `${height}%`,
        zIndex: 10
      }
    }
    
    return null
  }

  return {
    getEventsForDateTime,
    getEventStyle
  }
}
