/**
 * 일별 이벤트 레이아웃 처리
 * 이벤트 겹침 처리 및 위치 계산
 * 
 * @author Calendar Team
 * @since 2025-08-23
 */

import { PlanBlock } from './dayPlanBlockGenerators'

// =============================================================================
// 🔄 이벤트 레이아웃 계산 함수들
// =============================================================================

/**
 * 블록의 위치와 크기 계산
 */
export const calculateBlockPositionAndSize = (block: PlanBlock): React.CSSProperties => {
  const blockStartHours = parseInt(block.startTime.split(':')[0])
  const blockStartMinutes = parseInt(block.startTime.split(':')[1])
  const blockEndHours = parseInt(block.endTime.split(':')[0])
  const blockEndMinutes = parseInt(block.endTime.split(':')[1])
  
  const totalStartMinutes = blockStartHours * 60 + blockStartMinutes
  const totalEndMinutes = blockEndHours * 60 + blockEndMinutes
  const durationMinutes = totalEndMinutes - totalStartMinutes
  
  // 하루를 1440분(24시간 * 60분)으로 계산
  const topPercentage = (totalStartMinutes / 1440) * 100
  const heightPercentage = (durationMinutes / 1440) * 100
  
  return {
    position: 'absolute',
    top: `${topPercentage}%`,
    left: '88px', // 시간 레이블(80px) + 여백(8px) = 88px부터 시작
    right: '8px', // 오른쪽 여백 8px
    height: `${heightPercentage}%`,
    zIndex: 10,
    minHeight: '32px' // 최소 높이 보장
  }
}

/**
 * 1단계: 겹치는 블록들을 그룹으로 묶기
 */
export const groupOverlappingBlocks = (blocksWithStyles: Array<PlanBlock & { style: React.CSSProperties }>) => {
  const overlappingGroups: Array<Array<typeof blocksWithStyles[0]>> = []
  
  blocksWithStyles.forEach(block => {
    const blockStartMinutes = parseInt(block.startTime.split(':')[0]) * 60 + parseInt(block.startTime.split(':')[1])
    const blockEndMinutes = parseInt(block.endTime.split(':')[0]) * 60 + parseInt(block.endTime.split(':')[1])
    
    let addedToGroup = false
    
    for (let group of overlappingGroups) {
      const hasOverlap = group.some(groupBlock => {
        const groupStartMinutes = parseInt(groupBlock.startTime.split(':')[0]) * 60 + parseInt(groupBlock.startTime.split(':')[1])
        const groupEndMinutes = parseInt(groupBlock.endTime.split(':')[0]) * 60 + parseInt(groupBlock.endTime.split(':')[1])
        
        return (blockStartMinutes < groupEndMinutes && blockEndMinutes > groupStartMinutes)
      })
      
      if (hasOverlap) {
        group.push(block)
        addedToGroup = true
        break
      }
    }
    
    if (!addedToGroup) {
      overlappingGroups.push([block])
    }
  })
  
  return overlappingGroups
}

/**
 * 2단계: 각 그룹 내 블록들의 위치 조정
 */
export const adjustBlockPositions = (groups: Array<Array<PlanBlock & { style: React.CSSProperties }>>) => {
  return groups.flatMap(group => 
    group.map((block, index) => {
      const timeAreaWidth = 88 // 시간 레이블 영역 너비 (80px + 8px 여백)
      const rightMargin = 8 // 오른쪽 여백
      
      // 사용 가능한 너비를 픽셀로 계산 (전체에서 시간 영역과 오른쪽 여백 제외)
      // 퍼센티지 대신 픽셀 단위로 정확한 위치 계산
      const blockWidth = `calc((100% - ${timeAreaWidth + rightMargin}px) / ${group.length} - 4px)`
      const leftOffset = `calc(${timeAreaWidth}px + ((100% - ${timeAreaWidth + rightMargin}px) / ${group.length}) * ${index})`
      
      return {
        ...block,
        style: {
          ...block.style,
          left: leftOffset,
          width: blockWidth,
          right: 'auto' // right 속성 제거하여 left + width 방식 사용
        }
      }
    })
  )
}

/**
 * 3단계: 겹치는 블록들을 배치 처리 (메인 함수)
 */
export const arrangeOverlappingBlocks = (dayBlocks: PlanBlock[]): Array<PlanBlock & { style: React.CSSProperties }> => {
  const blocksWithStyles = dayBlocks.map(block => ({
    ...block,
    style: calculateBlockPositionAndSize(block)
  }))

  const groups = groupOverlappingBlocks(blocksWithStyles)
  return adjustBlockPositions(groups)
}
