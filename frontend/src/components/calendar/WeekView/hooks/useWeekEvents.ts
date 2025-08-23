/**
 * 주별 일정 관리 메인 훅
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-23 - 파일 분할 및 구조 개선
 */

import { PlanResponse } from '../../../../types/plan'
import { planEventManager } from '../../../../utils/planEventManager'
import { useState, useEffect } from 'react'
import { formatDateToString } from './weekEventUtils'
import { createWeekPlanBlocks, PlanBlock } from './weekPlanBlockGenerators'
import { calculateOverlappingEventsLayout } from './weekEventLayout'

interface UseWeekEventsProps {
  plans?: PlanResponse[]
  getColorForPlan?: (planId: number) => string
}

interface UseWeekEventsReturn {
  getEventsForDateTime: (date: Date, hour: number) => PlanBlock[]
  getOverlappingEventsForDateTime: (date: Date, hour: number) => Array<PlanBlock & { style: React.CSSProperties }>
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

  // 실제 계획만 사용 (상태로 관리되는 plans 사용)
  const allEvents = createWeekPlanBlocks(currentPlans, getColorForPlan)

  // 특정 날짜와 시간의 이벤트 가져오기
  const getEventsForDateTime = (date: Date, hour: number): PlanBlock[] => {
    const dateString = formatDateToString(date)

    return allEvents.filter(event => {
      if (event.date !== dateString) return false

      const eventStart = parseInt(event.startTime.split(':')[0])
      const eventEnd = parseInt(event.endTime.split(':')[0])

      // 이벤트가 이 시간대에 걸쳐있는지 확인 (시작시간 = 종료시간인 경우도 포함)
      return hour >= eventStart && (hour < eventEnd || eventStart === eventEnd)
    })
  }

  // 겹치는 이벤트들의 위치 계산
  const getOverlappingEventsForDateTime = (date: Date, hour: number): Array<PlanBlock & { style: React.CSSProperties }> => {
    const events = getEventsForDateTime(date, hour)
    return calculateOverlappingEventsLayout(events, hour)
  }

  return {
    getEventsForDateTime,
    getOverlappingEventsForDateTime
  }
}
