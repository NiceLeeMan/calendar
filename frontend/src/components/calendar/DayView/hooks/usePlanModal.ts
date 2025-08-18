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
  editingPlan: PlanResponse | null
  handleAddPlan: () => void
  handleEditPlan: (plan: PlanResponse) => void
  handleCloseModal: () => void
  handlePlanCreated: (plan: PlanResponse) => void
  handlePlanUpdated: (plan: PlanResponse) => void
}

export const usePlanModal = (): UsePlanModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PlanResponse | null>(null)

  // 일정 추가 버튼 클릭 핸들러
  const handleAddPlan = () => {
    console.log('일정 추가 버튼 클릭!')
    setEditingPlan(null) // 새 계획이므로 편집 상태 초기화
    setIsModalOpen(true)
    console.log('모달 상태:', true)
  }

  // 일정 수정 핸들러
  const handleEditPlan = (plan: PlanResponse) => {
    console.log('일정 수정 요청:', plan.planName)
    setEditingPlan(plan)
    setIsModalOpen(true)
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPlan(null) // 편집 상태 초기화
  }

  // 계획 생성 성공 핸들러 (DayView에서는 자체적으로 실시간 업데이트)
  const handlePlanCreated = (plan: PlanResponse) => {
    console.log('DayView에서 새 계획 생성됨:', plan)
    // DayView는 useMonthlyPlans를 통해 자동으로 업데이트되므로 
    // 별도 처리 불필요하지만 확장성을 위해 콜백 유지
  }

  // 계획 수정 성공 핸들러
  const handlePlanUpdated = (plan: PlanResponse) => {
    console.log('DayView에서 계획 수정됨:', plan)
    // DayView는 useMonthlyPlans를 통해 자동으로 업데이트되므로 
    // 별도 처리 불필요하지만 확장성을 위해 콜백 유지
  }

  return {
    isModalOpen,
    editingPlan,
    handleAddPlan,
    handleEditPlan,
    handleCloseModal,
    handlePlanCreated,
    handlePlanUpdated
  }
}
