/**
 * Plan 유틸리티 함수들
 * 폼 데이터 변환, 날짜 계산 등 헬퍼 함수들
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */

import {
  PlanCreateRequest,
  PlanResponse
} from '../../types/plan'

/**
 * 일정 폼 데이터를 API 요청 형식으로 변환
 * PlanCreateModal에서 사용할 변환 함수
 * 
 * @param formData 폼에서 입력된 데이터
 * @returns API 요청용 데이터
 */
export const convertFormDataToCreateRequest = (formData: any): PlanCreateRequest => {
  const request: PlanCreateRequest = {
    planName: formData.planName.trim(),
    planContent: formData.planContent?.trim() || undefined,
    startDate: formData.startDate,
    endDate: formData.endDate,
    startTime: formData.startTime,
    endTime: formData.endTime,
    isRecurring: formData.isRecurring
  }

  // 반복 설정 변환
  if (formData.isRecurring && formData.recurringPlan) {
    console.log('반복 계획 변환 시작:', formData.recurringPlan)

    const recurring = formData.recurringPlan
    
    // 백엔드 RecurringReqInfo 형식에 완전히 맞춤
    request.recurringPlan = {
      type: recurring.repeatUnit || recurring.type, // 백엔드: @JsonProperty("type") → repeatUnit
      repeatInterval: recurring.repeatInterval || 1
    }

    // 반복 유형별 설정 추가
    switch (request.recurringPlan.type) {
      case 'WEEKLY':
        if (recurring.repeatWeekdays?.length > 0) {
          request.recurringPlan.daysOfWeek = recurring.repeatWeekdays
          console.log('주간 반복 - 선택된 요일:', recurring.repeatWeekdays)
        }
        break
      case 'MONTHLY':
        if (recurring.repeatDayOfMonth) {
          request.recurringPlan!.dayOfMonth = recurring.repeatDayOfMonth
        } else if (recurring.repeatWeeksOfMonth?.length > 0) {
          request.recurringPlan!.weeksOfMonth = recurring.repeatWeeksOfMonth
          request.recurringPlan!.daysOfWeek = recurring.repeatWeekdays
        }
        break
      case 'YEARLY':
        if (recurring.repeatMonth && recurring.repeatDayOfYear) {
          request.recurringPlan!.month = recurring.repeatMonth
          request.recurringPlan!.dayOfYear = recurring.repeatDayOfYear
        }
        break
    }
  }

  // 알람 설정 변환
  if (formData.alarms?.length > 0) {
    request.alarms = formData.alarms
      .filter((alarm: any) => alarm.alarmTime) // 시간이 설정된 알람만
      .map((alarm: any) => ({
        alarmDate: alarm.alarmDate || null,
        alarmTime: alarm.alarmTime
      }))
  }

  console.log('convertFormDataToCreateRequest - 최종 request:', request)
  return request
}

/**
 * 일정이 특정 날짜에 해당하는지 확인
 * 캘린더에서 일정을 특정 날짜에 표시할지 판단할 때 사용
 * 
 * @param plan 확인할 일정
 * @param targetDate 확인할 날짜 (YYYY-MM-DD)
 * @returns 해당 날짜에 일정이 있으면 true
 */
export const isPlanOnDate = (plan: PlanResponse, targetDate: string): boolean => {
  return targetDate >= plan.startDate && targetDate <= plan.endDate
}
