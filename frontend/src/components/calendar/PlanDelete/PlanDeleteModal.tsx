/**
 * PlanDeleteModal - 계획 삭제 확인 모달
 * 
 * @features
 * - 단일 계획 삭제 확인
 * - 반복 계획 삭제 옵션 선택
 * - 안전한 삭제 처리 (실수 방지)
 * - 로딩 상태 표시
 */

import React, { useState } from 'react'
import { PlanResponse } from '../../../types/plan'

interface PlanDeleteModalProps {
  plan: PlanResponse
  isOpen: boolean
  onConfirm: () => Promise<void>
  onCancel: () => void
}

const PlanDeleteModal = ({ plan, isOpen, onConfirm, onCancel }: PlanDeleteModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                일정 삭제
              </h3>
              {plan.isRecurring && (
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  반복 일정
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="p-6">
          {/* 일정 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="font-medium text-gray-900">{plan.planName}</div>
            {plan.planContent && (
              <div className="text-sm text-gray-600 mt-1">{plan.planContent}</div>
            )}
            <div className="text-sm text-gray-500 mt-2">
              {plan.startDate === plan.endDate ? (
                <>
                  {formatDate(plan.startDate)}
                  {plan.startTime && (
                    <span className="ml-2">
                      {plan.startTime} - {plan.endTime}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                </>
              )}
            </div>
          </div>

          {/* 삭제 확인 메시지 */}
          <p className="text-sm text-gray-700">
            <span className="font-medium">'{plan.planName}'</span> 일정을 삭제하시겠습니까?
            <br />
            <span className="text-gray-500">이 작업은 되돌릴 수 없습니다.</span>
            {plan.isRecurring && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <strong>반복 일정:</strong> 전체 반복 일정이 삭제됩니다.
              </div>
            )}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                삭제 중...
              </>
            ) : (
              '삭제'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlanDeleteModal
