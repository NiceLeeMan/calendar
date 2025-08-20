/**
 * 일정 추가 모달 관리 훅
 * 모달 상태 및 핸들러 관리, 실시간 UI 업데이트 지원
 * 
 * @author Calendar Team
 * @since 2025-08-11
 * @updated 2025-08-12 - 실시간 계획 업데이트 기능 추가
 * @updated 2025-08-20 - 외부 콜백 연결로 실시간 UI 업데이트 개선
 */

import { useState } from 'react'
import { PlanResponse } from '../../../../types'

interface UsePlanModalProps {
  onPlanCreated?: (plan: PlanResponse) => void
  onPlanUpdated?: (plan: PlanResponse) => void
  onRefreshMonth?: () => Promise<void>
}

interface UsePlanModalReturn {
  isModalOpen: boolean
  editingPlan: PlanResponse | null
  handleAddPlan: () => void
  handleEditPlan: (plan: PlanResponse) => void
  handleCloseModal: () => void
  handlePlanCreated: (plan: PlanResponse) => void
  handlePlanUpdated: (plan: PlanResponse) => void
}

export const usePlanModal = ({ 
  onPlanCreated, 
  onPlanUpdated, 
  onRefreshMonth 
}: UsePlanModalProps = {}): UsePlanModalReturn => {
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

  // 계획 생성 성공 핸들러 - 외부 콜백과 연결
  const handlePlanCreated = (plan: PlanResponse) => {
    console.log('DayView에서 새 계획 생성됨:', plan)
    
    // 외부 콜백이 있으면 호출 (CalendarPage의 실시간 업데이트)
    if (onPlanCreated) {
      onPlanCreated(plan)
    } else if (onRefreshMonth) {
      // fallback: 월별 데이터 새로고침
      onRefreshMonth()
    }
  }

  // 계획 수정 성공 핸들러 - 외부 콜백과 연결
  const handlePlanUpdated = (plan: PlanResponse) => {
    console.log('DayView에서 계획 수정됨:', plan)
    
    // 외부 콜백이 있으면 호출 (CalendarPage의 실시간 업데이트)
    if (onPlanUpdated) {
      onPlanUpdated(plan)
    } else if (onRefreshMonth) {
      // fallback: 월별 데이터 새로고침
      onRefreshMonth()
    }
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
