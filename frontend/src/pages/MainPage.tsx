import { useState } from 'react'
import Button from '../components/ui/Button'
import { logout } from '../api'

interface MainPageProps {
  onNavigateToLogin: () => void
  onNavigateToCalendar: () => void
}

const MainPage = ({ onNavigateToLogin, onNavigateToCalendar }: MainPageProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      await logout()
      console.log('로그아웃 성공')
      
      // 로그인 페이지로 이동
      onNavigateToLogin()
      
    } catch (error) {
      console.error('로그아웃 실패:', error)
      // 실패해도 로그인 페이지로 이동 (쿠키는 서버에서 삭제 시도됨)
      onNavigateToLogin()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 영역 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                캘린더 메인 페이지
              </h1>
              <p className="text-gray-600 mt-2">
                로그인에 성공했습니다! 메인 페이지입니다.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="small"
                onClick={onNavigateToCalendar}
              >
                캘린더
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
              </Button>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            캘린더 기능 (개발 예정)
          </h2>
          <p className="text-gray-600">
            여기에 캘린더 관련 기능들이 추가될 예정입니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MainPage