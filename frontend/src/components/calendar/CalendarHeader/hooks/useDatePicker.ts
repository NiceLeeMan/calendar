/**
 * 날짜 선택기 훅
 * DatePicker 모달 상태 관리
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import { useState } from 'react'

interface UseDatePickerProps {
  onDateChange: (date: Date) => void
}

interface UseDatePickerReturn {
  isDatePickerOpen: boolean
  toggleDatePicker: () => void
  handleDatePickerChange: (date: Date) => void
  setIsDatePickerOpen: (open: boolean) => void
}

export const useDatePicker = ({
  onDateChange
}: UseDatePickerProps): UseDatePickerReturn => {

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  
  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen)
  }

  const handleDatePickerChange = (date: Date) => {
    onDateChange(date)
    setIsDatePickerOpen(false)
  }

  return {
    isDatePickerOpen,
    toggleDatePicker,
    handleDatePickerChange,
    setIsDatePickerOpen
  }
}
