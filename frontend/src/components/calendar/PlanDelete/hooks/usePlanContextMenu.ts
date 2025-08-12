/**
 * usePlanContextMenu - 계획 컨텍스트 메뉴 상태 관리 훅
 * 
 * @features
 * - 컨텍스트 메뉴 표시/숨김 상태 관리
 * - 마우스 위치 추적
 * - 메뉴 대상 계획 관리
 */

import { useState, useCallback } from 'react'
import { PlanResponse } from '../../../../types/plan'

interface ContextMenuState {
  isOpen: boolean
  plan: PlanResponse | null
  position: { x: number; y: number }
  targetDate?: string
}

export const usePlanContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    plan: null,
    position: { x: 0, y: 0 }
  })

  const openContextMenu = useCallback((
    plan: PlanResponse, 
    position: { x: number; y: number },
    targetDate?: string
  ) => {
    setContextMenu({
      isOpen: true,
      plan,
      position,
      targetDate
    })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu({
      isOpen: false,
      plan: null,
      position: { x: 0, y: 0 }
    })
  }, [])

  const handleContextMenu = useCallback((
    event: React.MouseEvent,
    plan: PlanResponse,
    targetDate?: string
  ) => {
    event.preventDefault()
    event.stopPropagation()
    
    openContextMenu(
      plan,
      { x: event.clientX, y: event.clientY },
      targetDate
    )
  }, [openContextMenu])

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
    handleContextMenu
  }
}

export default usePlanContextMenu
