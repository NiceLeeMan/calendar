/**
 * 달력 애니메이션 훅
 * 월 변경 시 슬라이드 애니메이션 처리
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useState, useEffect } from 'react'

interface UseCalendarAnimationProps {
  currentDate: Date
}

interface UseCalendarAnimationReturn {
  isAnimating: boolean
  animationDirection: 'left' | 'right'
  previousDate: Date
  generateCalendarDays: (date: Date) => Date[]
}

export const useCalendarAnimation = ({ 
  currentDate 
}: UseCalendarAnimationProps): UseCalendarAnimationReturn => {
  
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right')
  const [previousDate, setPreviousDate] = useState(currentDate)

  useEffect(() => {
    if (currentDate.getTime() !== previousDate.getTime()) {
      // 월이 변경되었는지 확인
      const currentMonth = currentDate.getMonth()
      const previousMonth = previousDate.getMonth()
      const currentYear = currentDate.getFullYear()
      const previousYear = previousDate.getFullYear()
      
      // 년도나 월이 변경된 경우에만 애니메이션
      if (currentMonth !== previousMonth || currentYear !== previousYear) {
        // 애니메이션 방향 결정
        const isNext = currentYear > previousYear || 
                      (currentYear === previousYear && currentMonth > previousMonth)
        
        setAnimationDirection(isNext ? 'left' : 'right')
        setIsAnimating(true)
        
        // 애니메이션 완료 후 상태 리셋
        setTimeout(() => {
          setIsAnimating(false)
          setPreviousDate(currentDate)
        }, 0)
      } else {
        setPreviousDate(currentDate)
      }
    }
  }, [currentDate, previousDate])

  // 달력 그리드 생성 함수
  const generateCalendarDays = (date: Date): Date[] => {
    const year = date.getFullYear()
    const month = date.getMonth()

    // 이번 달 첫째 날
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    // 첫째 주 시작일 (일요일부터)
    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
    
    // 마지막 주 종료일
    const endDate = new Date(lastDayOfMonth)
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()))
    
    const days = []
    const currentDay = new Date(startDate)
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }
    
    return days
  }

  // 날짜 변경 감지 및 애니메이션 처리


  return {
    isAnimating,
    animationDirection,
    previousDate,
    generateCalendarDays
  }
}
