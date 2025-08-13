/**
 * DayView 사이드바 컴포넌트
 * 미니 캘린더 및 선택된 날짜의 일정 표시
 * 
 * @author Calendar Team
 * @since 2025-08-11
 */


import MiniCalendar from '../../MiniCalendar/MiniCalendar.tsx'

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  color?: string
}

interface DaySidebarProps {
  currentDate: Date
  onDateSelect: (date: Date) => void
  events: Event[]
  onAddPlan: () => void
}

const DaySidebar = ({ currentDate, onDateSelect, events, onAddPlan }: DaySidebarProps) => {
  return (
    <div className="w-72 flex-shrink-0 space-y-4">
      {/* 미니 달력 */}
      <MiniCalendar 
        currentDate={currentDate}
        onDateSelect={onDateSelect}
      />

      {/* 선택된 날짜의 일정 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {currentDate.toLocaleDateString('ko-KR', { 
            month: 'long', 
            day: 'numeric',
            weekday: 'long' 
          })}
          <div className="text-sm font-normal text-gray-500 mt-1">
            {currentDate.toLocaleDateString('ko-KR', { year: 'numeric' })}
          </div>
        </h3>
        
        <div className="space-y-3">
          {/* 현재 날짜의 이벤트를 표시 */}
          {(() => {
            const currentDateString = currentDate.toISOString().split('T')[0]
            const currentDateEvents = events.filter(event => event.date === currentDateString)
            
            return currentDateEvents.length > 0 ? (
              currentDateEvents.map((event) => (
                <div 
                  key={event.id}
                  className="p-4 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-blue-800 group-hover:text-blue-900 truncate">
                        {event.title}
                      </div>
                      {event.startTime && (
                        <div className="text-sm text-blue-600 mt-1">
                          {event.startTime} - {event.endTime}
                        </div>
                      )}
                    </div>
                    
                    {/* 이벤트 지속 시간 표시 */}
                    {event.startTime && event.endTime && (
                      <div className="ml-3 flex-shrink-0">
                        <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full">
                          {(() => {
                            const start = parseInt(event.startTime.split(':')[0]) * 60 + parseInt(event.startTime.split(':')[1])
                            const end = parseInt(event.endTime.split(':')[0]) * 60 + parseInt(event.endTime.split(':')[1])
                            const duration = end - start
                            
                            if (duration >= 60) {
                              const hours = Math.floor(duration / 60)
                              const minutes = duration % 60
                              return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`
                            } else {
                              return `${duration}분`
                            }
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-3">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  이 날에는 일정이 없습니다.
                </p>
                <button 
                  onClick={onAddPlan}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + 일정 추가
                </button>
              </div>
            )
          })()}
          
          {/* 일정 통계 표시 */}
          {(() => {
            const currentDateString = currentDate.toISOString().split('T')[0]
            const currentDateEvents = events.filter(event => event.date === currentDateString)
            
            return currentDateEvents.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{currentDateEvents.length}개의 일정</span>
                  <span>
                    총 {(() => {
                      const totalMinutes = currentDateEvents.reduce((acc, event) => {
                        if (!event.startTime || !event.endTime) return acc
                        const start = parseInt(event.startTime.split(':')[0]) * 60 + parseInt(event.startTime.split(':')[1])
                        const end = parseInt(event.endTime.split(':')[0]) * 60 + parseInt(event.endTime.split(':')[1])
                        return acc + (end - start)
                      }, 0)
                      
                      const hours = Math.floor(totalMinutes / 60)
                      const minutes = totalMinutes % 60
                      
                      if (hours > 0) {
                        return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`
                      } else {
                        return `${minutes}분`
                      }
                    })()}
                  </span>
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

export default DaySidebar
