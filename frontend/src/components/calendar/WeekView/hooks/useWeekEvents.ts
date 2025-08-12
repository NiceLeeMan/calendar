/**
 * 주별 일정 관리 훅
 * 실제 API 데이터 기반 일정 필터링, 위치 계산 로직
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-12 - 실시간 계획 업데이트 지원, 더미 데이터 제거
 */

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

interface UseWeekEventsProps {
  plans?: PlanResponse[]
  getColorForPlan?: (planId: number) => string
}

interface UseWeekEventsReturn {
  getEventsForDateTime: (date: Date, hour: number) => Event[]
  getEventStyle: (event: Event, hour: number) => React.CSSProperties | null
  getOverlappingEventsForDateTime: (date: Date, hour: number) => Array<Event & { style: React.CSSProperties }>
}

export const useWeekEvents = ({ plans = [], getColorForPlan }: UseWeekEventsProps = {}): UseWeekEventsReturn => {

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

  // 실제 계획만 사용
  const allEvents = convertPlansToEvents(plans)

  // 특정 날짜와 시간의 이벤트 가져오기
  const getEventsForDateTime = (date: Date, hour: number): Event[] => {
    const dateString = date.toISOString().split('T')[0]
    return allEvents.filter(event => {
      if (event.date !== dateString) return false
      
      const eventStart = parseInt(event.startTime.split(':')[0])
      const eventEnd = parseInt(event.endTime.split(':')[0])
      
      // 이벤트가 이 시간대에 걸쳐있는지 확인
      return hour >= eventStart && hour < eventEnd
    })
  }

  // 겹치는 이벤트들의 위치 계산 (가로 분할 방식)
  const getOverlappingEventsForDateTime = (date: Date, hour: number): Array<Event & { style: React.CSSProperties }> => {
    const events = getEventsForDateTime(date, hour)
    
    if (events.length === 0) return []
    
    // 디버깅용 로그
    if (events.length > 1) {
      console.log(`겹치는 이벤트 발견 - 날짜: ${date.toISOString().split('T')[0]}, 시간: ${hour}시, 이벤트 수: ${events.length}`)
      console.log('이벤트들:', events.map(e => `${e.title} (${e.startTime}-${e.endTime})`))
    }
    
    // 각 이벤트의 전체 기간을 분 단위로 계산
    const eventsWithTime = events.map(event => {
      const startParts = event.startTime.split(':')
      const endParts = event.endTime.split(':')
      const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1])
      const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1])
      
      return {
        ...event,
        startMinutes,
        endMinutes
      }
    })

    // 겹치는 이벤트들을 찾아서 그룹화
    const groups: Array<Array<typeof eventsWithTime[0]>> = []
    
    eventsWithTime.forEach(event => {
      let placed = false
      
      // 기존 그룹들과 겹치는지 확인
      for (const group of groups) {
        const overlapsWithGroup = group.some(groupEvent => 
          !(event.endMinutes <= groupEvent.startMinutes || event.startMinutes >= groupEvent.endMinutes)
        )
        
        if (overlapsWithGroup) {
          group.push(event)
          placed = true
          break
        }
      }
      
      // 어떤 그룹과도 겹치지 않으면 새 그룹 생성
      if (!placed) {
        groups.push([event])
      }
    })

    // 각 그룹의 이벤트들을 가로로 배치
    const result: Array<Event & { style: React.CSSProperties }> = []
    
    groups.forEach(group => {
      const groupSize = group.length
      
      if (groupSize > 1) {
        console.log(`가로 배치 적용 - 그룹 크기: ${groupSize}`)
      }
      
      group.forEach((event, index) => {
        // 현재 시간 슬롯(hour) 내에서의 표시 위치 계산
        const slotStartMinutes = hour * 60
        const slotEndMinutes = (hour + 1) * 60
        
        // 이벤트가 현재 슬롯과 겹치는 부분만 계산
        const visibleStart = Math.max(event.startMinutes, slotStartMinutes)
        const visibleEnd = Math.min(event.endMinutes, slotEndMinutes)
        
        if (visibleStart >= visibleEnd) return // 현재 슬롯에 표시할 부분이 없음
        
        const offsetInSlot = visibleStart - slotStartMinutes
        const durationInSlot = visibleEnd - visibleStart
        
        const topPercent = (offsetInSlot / 60) * 100
        const heightPercent = (durationInSlot / 60) * 100
        
        // 가로 배치: 너비를 그룹 크기로 나누고 인덱스에 따라 위치 지정
        const widthPercent = 100 / groupSize
        const leftPercent = index * widthPercent
        
        if (groupSize > 1) {
          console.log(`${event.title} - left: ${leftPercent}%, width: ${widthPercent}%`)
        }
        
        result.push({
          ...event,
          style: {
            position: 'absolute',
            left: `${leftPercent + 1}%`,
            width: `${widthPercent - 2}%`,
            top: `${topPercent + 1}%`,
            height: `${Math.max(heightPercent - 2, 25)}%`,
            zIndex: 10 + index
          }
        })
      })
    })
    
    return result
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
    getEventStyle,
    getOverlappingEventsForDateTime
  }
}
