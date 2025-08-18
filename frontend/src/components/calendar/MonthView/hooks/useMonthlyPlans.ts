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
      console.log(`MonthView에서 계획 삭제 감지: planId=${planId}`)
      setPlans(prevPlans => {
        const updatedPlans = prevPlans.filter(plan => {
          // 반복 계획인 경우 originalPlanId로 비교, 일반 계획은 id로 비교
          const planIdToCompare = plan.id
          return planIdToCompare !== planId
        })
        console.log(`삭제 후 계획 수: ${prevPlans.length} → ${updatedPlans.length}`)
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
    // console.log("현재 월이 변경될때 일정 로드")
  }, [currentDate])

  // 새로운 일정이 추가되었을 때 UI갱신, 반복계획의 UI 갱신문제는 이쪽이 아닐까?
  // 계획 삭제 이벤트 감지
  useEffect(() => {
    const handlePlanDeleted = (planId: number) => {
      console.log(`MonthView에서 계획 삭제 감지: planId=${planId}`)
      setPlans(prevPlans => {
        const updatedPlans = prevPlans.filter(plan => {
          // 반복 계획인 경우 originalPlanId로 비교, 일반 계획은 id로 비교
          const planIdToCompare = plan.id
          return planIdToCompare !== planId
        })
        console.log(`삭제 후 계획 수: ${prevPlans.length} → ${updatedPlans.length}`)
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
    if (newPlan) {
      setPlans(prevPlans => {
        // 중복 방지: 이미 존재하는 일정인지 확인
        const exists = prevPlans.some(plan => plan.id === newPlan.id)
        if (exists) {
          return prevPlans
        }

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

        if (isInCurrentMonth) {
          console.log(`✅ 새 일정이 ${currentYear}년 ${currentMonth + 1}월에 표시됨:`, newPlan.planName)
          console.log(`   일정 기간: ${newPlan.startDate} ~ ${newPlan.endDate}`)
          return [...prevPlans, newPlan]
        }

        console.log(`❌ 새 일정이 ${currentYear}년 ${currentMonth + 1}월에 해당하지 않음`)
        return prevPlans
      })
    }
  }, [newPlan, currentDate])
  // 일정에 색상 할당하는 함수
  const getColorForPlan = (planId: number): string => {
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
      monthlyPlans.forEach((plan, idx) => {
        if (plan.isRecurring) {
          console.log(`  반복계획 ${idx}: ${plan.planName} | 기간: ${plan.startDate} ~ ${plan.endDate}`)
        }
      })
      
      setPlans(monthlyPlans)
      console.log(`월별 일정 로드 성공: ${year}년 ${month}월, ${monthlyPlans.length}개`)
    } catch (error) {
      console.error('월별 일정 로드 실패:', error)
      setError('일정을 불러오는데 실패했습니다.')
      setPlans([]) // 에러 시 빈 배열
    } finally {
      setIsLoading(false)
    }
  }

  // 현재 월이 변경될 때 일정 로드

  // 특정 날짜의 클릭했을때
  const getPlansForDate = (date: Date): PlanResponse[] => {
    // 로컬 시간대 유지하여 날짜 문자열 생성
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    
    // 서버에서 받은 모든 계획에서 해당 날짜에 시작하는 계획만 필터링
    return plans.filter(plan => plan.startDate === dateString)
  }

  // 현재 월 새로고침 함수
  const refreshCurrentMonth = async () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    console.log('월별 데이터 새로고침:', year, month)
    await loadMonthlyPlans(year, month)
  }

  return {
    plans,
    isLoading,
    error,
    getPlansForDate,
    getColorForPlan,
    refreshCurrentMonth
  }
}
