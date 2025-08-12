/**
 * WeekView 현재 시간 라인 컴포넌트
 * 현재 시간을 표시하는 빨간 선
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */


interface CurrentTimeLineProps {
  timeLine: { topPosition: number; leftPosition: string; width: string } | null
}

const CurrentTimeLine = ({ timeLine }: CurrentTimeLineProps) => {
  if (!timeLine) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="bg-red-500 h-0.5 opacity-75 z-20"
        style={{
          position: 'absolute',
          top: `${timeLine.topPosition}px`,
          left: timeLine.leftPosition,
          width: timeLine.width
        }}
      />
    </div>
  )
}

export default CurrentTimeLine
