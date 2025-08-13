/**
 * 월별 일정 관리 훅
 * API 호출, 상태 관리, 캐싱 로직
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useState, useEffect } from 'react'
import { getMonthlyPlans } from '../../../../api/planApi'
import { PlanResponse } from '../../../../types/plan'

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
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    loadMonthlyPlans(year, month)
  }, [currentDate])

  // 새로운 일정이 추가되었을 때 목록에 추가
  useEffect(() => {
    if (newPlan) {
      setPlans(prevPlans => {
        // 중복 방지: 이미 존재하는 일정인지 확인
        const exists = prevPlans.some(plan => plan.id === newPlan.id)
        if (exists) {
          return prevPlans
        }
        
        // 새 일정이 현재 월에 속하는지 확인
        const planDate = new Date(newPlan.startDate)
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        
        console.log('새 일정 월 체크:', {
          planYear: planStartDate.getFullYear(),
          planMonth: planStartDate.getMonth(),
          currentYear,
          currentMonth,
          planName: newPlan.planName
        })
        
        if (planStartDate.getFullYear() === currentYear && planStartDate.getMonth() === currentMonth) {
          console.log('새 일정 실시간 추가:', newPlan)
          return [...prevPlans, newPlan]
        }
        
        return prevPlans
      })
    }
  }, [newPlan, currentDate])

  // 특정 날짜의 일정 가져오기
  const getPlansForDate = (date: Date): PlanResponse[] => {
    const dateString = date.toISOString().split('T')[0]
    return plans.filter(plan => {
      // 일정 기간 내에 해당 날짜가 포함되는지 확인
      return dateString >= plan.startDate && dateString <= plan.endDate
    })
    
    console.log(`${dateString}의 계획 ${filteredPlans.length}개:`, filteredPlans.map(p => p.planName))
    return filteredPlans
  }

  }

  return {
    plans,
    isLoading,
    error,
    getPlansForDate,
    getColorForPlan
  }
}
