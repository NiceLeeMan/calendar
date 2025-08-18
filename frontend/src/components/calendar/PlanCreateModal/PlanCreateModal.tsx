
import { PlanResponse } from '../../../types/plan'
import { usePlanForm, usePlanSubmit } from './hooks'
import { BasicInfoSection, DateTimeSection, RecurringSection, AlarmSection, ErrorMessage } from './components'

interface PlanCreateModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
  editPlan?: PlanResponse | null // 수정할 계획 (null이면 생성 모드)
  onPlanCreated?: (plan: PlanResponse) => void
  onPlanUpdated?: (plan: PlanResponse) => void // 수정 완료 콜백
  onRefreshMonth?: () => Promise<void> // 월별 새로고침 콜백 (fallback용)
  currentDate?: Date // 현재 달력 날짜 추가
}

const PlanCreateModal = ({ isOpen, onClose, selectedDate, editPlan, onPlanCreated, onPlanUpdated, onRefreshMonth, currentDate }: PlanCreateModalProps) => {
  // 편집 모드 여부 확인
  const isEditMode = !!editPlan
  
  const {
    formData,
    handleInputChange,
    handleRecurringChange,
    addAlarm,
    removeAlarm,
    updateAlarm,
    resetForm
  } = usePlanForm(selectedDate, editPlan) // editPlan 전달

  const { isSubmitting, error, handleSubmit } = usePlanSubmit()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isEditMode && editPlan) {
      // 수정 모드
      await handleSubmit(formData, onPlanUpdated, onClose, resetForm, onRefreshMonth, currentDate, editPlan.id)
    } else {
      // 생성 모드
      await handleSubmit(formData, onPlanCreated, onClose, resetForm, onRefreshMonth, currentDate)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? '일정 수정' : '일정 추가'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 폼 내용 */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <ErrorMessage error={error} />
          
          <BasicInfoSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
          
          <DateTimeSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
          
          <RecurringSection 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleRecurringChange={handleRecurringChange} 
          />
          
          <AlarmSection 
            formData={formData}
            addAlarm={addAlarm}
            removeAlarm={removeAlarm}
            updateAlarm={updateAlarm}
          />

          {/* 버튼 영역 */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSubmitting ? (isEditMode ? '수정 중...' : '저장 중...') : (isEditMode ? '수정' : '저장')}
                </>
              ) : (
                isEditMode ? '수정' : '저장'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlanCreateModal
