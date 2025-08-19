/**
 * PlanContextMenu - 계획 우클릭 시 나타나는 컨텍스트 메뉴
 * 
 * @features
 * - 수정/삭제 옵션 제공
 * - 마우스 위치 기반 포지셔닝
 * - 반복 계획 여부에 따른 메뉴 변화
 * - 클릭 외부 영역 시 자동 닫힘
 */

import  { useEffect, useRef } from 'react'
import { PlanResponse } from '../../../types/plan'

interface PlanContextMenuProps {
  plan: PlanResponse
  position: { x: number; y: number }
  onEdit: (plan: PlanResponse) => void
  onDelete: (plan: PlanResponse) => void
  onClose: () => void
}

const PlanContextMenu = ({ plan, position, onEdit, onDelete, onClose }: PlanContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)

  // 클릭 외부 영역 감지하여 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    // 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  // 메뉴가 화면 밖으로 나가지 않도록 위치 조정
  const getMenuStyle = () => {
    const menuWidth = 160
    const menuHeight = plan.isRecurring ? 120 : 80
    
    let x = position.x
    let y = position.y

    // 화면 우측 경계 체크
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10
    }

    // 화면 하단 경계 체크
    if (y + menuHeight > window.innerHeight) {
      y = position.y - menuHeight
    }

    return {
      left: x,
      top: y,
      position: 'fixed' as const,
      zIndex: 1000
    }
  }

  const handleEdit = () => {
    onEdit(plan)
    onClose()
  }

  const handleDelete = () => {
    onDelete(plan)
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px]"
      style={getMenuStyle()}
    >
      {/* 메뉴 헤더 */}
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="text-sm font-medium text-gray-800 truncate">
          {plan.planName}
        </div>
        {plan.isRecurring && (
          <div className="text-xs text-blue-600 flex items-center mt-1">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            반복 일정
          </div>
        )}
      </div>

      {/* 메뉴 옵션들 */}
      <div className="py-1">
        {/* 수정 버튼 */}
        <button
          onClick={handleEdit}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
        >
          <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          수정
        </button>

        {/* 삭제 버튼 */}
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
        >
          <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          삭제
        </button>
      </div>
    </div>
  )
}

export default PlanContextMenu
