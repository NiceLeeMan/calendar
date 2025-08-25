/**
 * 일별 일정 관리 메인 훅
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-23 - 파일 분할 및 구조 개선
 */

import { useMemo, useState, useEffect } from 'react'
import { PlanResponse } from '../../../../../types/plan'
import { planEventManager } from '../../../../../utils/planEventManager.ts'
import { formatDateToString } from '../utils/dayEventUtils.ts'
import { createDayPlanBlocks, PlanBlock } from '../generator/dayPlanBlockGenerators.ts'
import { calculateBlockPositionAndSize, arrangeOverlappingBlocks } from '../layout/dayEventLayout.ts'

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

  // 모든 블록 결합 (실제 계획 + 전달받은 블록)
  const allBlocks = useMemo(() => {
    return [...createDayPlanBlocks(currentPlans, getColorForPlan), ...events]
  }, [currentPlans, events, getColorForPlan])

  // 현재 날짜의 블록들 가져오기
  const getBlocksForCurrentDate = (): PlanBlock[] => {
    const dateString = formatDateToString(currentDate)
    
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

  // 겹치는 블록들을 배치 처리
  const arrangeOverlappingBlocksForDay = () => {
    const dayBlocks = getBlocksForCurrentDate()
    return arrangeOverlappingBlocks(dayBlocks)
  }

  return {
    getDayPlanBlocks: getBlocksForCurrentDate,
    getActivePlanBlocksForHour: getActivePlanBlocksForHours,
    calculatePlanBlockPosition: calculateBlockPositionAndSize,
    arrangeOverlappingBlocks: arrangeOverlappingBlocksForDay
  }
}
