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
    } catch (error) {
      console.error('월별 일정 로드 실패:', error)
      setError('일정을 불러오는데 실패했습니다.')
      
      // 에러 시 더미 데이터 사용 (8월 데이터)
      if (year === 2025 && month === 8) {
        const dummyPlans: PlanResponse[] = [
          { id: 1, planName: "All-hands meeting", planContent: "", startDate: "2025-08-01", endDate: "2025-08-01", startTime: "09:00", endTime: "10:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 2, planName: "Dinner with Candice", planContent: "", startDate: "2025-08-01", endDate: "2025-08-01", startTime: "19:00", endTime: "21:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 3, planName: "Coffee with Ali", planContent: "", startDate: "2025-08-04", endDate: "2025-08-04", startTime: "10:00", endTime: "11:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 4, planName: "Marketing site kickoff", planContent: "", startDate: "2025-08-04", endDate: "2025-08-04", startTime: "14:00", endTime: "15:30", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 5, planName: "Deep work", planContent: "", startDate: "2025-08-06", endDate: "2025-08-06", startTime: "09:00", endTime: "11:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 6, planName: "One-on-one w/ Eva", planContent: "", startDate: "2025-08-06", endDate: "2025-08-06", startTime: "14:00", endTime: "15:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 7, planName: "Design sync", planContent: "", startDate: "2025-08-06", endDate: "2025-08-06", startTime: "16:00", endTime: "17:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 8, planName: "2 more...", planContent: "", startDate: "2025-08-06", endDate: "2025-08-06", startTime: "", endTime: "", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 9, planName: "Lunch with Olivia", planContent: "", startDate: "2025-08-07", endDate: "2025-08-07", startTime: "12:00", endTime: "13:30", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 10, planName: "Friday standup", planContent: "", startDate: "2025-08-08", endDate: "2025-08-08", startTime: "09:00", endTime: "09:30", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 11, planName: "Olivia x Riley", planContent: "", startDate: "2025-08-08", endDate: "2025-08-08", startTime: "11:00", endTime: "12:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 12, planName: "Product demo", planContent: "", startDate: "2025-08-08", endDate: "2025-08-08", startTime: "15:00", endTime: "16:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 13, planName: "House inspection", planContent: "", startDate: "2025-08-09", endDate: "2025-08-09", startTime: "10:00", endTime: "11:30", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 14, planName: "Ava's engagement party", planContent: "", startDate: "2025-08-10", endDate: "2025-08-10", startTime: "18:00", endTime: "22:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 15, planName: "Monday standup", planContent: "", startDate: "2025-08-11", endDate: "2025-08-11", startTime: "09:00", endTime: "09:30", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 16, planName: "Content planning", planContent: "", startDate: "2025-08-11", endDate: "2025-08-11", startTime: "14:00", endTime: "15:30", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 17, planName: "Product demo", planContent: "", startDate: "2025-08-12", endDate: "2025-08-12", startTime: "10:00", endTime: "11:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 18, planName: "Catch up w/ Alex", planContent: "", startDate: "2025-08-12", endDate: "2025-08-12", startTime: "16:00", endTime: "17:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          // 다중 날짜 계획 테스트용 추가
          { id: 19, planName: "Summer Vacation 🏖️", planContent: "Family trip to Jeju Island", startDate: "2025-08-13", endDate: "2025-08-15", startTime: "00:00", endTime: "23:59", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" },
          { id: 20, planName: "Conference Week", planContent: "Tech conference attendance", startDate: "2025-08-20", endDate: "2025-08-22", startTime: "09:00", endTime: "18:00", isRecurring: false, createdAt: "", updatedAt: "", userId: 1, userName: "User" }
        ]
        setPlans(dummyPlans)
      } else {
        setPlans([]) // 다른 월은 빈 배열
      }
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
        
        if (planDate.getFullYear() === currentYear && planDate.getMonth() === currentMonth) {
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
  }

  return {
    plans,
    isLoading,
    error,
    getPlansForDate,
    getColorForPlan
  }
}
