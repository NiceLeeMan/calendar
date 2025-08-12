/**
 * 일정 추가 모달 관리 훅
 * 모달 상태 및 핸들러 관리, 실시간 UI 업데이트 지원
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-12 - 실시간 계획 업데이트 기능 추가
 */

import { useState } from 'react'
import { PlanResponse } from '../../../../types/plan'

interface UsePlanModalReturn {
  isModalOpen: boolean
  handleAddPlan: () => void
  handleCloseModal: () => void
  handlePlanCreated: (plan: PlanResponse) => void
}

export const usePlanModal = (): UsePlanModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 일정 추가 버튼 클릭 핸들러
  const handleAddPlan = () => {
    console.log('일정 추가 버튼 클릭!')
    setIsModalOpen(true)
    console.log('모달 상태:', true)
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // 계획 생성 성공 핸들러 (DayView에서는 자체적으로 실시간 업데이트)
  const handlePlanCreated = (plan: PlanResponse) => {
    console.log('DayView에서 새 계획 생성됨:', plan)
    // DayView는 useMonthlyPlans를 통해 자동으로 업데이트되므로 
    // 별도 처리 불필요하지만 확장성을 위해 콜백 유지
  }

  return {
    isModalOpen,
    handleAddPlan,
    handleCloseModal,
    handlePlanCreated
  }
}
