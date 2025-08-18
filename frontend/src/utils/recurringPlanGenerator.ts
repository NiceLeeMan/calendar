/**
 * 프론트엔드 반복 계획 인스턴스 생성기
 * 백엔드 로직과 동일한 방식으로 반복 인스턴스 생성
 */

import { PlanResponse } from '../types/plan'

/**
 * 반복 계획의 현재 월 인스턴스들을 생성
 * @param masterPlan 백엔드에서 받은 마스터 계획
 * @param currentDate 현재 달력에서 보고 있는 날짜
 * @returns 현재 월에 해당하는 반복 인스턴스들
 */
export const generateRecurringInstances = (masterPlan: PlanResponse, currentDate: Date): PlanResponse[] => {
  if (!masterPlan.isRecurring) {
    return [masterPlan]
  }

  const instances: PlanResponse[] = []
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  // 현재 월의 첫날과 마지막날
  const monthStart = new Date(currentYear, currentMonth - 1, 1)
  const monthEnd = new Date(currentYear, currentMonth, 0)
  
  console.log('=====================================')
  console.log('📅 generateRecurringInstances 시작')
  console.log('계획명:', masterPlan.planName)
  console.log('현재 월:', `${currentYear}년 ${currentMonth}월`)
  console.log('월 범위:', {
    시작: formatLocalDate(monthStart),
    종료: formatLocalDate(monthEnd)
  })
  console.log('원본 계획 기간:', {
    시작: masterPlan.startDate,
    종료: masterPlan.endDate
  })
  console.log('반복 정보:', masterPlan.recurringResInfo)
  console.log('=====================================')

  // 계획 시작일과 종료일
  const [startYear, startMonth, startDay] = masterPlan.startDate.split('-').map(Number)
  const [endYear, endMonth, endDay] = masterPlan.endDate.split('-').map(Number)
  const planStartDate = new Date(startYear, startMonth - 1, startDay)
  const planEndDate = new Date(endYear, endMonth - 1, endDay)
  
  // 반복 정보 가져오기
  const recurringInfo = masterPlan.recurringResInfo

  
  if (recurringInfo?.repeatUnit === 'WEEKLY') {
    generateWeeklyInstances(masterPlan, monthStart, monthEnd, planStartDate, planEndDate, instances)
  }
  
  console.log(`🏁 최종 생성된 인스턴스: ${instances.length}개`)
  instances.forEach((inst, idx) => {
    console.log(`  ${idx + 1}. ${inst.startDate} ~ ${inst.endDate}`)
  })
  console.log('=====================================\n')

  return instances
}
// 1️⃣ 반복 요일 파싱
function getRepeatWeekdays(recurringInfo: any, planStartDate: Date): string[] {
  const repeatWeekdays = recurringInfo?.repeatWeekdays || []
  console.log('📋 getRepeatWeekdays:', {
    입력요일: repeatWeekdays,
    시작일요일: getDayOfWeekString(planStartDate.getDay())
  })
  
  if (repeatWeekdays.length === 0) {
    const defaultWeekday = getDayOfWeekString(planStartDate.getDay())
    console.log('  → 요일 없음, 시작일 요일 사용:', defaultWeekday)
    return [defaultWeekday]
  }
  return repeatWeekdays
}

// 2️⃣ 특정 요일의 첫 번째 날짜 찾기
function findFirstOccurrence(startDate: Date, endDate: Date, targetDayOfWeek: string): Date | null {
  const targetDayNumber = getDayOfWeekNumber(targetDayOfWeek)
  const currentDate = new Date(startDate)
  
  console.log(`🔍 findFirstOccurrence (${targetDayOfWeek}):`, {
    시작일: formatLocalDate(startDate),
    종료일: formatLocalDate(endDate),
    목표요일: `${targetDayOfWeek} (${targetDayNumber})`
  })
  
  let moveCount = 0
  while (currentDate <= endDate) {
    if (currentDate.getDay() === targetDayNumber) {
      console.log(`  ✅ ${moveCount}일 이동 후 찾음: ${formatLocalDate(currentDate)}`)
      return new Date(currentDate)
    }
    currentDate.setDate(currentDate.getDate() + 1)
    moveCount++
  }
  
  console.log(`  ❌ 기간 내 ${targetDayOfWeek} 없음`)
  return null
}

// 3️⃣ 반복 날짜 목록 생성
function generateRecurringDates(
    firstOccurrence: Date,
    endDate: Date,
    repeatInterval: number
): Date[] {
  const dates: Date[] = []
  const currentDate = new Date(firstOccurrence)

  console.log('📆 generateRecurringDates:', {
    첫발생일: formatLocalDate(firstOccurrence),
    종료일: formatLocalDate(endDate),
    반복간격: `${repeatInterval}주`
  })


  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    console.log(`  추가: ${formatLocalDate(currentDate)}`)
    currentDate.setDate(currentDate.getDate() + (7 * repeatInterval))
  }
  
  console.log(`  → 총 ${dates.length}개 날짜 생성`)
  return dates
}

// 4️⃣ 날짜를 인스턴스로 변환
function createInstance(
    masterPlan: PlanResponse,
    instanceDate: Date
): PlanResponse {
  return {
    ...masterPlan,
    id: masterPlan.id + parseInt(instanceDate.getTime().toString().slice(-6)),
    startDate: formatLocalDate(instanceDate),
    endDate: formatLocalDate(instanceDate) // 단일 날짜로 수정
  }
}

// 5️⃣ 월 범위 필터링
function filterByMonth(dates: Date[], monthStart: Date, monthEnd: Date): Date[] {
  console.log('🗓️ filterByMonth:', {
    전체날짜수: dates.length,
    월범위: `${formatLocalDate(monthStart)} ~ ${formatLocalDate(monthEnd)}`
  })
  const filtered = dates.filter(date => date >= monthStart && date <= monthEnd)
  
  console.log(`  → ${filtered.length}개가 월 범위에 포함`)
  filtered.forEach(d => console.log(`    - ${formatLocalDate(d)}`))
  
  return filtered
}

// 6️⃣ 메인 함수 (조합만)
function generateWeeklyInstances(
    masterPlan: PlanResponse,
    monthStart: Date,
    monthEnd: Date,
    planStartDate: Date,
    planEndDate: Date,
    instances: PlanResponse[]
) {
  console.log('\n🔄 generateWeeklyInstances 시작')
  
  const recurringInfo = masterPlan.recurringResInfo
  const repeatInterval = recurringInfo?.repeatInterval || 1

  // 1. 반복 요일 가져오기
  const repeatWeekdays = getRepeatWeekdays(recurringInfo, planStartDate)
  console.log('처리할 요일들:', repeatWeekdays)

  // 2. 각 요일별로 처리
  for (const targetDayOfWeek of repeatWeekdays) {
    console.log(`\n--- ${targetDayOfWeek} 요일 처리 ---`)
    
    // 3. 첫 번째 발생일 찾기
    const firstOccurrence = findFirstOccurrence(planStartDate, planEndDate, targetDayOfWeek)
    if (!firstOccurrence) {
      console.log(`⚠️ ${targetDayOfWeek}: 첫 발생일 없음, 건너뜀`)
      continue
    }

    // 4. 반복 날짜 생성
    const recurringDates = generateRecurringDates(firstOccurrence, planEndDate, repeatInterval)

    // 5. 월 범위 필터링
    const datesInMonth = filterByMonth(recurringDates, monthStart, monthEnd)

    // 6. 인스턴스 생성
    console.log(`📦 ${datesInMonth.length}개 인스턴스 생성 중...`)
    for (const date of datesInMonth) {
      const instance = createInstance(masterPlan, date)
      instances.push(instance)
      console.log(`  ✅ 인스턴스 추가: ${instance.startDate} ~ ${instance.endDate}`)
    }
  }
  
  console.log(`\n🔄 generateWeeklyInstances 완료 (총 ${instances.length}개)`)
}

/**
 * 요일 문자열을 숫자로 변환 (백엔드 DayOfWeek와 매칭)
 */
function getDayOfWeekNumber(dayOfWeek: string): number {
  const dayMap: { [key: string]: number } = {
    'MONDAY': 1,
    'TUESDAY': 2, 
    'WEDNESDAY': 3,
    'THURSDAY': 4,
    'FRIDAY': 5,
    'SATURDAY': 6,
    'SUNDAY': 0
  }
  return dayMap[dayOfWeek] || 0
}

/**
 * 숫자를 요일 문자열로 변환
 */
function getDayOfWeekString(dayNumber: number): string {
  const dayMap: { [key: number]: string } = {
    0: 'SUNDAY',
    1: 'MONDAY', 
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY'
  }
  return dayMap[dayNumber] || 'SUNDAY'
}

/**
 * Date 객체를 로컬 시간대 기준 YYYY-MM-DD 문자열로 변환
 */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
