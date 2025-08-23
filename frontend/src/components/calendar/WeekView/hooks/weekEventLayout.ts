/**
 * 주별 이벤트 레이아웃 처리
 * 이벤트 겹침 처리 및 위치 계산
 * 
 * @author Calendar Team
 * @since 2025-08-23
 */

import { PlanBlock } from './weekPlanBlockGenerators'

// =============================================================================
// 🔄 이벤트 레이아웃 계산 함수들
// =============================================================================

/**
 * 1단계: 이벤트들을 시간 정보와 함께 변환
 */
export const convertEventsWithTimeInfo = (events: PlanBlock[]) => {
  return events.map(event => {
    const startParts = event.startTime.split(':')
    const endParts = event.endTime.split(':')
    const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1])
    const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1])

    return {
      ...event,
      startMinutes,
      endMinutes
    }
  })
}

/**
 * 2단계: 겹치는 이벤트들을 그룹으로 묶기
 */
export const groupOverlappingEvents = (eventsWithTime: Array<PlanBlock & { startMinutes: number; endMinutes: number }>) => {
  const groups: Array<Array<typeof eventsWithTime[0]>> = []

  eventsWithTime.forEach(event => {
    let placed = false

    // 기존 그룹들과 겹치는지 확인
    for (const group of groups) {
      const overlapsWithGroup = group.some(groupEvent =>
          !(event.endMinutes <= groupEvent.startMinutes || event.startMinutes >= groupEvent.endMinutes)
      )

      if (overlapsWithGroup) {
        group.push(event)
        placed = true
        break
      }
    }

    // 어떤 그룹과도 겹치지 않으면 새 그룹 생성
    if (!placed) {
      groups.push([event])
    }
  })

  return groups
}

/**
 * 3단계: 각 그룹 내 이벤트들의 레이아웃 계산
 */
export const calculateEventLayout = (
  groups: Array<Array<PlanBlock & { startMinutes: number; endMinutes: number }>>,
  hour: number
) => {
  const result: Array<PlanBlock & { style: React.CSSProperties }> = []

  groups.forEach(group => {
    const groupSize = group.length

    if (groupSize > 1) {
      console.log(`가로 배치 적용 - 그룹 크기: ${groupSize}`)
    }

    group.forEach((event, index) => {
      // 이벤트가 시작하는 시간 슬롯에서만 전체 블록 표시
      const eventStartHour = parseInt(event.startTime.split(':')[0])
      if (hour !== eventStartHour) return // 시작 시간이 아니면 건너뛰기

      // 전체 이벤트의 시간과 높이 계산
      const eventStartMinutes = parseInt(event.startTime.split(':')[1])
      const eventEndHour = parseInt(event.endTime.split(':')[0])
      const eventEndMinutes = parseInt(event.endTime.split(':')[1])

      const totalDurationHours = eventEndHour - eventStartHour + (eventEndMinutes / 60)
      const offsetInSlot = eventStartMinutes / 60 * 100

      // 가로 배치: 너비를 그룹 크기로 나누고 인덱스에 따라 위치 지정
      const widthPercent = 100 / groupSize
      const leftPercent = index * widthPercent

      if (groupSize > 1) {
        console.log(`${event.title} - left: ${leftPercent}%, width: ${widthPercent}%`)
      }

      // 최소 높이 보장: 시작시간 = 종료시간일 때도 표시되도록 함
      const calculatedHeight = totalDurationHours * 100 - 2
      const minHeightPercent = 6 // 최소 6% 높이 보장 (64px 슬롯에서 약 3.84px)
      const finalHeight = Math.max(calculatedHeight, minHeightPercent)

      result.push({
        ...event,
        style: {
          position: 'absolute',
          left: `${leftPercent + 1}%`,
          width: `${widthPercent - 2}%`,
          top: `${offsetInSlot + 1}%`,
          height: `${finalHeight}%`,
          minHeight: '24px', // 더 큰 최소 높이로 확실하게 보이도록
          zIndex: 10 + index
        }
      })
    })
  })

  return result
}

/**
 * 4단계: 겹치는 이벤트들의 위치 계산 (가로 분할 방식)
 */
export const calculateOverlappingEventsLayout = (
  events: PlanBlock[], 
  hour: number
): Array<PlanBlock & { style: React.CSSProperties }> => {
  if (events.length === 0) return []

  // 디버깅용 로그
  if (events.length > 1) {
    console.log(`겹치는 이벤트 발견 - 시간: ${hour}시, 이벤트 수: ${events.length}`)
    console.log('이벤트들:', events.map(e => `${e.title} (${e.startTime}-${e.endTime})`))
  }

  // 단계별 처리
  const eventsWithTime = convertEventsWithTimeInfo(events)
  const groups = groupOverlappingEvents(eventsWithTime)
  return calculateEventLayout(groups, hour)
}
