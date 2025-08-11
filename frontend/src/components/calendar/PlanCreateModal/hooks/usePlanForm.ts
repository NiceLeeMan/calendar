import { useState } from 'react'

interface AlarmInfo {
  alarmDate: string
  alarmTime: string
}

export const usePlanForm = (selectedDate?: Date) => {
  const [formData, setFormData] = useState({
    planName: '',
    planContent: '',
    startDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    endDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    startTime: '09:00',
    endTime: '10:00',
    isRecurring: false,
    recurringPlan: {
      repeatUnit: 'WEEKLY',
      repeatInterval: 1,
      repeatWeekdays: [] as string[],
      repeatDayOfMonth: null as number | null,
      repeatWeeksOfMonth: [] as number[],
      repeatMonth: null as number | null,
      repeatDayOfYear: null as number | null
    },
    alarms: [] as AlarmInfo[]
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRecurringChange = (field: string, value: any) => {
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

  const updateAlarm = (index: number, field: keyof AlarmInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      alarms: prev.alarms.map((alarm, i) => 
        i === index ? { ...alarm, [field]: value } : alarm
      )
    }))
  }

  const resetForm = () => {
    setFormData({
      planName: '',
      planContent: '',
      startDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      endDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
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
