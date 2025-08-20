/**
 * 일별 일정 관리 훅
 * 실제 API 데이터와 더미 데이터 혼합, 일정 필터링, 위치 계산 로직
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-12 - 실시간 계획 업데이트 지원
 */

import { useMemo, useState, useEffect } from 'react'
import { PlanResponse } from '../../../../types/plan'
import { planEventManager } from '../../../../utils/planEventManager'

interface PlanBlock {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
  originalPlanId?: number  // 원본 계획 ID (다중 날짜 이벤트 추적용)
  originalPlan?: PlanResponse  // 원본 계획 데이터
}

interface UseDayEventsProps {
  currentDate: Date
  events?: PlanBlock[]
  plans?: PlanResponse[]
  getColorForPlan?: (planId: number) => string
}

interface UseDayEventsReturn {
  getDayPlanBlocks: () => PlanBlock[]
  getActivePlanBlocksForHour: (hour: number) => PlanBlock[]
  calculatePlanBlockPosition: (block: PlanBlock) => React.CSSProperties
  arrangeOverlappingBlocks: () => Array<PlanBlock & { style: React.CSSProperties }>
}

export const useDayEvents = ({ 
  currentDate, 
  events = [],
  plans = [],
  getColorForPlan
}: UseDayEventsProps): UseDayEventsReturn => {
  const [currentPlans, setCurrentPlans] = useState<PlanResponse[]>(plans)

  // plans prop이 변경될 때 상태 업데이트
  useEffect(() => {
    setCurrentPlans(plans)
  }, [plans])

  // 계획 삭제 이벤트 감지
  useEffect(() => {
    const handlePlanDeleted = (planId: number) => {
      console.log(`DayView에서 계획 삭제 감지: planId=${planId}`)
      setCurrentPlans(prevPlans => {
        const updatedPlans = prevPlans.filter(plan => plan.id !== planId)
        console.log(`DayView 삭제 후 계획 수: ${prevPlans.length} → ${updatedPlans.length}`)
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
  const assignColorToPlanBlock = (planId: number): string => {
    if (getColorForPlan) {
      return getColorForPlan(planId)
    }
    return defaultColors[planId % defaultColors.length]
  }

  // 실제 계획을 UI 블록형태로 생성
  const createDayPlanBlocks = (plans: PlanResponse[]): PlanBlock[] => {
    const planBlocks: PlanBlock[] = []
    const blockMap = new Map<string, boolean>() // 중복 방지를 위한 Map (key: planId-date)
    
    plans.forEach(plan => {
      const startDate = new Date(plan.startDate + 'T00:00:00') // 로컬 시간대로 파싱
      const endDate = new Date(plan.endDate + 'T00:00:00') // 로컬 시간대로 파싱
      
      // 시작일부터 종료일까지 각 날짜별로 이벤트 생성
      const currentDate = new Date(startDate)
      
      // 반복 계획인 경우 반복 종료일 확인
      let actualEndDate = endDate
      if (plan.isRecurring && plan.recurringResInfo?.endDate) {
        const repeatEndDate = new Date(plan.recurringResInfo.endDate + 'T00:00:00')
        actualEndDate = repeatEndDate < endDate ? repeatEndDate : endDate
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
        
        // 로컬 시간대 유지하여 날짜 문자열 생성
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
          color: assignColorToPlanBlock(plan.id),
          originalPlanId: plan.id, // 원본 계획 ID 추가
          originalPlan: plan // 원본 계획 데이터 추가
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })
    
    return planBlocks
  }

  // 모든 블록 결합 (실제 계획 + 전달받은 블록) - 상태로 관리되는 plans 사용
  const allBlocks = useMemo(() => {
    return [...createDayPlanBlocks(currentPlans), ...events]
  }, [currentPlans, events])

  // 현재 날짜의 블록들 가져오기
  const getBlocksForCurrentDate = (): PlanBlock[] => {
    // 로컬 시간대 유지하여 날짜 문자열 생성 (useMonthlyPlans와 동일한 방식)
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    
    return allBlocks.filter(block => block.date === dateString)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  // 특정 시간대의 활성 블록들 가져오기
  const getActivePlanBlocksForHours = (hour: number): PlanBlock[] => {
    const dayBlocks = getBlocksForCurrentDate()
    return dayBlocks.filter(block => {
      const blockStart = parseInt(block.startTime.split(':')[0])
      const blockEnd = parseInt(block.endTime.split(':')[0])
      return hour >= blockStart && hour < blockEnd
    })
  }

  // 블록의 위치와 크기 계산
  const calculateBlockPositionAndSize = (block: PlanBlock): React.CSSProperties => {
    const blockStartHours = parseInt(block.startTime.split(':')[0])
    const blockStartMinutes = parseInt(block.startTime.split(':')[1])
    const blockEndHours = parseInt(block.endTime.split(':')[0])
    const blockEndMinutes = parseInt(block.endTime.split(':')[1])
    
    const totalStartMinutes = blockStartHours * 60 + blockStartMinutes
    const totalEndMinutes = blockEndHours * 60 + blockEndMinutes
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
