/**
 * 월별 일정 관리 훅
 * API 호출, 상태 관리, 캐싱 로직
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useState, useEffect } from 'react'
import { getMonthlyPlans } from '../../../../api'
import { PlanResponse } from '../../../../types'
import { planEventManager } from '../../../../utils/planEventManager'

interface UseMonthlyPlansProps {
  currentDate: Date
  newPlan?: PlanResponse | null
}

interface UseMonthlyPlansReturn {
  plans: PlanResponse[]
  isLoading: boolean
  error: string | null
  getPlansForDate: (date: Date) => PlanResponse[]
  getColorForPlan: (planId: number) => string
  refreshCurrentMonth: () => Promise<void> // 새로고침 함수 추가
}

export const useMonthlyPlans = ({ 
  currentDate, 
  newPlan 
}: UseMonthlyPlansProps): UseMonthlyPlansReturn => {
  const [plans, setPlans] = useState<PlanResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 컬러 팔레트 (알록달록한 색상들)
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
    'bg-blue-600', 'bg-indigo-500', 'bg-pink-500', 'bg-yellow-500',
    'bg-red-500', 'bg-teal-500', 'bg-rose-500', 'bg-cyan-500',
    'bg-lime-500', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500'
  ]
  // 계획 삭제 이벤트 감지
  useEffect(() => {
    const handlePlanDeleted = (planId: number) => {
      setPlans(prevPlans => {
        const updatedPlans = prevPlans.filter(plan => {
          // 반복 계획인 경우 originalPlanId로 비교, 일반 계획은 id로 비교
          const planIdToCompare = plan.id
          return planIdToCompare !== planId
        })
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

  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    loadMonthlyPlans(year, month)
    console.log("현재 월이 변경될때 일정 로드")
  }, [currentDate])

  // 새로운 일정이 추가되거나 수정되었을 때 UI갱신
  useEffect(() => {
    if (newPlan) {
      setPlans(prevPlans => {
        // 기존 계획이 수정된 경우인지 확인
        const existingPlanIndex = prevPlans.findIndex(plan => plan.id === newPlan.id)
        
        // 현재 월 정보
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()

        // 현재 월의 첫날과 마지막날
        const monthStart = new Date(currentYear, currentMonth, 1)
        const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

        // 일정의 시작일과 종료일
        const planStartDate = new Date(newPlan.startDate + 'T00:00:00')
        const planEndDate = new Date(newPlan.endDate + 'T23:59:59')

        // 일정이 현재 월과 겹치는지 확인 (시작일 <= 월말 AND 종료일 >= 월초)
        const isInCurrentMonth = planStartDate <= monthEnd && planEndDate >= monthStart

        if (existingPlanIndex !== -1) {
          // 기존 계획 수정의 경우
          if (isInCurrentMonth) {
            // 현재 월에 속하면 기존 계획을 새 계획으로 교체
            const updatedPlans = [...prevPlans]
            updatedPlans[existingPlanIndex] = newPlan
            return updatedPlans
          } else {
            // 현재 월에 속하지 않으면 기존 계획 제거
            return prevPlans.filter(plan => plan.id !== newPlan.id)
          }
        } else {
          // 새로운 계획 생성의 경우
          if (isInCurrentMonth) {
            return [...prevPlans, newPlan]
          }
        }

        return prevPlans
      })
    }
  }, [newPlan, currentDate])
  // 일정에 색상 할당하는 함수
  const assignColorToPlan = (planId: number): string => {
    return colors[planId % colors.length]
  }

  // 월별 일정 데이터 로드
  const loadMonthlyPlans = async (year: number, month: number) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const monthlyPlans = await getMonthlyPlans({ year, month })
      
      // 서버에서 받은 원본 데이터 로그 (디버깅용)
      console.log('🔍 서버에서 받은 원본 데이터:', monthlyPlans)

      // 기존 plans를 완전히 대체 (반복 계획 수정 시 이전 요일 인스턴스 제거를 위해)
      setPlans(() => {
        return [...monthlyPlans] // 새로운 배열로 완전히 대체
      })
    } catch (error) {
      console.error('월별 일정 로드 실패:', error)
      setError('일정을 불러오는데 실패했습니다.')
      setPlans([]) // 에러 시 빈 배열
    } finally {
      setIsLoading(false)
    }
  }

  // 현재 월이 변경될 때 일정 로드

  // 일반 일정이 특정 날짜에 표시되는지 확인
  const isRegularPlanOnDate = (plan: PlanResponse, dateString: string): boolean => {
    const planStartDate = plan.startDate
    const planEndDate = plan.endDate
    
    // endDate > startDate인 경우 (정상적인 날짜 범위)와 단일 날짜 계획 모두 처리
    const minDate = planStartDate <= planEndDate ? planStartDate : planEndDate
    const maxDate = planStartDate <= planEndDate ? planEndDate : planStartDate
    
    // dateString이 날짜 범위 사이에 있는지 확인
    return dateString >= minDate && dateString <= maxDate
  }

  // 반복 일정이 특정 날짜에 표시되는지 확인
  const isRecurringPlanOnDate = (plan: PlanResponse, dateString: string): boolean => {
    // 반복 일정의 경우: 서버에서 이미 올바른 날짜에만 인스턴스가 생성되어 있음
    // 따라서 startDate가 해당 날짜와 일치하는지만 확인
    return plan.startDate === dateString
  }

  // 특정 날짜의 계획들을 가져오는 함수
  const getPlansForDate = (date: Date): PlanResponse[] => {
    // 로컬 시간대 유지하여 날짜 문자열 생성
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`

    return plans.filter(plan => {
      if (plan.isRecurring) {
        return isRecurringPlanOnDate(plan, dateString)
      } else {
        return isRegularPlanOnDate(plan, dateString)
      }
    })
  }

  // 현재 월 새로고침 함수
  const refreshCurrentMonth = async () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    console.log('월별 데이터 새로고침:', year, month)
    
    // 새로고침 시 기존 plans 초기화 (이전 요일 인스턴스 제거를 위해)
    setPlans([])

    await loadMonthlyPlans(year, month)
  }

  return {
    plans,
    isLoading,
    error,
    getPlansForDate,
    getColorForPlan: assignColorToPlan,
    refreshCurrentMonth
  }
}
