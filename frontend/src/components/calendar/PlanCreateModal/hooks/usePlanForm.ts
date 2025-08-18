import { useState, useEffect } from 'react'
import { PlanResponse } from '../../../../types/plan'

export const usePlanForm = (selectedDate?: Date, editPlan?: PlanResponse | null) => {
  // 초기 날짜 설정 함수
  const getInitialDate = () => {
    if (editPlan) {
      return editPlan.startDate
    }
    if (selectedDate) {
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    return ''
  }

  const defaultDate = getInitialDate()

  const [formData, setFormData] = useState({
    planName: editPlan?.planName || '',
    planContent: editPlan?.planContent || '',
    startDate: editPlan?.startDate || defaultDate,
    endDate: editPlan?.endDate || defaultDate,
    startTime: editPlan?.startTime || '09:00',
    endTime: editPlan?.endTime || '10:00',
    isRecurring: editPlan?.isRecurring || false,
    recurringPlan: {
      repeatUnit: editPlan?.recurringResInfo?.repeatUnit || 'WEEKLY',
      repeatInterval: editPlan?.recurringResInfo?.repeatInterval || 1,
      repeatWeekdays: editPlan?.recurringResInfo?.repeatWeekdays || [],
      repeatDayOfMonth: editPlan?.recurringResInfo?.repeatDayOfMonth || null,
      repeatWeeksOfMonth: editPlan?.recurringResInfo?.repeatWeeksOfMonth || [],
      repeatMonth: editPlan?.recurringResInfo?.repeatMonth || null,
      repeatDayOfYear: editPlan?.recurringResInfo?.repeatDayOfYear || null
    },
    alarms: editPlan?.alarms?.map(alarm => ({
      alarmDate: alarm.alarmDate,
      alarmTime: alarm.alarmTime
    })) || []
  })

  // editPlan이 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (editPlan) {
      setFormData({
        planName: editPlan.planName,
        planContent: editPlan.planContent || '',
        startDate: editPlan.startDate,
        endDate: editPlan.endDate,
        startTime: editPlan.startTime,
        endTime: editPlan.endTime,
        isRecurring: editPlan.isRecurring,
        recurringPlan: {
          repeatUnit: editPlan.recurringResInfo?.repeatUnit || 'WEEKLY',
          repeatInterval: editPlan.recurringResInfo?.repeatInterval || 1,
          repeatWeekdays: editPlan.recurringResInfo?.repeatWeekdays || [],
          repeatDayOfMonth: editPlan.recurringResInfo?.repeatDayOfMonth || null,
          repeatWeeksOfMonth: editPlan.recurringResInfo?.repeatWeeksOfMonth || [],
          repeatMonth: editPlan.recurringResInfo?.repeatMonth || null,
          repeatDayOfYear: editPlan.recurringResInfo?.repeatDayOfYear || null
        },
        alarms: editPlan.alarms?.map(alarm => ({
          alarmDate: alarm.alarmDate,
          alarmTime: alarm.alarmTime
        })) || []
      })
    }
  }, [editPlan])

  // selectedDate가 변경될 때마다 startDate와 endDate 업데이트 (편집 모드가 아닐 때만)
  useEffect(() => {
    if (selectedDate && !editPlan) {
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const newDate = `${year}-${month}-${day}`
      setFormData(prev => ({
        ...prev,
        startDate: newDate,
        endDate: newDate
      }))
    }
  }, [selectedDate, editPlan])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRecurringChange = (field: string, value: any) => {
    console.log('handleRecurringChange:', { field, value })
    setFormData(prev => ({
      ...prev,
      recurringPlan: { ...prev.recurringPlan, [field]: value }
    }))
  }

  const addAlarm = () => {
    setFormData(prev => ({
      ...prev,
      alarms: [...prev.alarms, { alarmDate: '', alarmTime: '09:00' }]
    }))
  }

  const removeAlarm = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alarms: prev.alarms.filter((_, i) => i !== index)
    }))
  }

  const updateAlarm = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      alarms: prev.alarms.map((alarm, i) => 
        i === index ? { ...alarm, [field]: value } : alarm
      )
    }))
  }

  const resetForm = () => {
    if (editPlan) {
      // 편집 모드에서는 원래 데이터로 리셋
      setFormData({
        planName: editPlan.planName,
        planContent: editPlan.planContent || '',
        startDate: editPlan.startDate,
        endDate: editPlan.endDate,
        startTime: editPlan.startTime,
        endTime: editPlan.endTime,
        isRecurring: editPlan.isRecurring,
        recurringPlan: {
          repeatUnit: editPlan.recurringResInfo?.repeatUnit || 'WEEKLY',
          repeatInterval: editPlan.recurringResInfo?.repeatInterval || 1,
          repeatWeekdays: editPlan.recurringResInfo?.repeatWeekdays || [],
          repeatDayOfMonth: editPlan.recurringResInfo?.repeatDayOfMonth || null,
          repeatWeeksOfMonth: editPlan.recurringResInfo?.repeatWeeksOfMonth || [],
          repeatMonth: editPlan.recurringResInfo?.repeatMonth || null,
          repeatDayOfYear: editPlan.recurringResInfo?.repeatDayOfYear || null
        },
        alarms: editPlan.alarms?.map(alarm => ({
          alarmDate: alarm.alarmDate,
          alarmTime: alarm.alarmTime
        })) || []
      })
    } else {
      // 생성 모드에서는 기본값으로 리셋
      const defaultDate = selectedDate ? (() => {
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      })() : ''

      setFormData({
        planName: '',
        planContent: '',
        startDate: defaultDate,
        endDate: defaultDate,
        startTime: '09:00',
        endTime: '10:00',
        isRecurring: false,
        recurringPlan: {
          repeatUnit: 'WEEKLY',
          repeatInterval: 1,
          repeatWeekdays: [],
          repeatDayOfMonth: null,
          repeatWeeksOfMonth: [],
          repeatMonth: null,
          repeatDayOfYear: null
        },
        alarms: []
      })
    }
  }

  return {
    formData,
    handleInputChange,
    handleRecurringChange,
    addAlarm,
    removeAlarm,
    updateAlarm,
    resetForm
  }
}
