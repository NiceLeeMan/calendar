import { useState, useEffect } from 'react'

interface AlarmInfo {
  alarmDate: string
  alarmTime: string
}

export const usePlanForm = (selectedDate?: Date) => {
  const defaultDate = selectedDate ? (() => {
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })() : ''
  
  // 디버깅용 로그
  console.log('usePlanForm - selectedDate:', selectedDate)
  console.log('usePlanForm - defaultDate:', defaultDate)
  
  const [formData, setFormData] = useState({
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
      repeatWeekdays: [] as string[],
      repeatDayOfMonth: null as number | null,
      repeatWeeksOfMonth: [] as number[],
      repeatMonth: null as number | null,
      repeatDayOfYear: null as number | null
    },
    alarms: [] as AlarmInfo[]
  })

  // selectedDate가 변경될 때마다 startDate와 endDate 업데이트
  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const newDate = `${year}-${month}-${day}`
      
      console.log('useEffect - selectedDate changed:', selectedDate)
      console.log('useEffect - updating dates to:', newDate)
      
      setFormData(prev => ({
        ...prev,
        startDate: newDate,
        endDate: newDate
      }))
    }
  }, [selectedDate])

  const handleInputChange = (field: string, value: any) => {
    console.log('handleInputChange:', { field, value })
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

  const updateAlarm = (index: number, field: keyof AlarmInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      alarms: prev.alarms.map((alarm, i) => 
        i === index ? { ...alarm, [field]: value } : alarm
      )
    }))
  }

  const resetForm = () => {
    const defaultDate = selectedDate ? (() => {
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    })() : ''
    
    // 디버깅용 로그
    console.log('resetForm - selectedDate:', selectedDate)
    console.log('resetForm - defaultDate:', defaultDate)
    
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
