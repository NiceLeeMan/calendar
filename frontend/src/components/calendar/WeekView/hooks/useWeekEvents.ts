/**
 * 주별 일정 관리 훅
 * 실제 API 데이터 기반 일정 필터링, 위치 계산 로직
 *
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-12 - 실시간 계획 업데이트 지원, 더미 데이터 제거
 */

import { PlanResponse } from '../../../../types/plan'
import { planEventManager } from '../../../../utils/planEventManager'
import { useState, useEffect } from 'react'

interface planBlock {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
  originalPlanId?: number  // 원본 계획 ID (다중 날짜 이벤트 추적용)
  originalPlan?: PlanResponse  // 원본 계획 데이터
}

interface UseWeekEventsProps {
  plans?: PlanResponse[]
  getColorForPlan?: (planId: number) => string
}

interface UseWeekEventsReturn {
  getEventsForDateTime: (date: Date, hour: number) => planBlock[]
  getOverlappingEventsForDateTime: (date: Date, hour: number) => Array<planBlock & { style: React.CSSProperties }>
}

export const useWeekEvents = ({ plans = [], getColorForPlan }: UseWeekEventsProps = {}): UseWeekEventsReturn => {
  const [currentPlans, setCurrentPlans] = useState<PlanResponse[]>(plans)

  // plans prop이 변경될 때 상태 업데이트
  useEffect(() => {
    setCurrentPlans(plans)
  }, [plans])

  // 계획 삭제 이벤트 감지
  useEffect(() => {
    const handlePlanDeleted = (planId: number) => {
      setCurrentPlans(prevPlans => {
        const updatedPlans = prevPlans.filter(plan => plan.id !== planId)
        return updatedPlans
      })
    }

    planEventManager.addPlanDeletedListener(handlePlanDeleted)

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      const handler = (event: CustomEvent) => handlePlanDeleted(event.detail.planId)
      planEventManager.removePlanDeletedListener(handler as EventListener)
    }
  }, [])

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

  // 실제 계획을 CalendarEvent 형태로 변환 (다중 날짜 지원)
  const createWeekPlanBlocks = (plans: PlanResponse[]): planBlock[] => {
    const planBlocks: planBlock[] = []
    const blockMap = new Map<string, boolean>() // 중복 방지를 위한 Map (key: planId-date)

    plans.forEach(plan => {
      // MonthView/DayView와 동일한 방식으로 로컬 시간대로 파싱
      const startDate = new Date(plan.startDate + 'T00:00:00')
      const endDate = new Date(plan.endDate + 'T00:00:00')

      // 시작일부터 종료일까지 각 날짜별로 이벤트 생성
      const currentDate = new Date(startDate)

      // 반복 계획인 경우 반복 종료일 확인
      let actualEndDate = endDate
      if (plan.isRecurring && plan.recurringResInfo?.endDate) {
        const repeatEndDate = new Date(plan.recurringResInfo.endDate + 'T00:00:00')
        actualEndDate = repeatEndDate < endDate ? repeatEndDate : endDate
        console.log(`반복 계획 종료일 확인 - 계획: ${plan.planName}, 원래 종료일: ${plan.endDate}, 반복 종료일: ${plan.recurringResInfo.endDate}, 실제 종료일: ${actualEndDate.toISOString().split('T')[0]}`)
      }

      while (currentDate <= actualEndDate) {
        // 반복 계획인 경우 요일 확인
        if (plan.isRecurring && plan.recurringResInfo?.repeatWeekdays) {
          const dayOfWeek = currentDate.getDay()
          const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
          const currentDayName = dayNames[dayOfWeek]

          // 반복 요일에 포함되지 않으면 건너뛰기
          if (!plan.recurringResInfo.repeatWeekdays.includes(currentDayName)) {
            currentDate.setDate(currentDate.getDate() + 1)
            continue
          }
        }

        // MonthView/DayView와 동일한 방식으로 날짜 문자열 생성
        const year = currentDate.getFullYear()
        const month = String(currentDate.getMonth() + 1).padStart(2, '0')
        const day = String(currentDate.getDate()).padStart(2, '0')
        const dateString = `${year}-${month}-${day}`

        // 중복 체크: 동일한 계획이 같은 날짜에 이미 추가되었는지 확인
        const blockId = `${plan.id}-${dateString}`
        if (blockMap.has(blockId)) {
          currentDate.setDate(currentDate.getDate() + 1)
          continue
        }
        blockMap.set(blockId, true)

        // 고유 ID 생성: planId * 100000 + (월 * 100 + 일)
        const uniqueId = plan.id * 100000 + (currentDate.getMonth() + 1) * 100 + currentDate.getDate()

        planBlocks.push({
          id: uniqueId,
          title: plan.planName,
          date: dateString,
          startTime: plan.startTime || '00:00',
          endTime: plan.endTime || '23:59',
          color: getEventColor(plan.id),
          originalPlanId: plan.id, // 원본 계획 ID 추가
          originalPlan: plan // 원본 계획 데이터 추가
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })

    return planBlocks
  }

  // 실제 계획만 사용 (상태로 관리되는 plans 사용)
  const allEvents = createWeekPlanBlocks(currentPlans)

  // 특정 날짜와 시간의 이벤트 가져오기
  const getEventsForDateTime = (date: Date, hour: number): planBlock[] => {
    // MonthView/DayView와 동일한 방식으로 날짜 문자열 생성
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`

    return allEvents.filter(event => {
      if (event.date !== dateString) return false

      const eventStart = parseInt(event.startTime.split(':')[0])
      const eventEnd = parseInt(event.endTime.split(':')[0])

      // 이벤트가 이 시간대에 걸쳐있는지 확인
      return hour >= eventStart && hour < eventEnd
    })
  }

  // 1단계: 이벤트들을 시간 정보와 함께 변환
  const convertEventsWithTimeInfo = (events: planBlock[]) => {
    return events.map(event => {
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
  }

  // 2단계: 겹치는 이벤트들을 그룹으로 묶기
  const groupOverlappingEvents = (eventsWithTime: Array<planBlock & { startMinutes: number; endMinutes: number }>) => {
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

    return groups
  }

  // 3단계: 각 그룹 내 이벤트들의 레이아웃 계산
  const calculateEventLayout = (
    groups: Array<Array<planBlock & { startMinutes: number; endMinutes: number }>>,
    hour: number
  ) => {
    const result: Array<planBlock & { style: React.CSSProperties }> = []

    groups.forEach(group => {
      const groupSize = group.length

      if (groupSize > 1) {
        console.log(`가로 배치 적용 - 그룹 크기: ${groupSize}`)
      }

      group.forEach((event, index) => {
        // 이벤트가 시작하는 시간 슬롯에서만 전체 블록 표시
        const eventStartHour = parseInt(event.startTime.split(':')[0])
        if (hour !== eventStartHour) return // 시작 시간이 아니면 건너뛰기

        // 전체 이벤트의 시간과 높이 계산
        const eventStartMinutes = parseInt(event.startTime.split(':')[1])
        const eventEndHour = parseInt(event.endTime.split(':')[0])
        const eventEndMinutes = parseInt(event.endTime.split(':')[1])

        const totalDurationHours = eventEndHour - eventStartHour + (eventEndMinutes / 60)
        const offsetInSlot = eventStartMinutes / 60 * 100

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
            top: `${offsetInSlot + 1}%`,
            height: `${totalDurationHours * 100 - 2}%`,
            zIndex: 10 + index
          }
        })
      })
    })

    return result
  }

  // 4단계: 겹치는 이벤트들의 위치 계산 (가로 분할 방식)
  const getOverlappingEventsForDateTime = (date: Date, hour: number): Array<planBlock & { style: React.CSSProperties }> => {
    const events = getEventsForDateTime(date, hour)

    if (events.length === 0) return []

    // 디버깅용 로그
    if (events.length > 1) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      console.log(`겹치는 이벤트 발견 - 날짜: ${dateString}, 시간: ${hour}시, 이벤트 수: ${events.length}`)
      console.log('이벤트들:', events.map(e => `${e.title} (${e.startTime}-${e.endTime})`))
    }

    // 단계별 처리
    const eventsWithTime = convertEventsWithTimeInfo(events)
    const groups = groupOverlappingEvents(eventsWithTime)
    return calculateEventLayout(groups, hour)
  }


  return {
    getEventsForDateTime,
    getOverlappingEventsForDateTime
  }
}
