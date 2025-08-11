/**
 * 일정 추가 모달 관리 훅
 * 모달 상태 및 핸들러 관리
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useState } from 'react'

interface UsePlanModalReturn {
  isModalOpen: boolean
  handleAddPlan: () => void
  handleCloseModal: () => void
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

  return {
    isModalOpen,
    handleAddPlan,
    handleCloseModal
  }
}
