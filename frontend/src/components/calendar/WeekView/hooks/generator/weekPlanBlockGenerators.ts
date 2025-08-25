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
  assignColorToPlanBlock,
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
 * 반복 계획 블록 생성 메인 함수
 */
export const createRecurringPlanBlocks = (
  plans: PlanResponse[], 
  getColorForPlan?: (planId: number) => string
): PlanBlock[] => {
  const allBlocks: PlanBlock[] = []
  
  console.log('🔍 전체 plans 데이터 검사:')
  console.log('총 plans 개수:', plans.length)
  
  // ⚠️ 중요: 각 plan은 이미 백엔드에서 생성된 개별 인스턴스입니다
  // 반복 계획의 각 인스턴스를 별도의 일반 계획처럼 처리해야 합니다
  plans.filter(plan => plan.isRecurring).forEach(plan => {
    console.log('🔄 반복 계획 인스턴스 처리:', {
      id: plan.id,
      title: plan.planName,
      startDate: plan.startDate,
      endDate: plan.endDate,
      recurringInfo: plan.recurringResInfo
    })
    
    // 각 인스턴스를 개별 블록으로 변환 (추가 반복 생성 없이)
    const instanceBlock: PlanBlock = {
      id: generateUniqueId(plan.id, new Date(plan.startDate + 'T00:00:00')),
      title: plan.planName,
      date: plan.startDate, // 인스턴스의 시작 날짜 사용
      startTime: plan.startTime || '00:00',
      endTime: plan.endTime || '23:59',
      color: assignColorToPlanBlock(plan.id, getColorForPlan),
      originalPlanId: plan.id,
      originalPlan: plan
    }
    
    allBlocks.push(instanceBlock)
    console.log(`  → 인스턴스 블록 1개 생성: ${instanceBlock.date}`)
  })
  
  console.log('🏁 반복 계획 인스턴스 처리 완료 - 총 블록 수:', allBlocks.length)
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
  
  // 상세 디버깅: 각 반복 블록의 정보 출력
  recurringBlocks.forEach((block, index) => {
    console.log(`  반복 블록 ${index + 1}: ID=${block.id}, 날짜=${block.date}, 제목=${block.title}`)
  })
  
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
