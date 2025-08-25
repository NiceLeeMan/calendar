/**
 * 주별 계획 블록 생성기들
 * 반복 타입별 블록 생성 함수들
 * 
 * @author Calendar Team
 * @since 2025-08-23
 */

import { PlanResponse } from '../../../../../types/plan'
import { 
  formatDateToString, 
  generateUniqueId, 
  getDayOfWeekString, 
  assignColorToPlanBlock,
  findDateByWeekAndDay 
} from '../utils/weekEventUtils.ts'

export interface PlanBlock {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
  originalPlanId?: number  // 원본 계획 ID (다중 날짜 이벤트 추적용)
  originalPlan?: PlanResponse  // 원본 계획 데이터
}

// =============================================================================
// 📋 일반 계획 블록 생성
// =============================================================================

/**
 * 일반 계획을 planBlock으로 변환
 */
export const createRegularPlanBlocks = (
  plans: PlanResponse[], 
  getColorForPlan?: (planId: number) => string
): PlanBlock[] => {
  const planBlocks: PlanBlock[] = []
  const blockMap = new Map<string, boolean>()
  
  plans.filter(plan => !plan.isRecurring).forEach(plan => {
    const startDate = new Date(plan.startDate + 'T00:00:00')
    const endDate = new Date(plan.endDate + 'T00:00:00')
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dateString = formatDateToString(currentDate)
      const blockId = `${plan.id}-${dateString}`
      
      if (!blockMap.has(blockId)) {
        blockMap.set(blockId, true)
        
        planBlocks.push({
          id: generateUniqueId(plan.id, currentDate),
          title: plan.planName,
          date: dateString,
          startTime: plan.startTime || '00:00',
          endTime: plan.endTime || '23:59',
          color: assignColorToPlanBlock(plan.id, getColorForPlan),
          originalPlanId: plan.id,
          originalPlan: plan
        })
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })
  
  return planBlocks
}

// =============================================================================
// 🔄 반복 계획 블록 생성 (타입별)
// =============================================================================

/**
 * 주간 반복 계획 블록 생성
 */
export const createWeeklyRecurringBlocks = (
  plan: PlanResponse, 
  getColorForPlan?: (planId: number) => string
): PlanBlock[] => {
  const planBlocks: PlanBlock[] = []
  const blockMap = new Map<string, boolean>()
  
  const startDate = new Date(plan.startDate + 'T00:00:00')
  const endDate = new Date(plan.endDate + 'T00:00:00')
  
  // 반복 종료일 확인
  let actualEndDate = endDate
  if (plan.recurringResInfo?.endDate) {
    const repeatEndDate = new Date(plan.recurringResInfo.endDate + 'T00:00:00')
    actualEndDate = repeatEndDate < endDate ? repeatEndDate : endDate
  }
  
  const currentDate = new Date(startDate)
  
  while (currentDate <= actualEndDate) {
    // 반복 요일 확인
    if (plan.recurringResInfo?.repeatWeekdays) {
      const dayOfWeek = currentDate.getDay()
      const currentDayName = getDayOfWeekString(dayOfWeek)
      
      if (!plan.recurringResInfo.repeatWeekdays.includes(currentDayName)) {
        currentDate.setDate(currentDate.getDate() + 1)
        continue
      }
    }
    
    const dateString = formatDateToString(currentDate)
    const blockId = `${plan.id}-${dateString}`
    
    if (!blockMap.has(blockId)) {
      blockMap.set(blockId, true)
      
      planBlocks.push({
        id: generateUniqueId(plan.id, currentDate),
        title: plan.planName,
        date: dateString,
        startTime: plan.startTime || '00:00',
        endTime: plan.endTime || '23:59',
        color: assignColorToPlanBlock(plan.id, getColorForPlan),
        originalPlanId: plan.id,
        originalPlan: plan
      })
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return planBlocks
}

/**
 * 월간 반복 계획 블록 생성
 */
export const createMonthlyRecurringBlocks = (
  plan: PlanResponse, 
  getColorForPlan?: (planId: number) => string
): PlanBlock[] => {
  const planBlocks: PlanBlock[] = []
  const blockMap = new Map<string, boolean>()
  
  const startDate = new Date(plan.startDate + 'T00:00:00')
  const endDate = new Date(plan.endDate + 'T00:00:00')
  const recurringInfo = plan.recurringResInfo
  
  if (!recurringInfo) return planBlocks
  
  // 반복 종료일 확인
  let actualEndDate = endDate
  if (recurringInfo.endDate) {
    const repeatEndDate = new Date(recurringInfo.endDate + 'T00:00:00')
    actualEndDate = repeatEndDate < endDate ? repeatEndDate : endDate
  }
  
  const repeatInterval = recurringInfo.repeatInterval || 1
  
  // 방식 1: 매월 특정 날짜 (예: 매월 15일)
  if (recurringInfo.repeatDayOfMonth) {
    const targetDay = recurringInfo.repeatDayOfMonth
    let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    let monthCount = 0 // 반복 간격 계산용
    
    while (currentMonth <= actualEndDate) {
      // 반복 간격에 맞는지 확인 (첫 월은 항상 포함)
      if (monthCount % repeatInterval === 0) {
        // 해당 월의 실제 일수에 맞춰 날짜 조정
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
        const actualDay = Math.min(targetDay, daysInMonth)
        const instanceDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), actualDay)
        
        // 계획 기간 내에 있는지 확인
        if (instanceDate >= startDate && instanceDate <= actualEndDate) {
          const dateString = formatDateToString(instanceDate)
          const blockId = `${plan.id}-${dateString}`
          
          if (!blockMap.has(blockId)) {
            blockMap.set(blockId, true)
            
            planBlocks.push({
              id: generateUniqueId(plan.id, instanceDate),
              title: plan.planName,
              date: dateString,
              startTime: plan.startTime || '00:00',
              endTime: plan.endTime || '23:59',
              color: assignColorToPlanBlock(plan.id, getColorForPlan),
              originalPlanId: plan.id,
              originalPlan: plan
            })
          }
        }
      }
      
      currentMonth.setMonth(currentMonth.getMonth() + 1)
      monthCount++
    }
  }
  // 방식 2: 매월 특정 주차의 특정 요일 (예: 매월 둘째 화요일)
  else if (recurringInfo.repeatWeeksOfMonth && recurringInfo.repeatWeekdays) {
    let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    let monthCount = 0 // 반복 간격 계산용
    
    while (currentMonth <= actualEndDate) {
      // 반복 간격에 맞는지 확인 (첫 월은 항상 포함)
      if (monthCount % repeatInterval === 0) {
        // 각 주차에 대해 처리
        for (const weekOfMonth of recurringInfo.repeatWeeksOfMonth) {
          // 각 요일에 대해 처리
          for (const dayOfWeek of recurringInfo.repeatWeekdays) {
            const instanceDate = findDateByWeekAndDay(currentMonth, weekOfMonth, dayOfWeek)
            
            if (instanceDate && instanceDate >= startDate && instanceDate <= actualEndDate) {
              const dateString = formatDateToString(instanceDate)
              const blockId = `${plan.id}-${dateString}`
              
              if (!blockMap.has(blockId)) {
                blockMap.set(blockId, true)
                
                planBlocks.push({
                  id: generateUniqueId(plan.id, instanceDate),
                  title: plan.planName,
                  date: dateString,
                  startTime: plan.startTime || '00:00',
                  endTime: plan.endTime || '23:59',
                  color: assignColorToPlanBlock(plan.id, getColorForPlan),
                  originalPlanId: plan.id,
                  originalPlan: plan
                })
              }
            }
          }
        }
      }
      
      currentMonth.setMonth(currentMonth.getMonth() + 1)
      monthCount++
    }
  }
  
  return planBlocks
}

/**
 * 연간 반복 계획 블록 생성 (확장성을 위한 준비)
 */
export const createYearlyRecurringBlocks = (
  plan: PlanResponse, 
  getColorForPlan?: (planId: number) => string
): PlanBlock[] => {
  // TODO: 연간 반복 로직 구현 (필요시)
  return []
}

/**
 * 반복 계획 블록 생성 메인 함수
 */
export const createRecurringPlanBlocks = (
  plans: PlanResponse[], 
  getColorForPlan?: (planId: number) => string
): PlanBlock[] => {
  const allBlocks: PlanBlock[] = []
  
  plans.filter(plan => plan.isRecurring).forEach(plan => {
    console.log('🔄 반복 계획 처리:', {
      id: plan.id,
      title: plan.planName,
      startDate: plan.startDate,
      endDate: plan.endDate,
      recurringInfo: plan.recurringResInfo
    })
    
    const recurringInfo = plan.recurringResInfo
    if (!recurringInfo) return
    
    let blocks: PlanBlock[] = []
    
    switch (recurringInfo.repeatUnit) {
      case 'WEEKLY':
        blocks = createWeeklyRecurringBlocks(plan, getColorForPlan)
        console.log(`  → WEEKLY 블록 ${blocks.length}개 생성`)
        break
      case 'MONTHLY':
        blocks = createMonthlyRecurringBlocks(plan, getColorForPlan)
        console.log(`  → MONTHLY 블록 ${blocks.length}개 생성`)
        break
      case 'YEARLY':
        blocks = createYearlyRecurringBlocks(plan, getColorForPlan)
        console.log(`  → YEARLY 블록 ${blocks.length}개 생성`)
        break
      default:
        console.warn(`지원하지 않는 반복 단위: ${recurringInfo.repeatUnit}`)
    }
    
    allBlocks.push(...blocks)
  })
  
  return allBlocks
}

// =============================================================================
// 📋 메인 블록 생성 함수
// =============================================================================

/**
 * 모든 계획을 planBlock으로 변환하는 메인 함수
 */
export const createWeekPlanBlocks = (
  plans: PlanResponse[], 
  getColorForPlan?: (planId: number) => string
): PlanBlock[] => {
  const regularBlocks = createRegularPlanBlocks(plans, getColorForPlan)
  const recurringBlocks = createRecurringPlanBlocks(plans, getColorForPlan)
  
  console.log('🔍 WeekView 블록 생성 디버그:')
  console.log('전체 plans:', plans.length)
  console.log('일반 블록:', regularBlocks.length)
  console.log('반복 블록:', recurringBlocks.length)
  
  const allBlocks = [...regularBlocks, ...recurringBlocks]
  
  // 중복 블록 체크 (같은 날짜, 같은 originalPlanId)
  const duplicateCheck = new Map<string, PlanBlock[]>()
  allBlocks.forEach(block => {
    const key = `${block.originalPlanId}-${block.date}`
    if (!duplicateCheck.has(key)) {
      duplicateCheck.set(key, [])
    }
    duplicateCheck.get(key)!.push(block)
  })
  
  duplicateCheck.forEach((blocks, key) => {
    if (blocks.length > 1) {
      console.log(`⚠️ 중복 블록 발견: ${key}`)
      blocks.forEach((block, index) => {
        console.log(`  ${index + 1}. ID: ${block.id}, 제목: ${block.title}, 날짜: ${block.date}`)
      })
    }
  })
  
  return allBlocks
}
