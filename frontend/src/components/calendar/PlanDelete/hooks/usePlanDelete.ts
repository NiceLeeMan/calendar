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
      await deletePlan(deleteModal.plan.id)
      
      console.log(`계획 ${deleteModal.plan.id} 삭제 완료`)
      
      // 삭제 성공 시 모달 닫기
      closeDeleteModal()
      
      // 페이지 새로고침으로 데이터 갱신 (간단한 방법)
      window.location.reload()
      
    } catch (error) {
      console.error(`계획 ${deleteModal.plan.id} 삭제 실패:`, error)
      alert('일정 삭제에 실패했습니다. 다시 시도해주세요.')
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
