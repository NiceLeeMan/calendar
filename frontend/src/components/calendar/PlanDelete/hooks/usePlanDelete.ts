/**
 * usePlanDelete - 계획 삭제 로직 관리 훅
 * 
 * @features
 * - 단일 계획 삭제 처리
 * - 즉시 UI 반영 (낙관적 업데이트)
 * - 에러 발생 시 사용자 알림
 */

import { useState, useCallback } from 'react'
import { deletePlan } from '../../../../api/planApi'
import { PlanResponse } from '../../../../types/plan'
import { planEventManager } from '../../../../utils/planEventManager'

export const usePlanDelete = () => {
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    plan: PlanResponse | null
  }>({
    isOpen: false,
    plan: null
  })

  const [isDeleting, setIsDeleting] = useState(false)

  const openDeleteModal = useCallback((plan: PlanResponse) => {
    setDeleteModal({
      isOpen: true,
      plan
    })
  }, [])

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      plan: null
    })
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteModal.plan) return

    setIsDeleting(true)
    try {
      // 반복계획의 경우 원본 Plan ID 사용 (인스턴스 ID가 아닌)
      const planIdToDelete = deleteModal.plan.isRecurring 
        ? deleteModal.plan.id  // 반복계획은 모든 인스턴스가 같은 원본 ID를 가짐
        : deleteModal.plan.id

      console.log(`계획 삭제 시도: planId=${planIdToDelete}, isRecurring=${deleteModal.plan.isRecurring}`)
      
      await deletePlan(planIdToDelete)
      
      console.log(`계획 ${planIdToDelete} 삭제 완료`)
      
      // 삭제 이벤트 발생 - 즉시 UI 업데이트용
      planEventManager.emitPlanDeleted(planIdToDelete)
      
      // 삭제 성공 시 모달 닫기
      closeDeleteModal()
      
      // 반복계획 삭제 시 성공 메시지 표시
      if (deleteModal.plan.isRecurring) {
        alert('반복 일정이 전체 삭제되었습니다.')
      }
      
      // 페이지 새로고침 대신 React Query 캐시 무효화로 데이터 갱신
      // (React Query를 사용하는 경우 queryClient.invalidateQueries 사용 권장)
      // window.location.reload() - 제거: 현재 뷰 유지를 위해
      
    } catch (error) {
      console.error(`계획 ${deleteModal.plan.id} 삭제 실패:`, error)
      
      // 에러 메시지 개선
      if (deleteModal.plan.isRecurring) {
        alert('반복 일정 삭제에 실패했습니다. 다시 시도해주세요.')
      } else {
        alert('일정 삭제에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsDeleting(false)
    }
  }, [deleteModal.plan, closeDeleteModal])

  return {
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteConfirm,
    isDeleting
  }
}

export default usePlanDelete
