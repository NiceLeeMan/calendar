import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import MainPage from './pages/MainPage'
import CalendarPage from './pages/CalendarPage'
import { getMyInfo } from './api'

type Page = 'login' | 'signup' | 'main' | 'calendar'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login')
  const [isInitializing, setIsInitializing] = useState(true)

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // JWT 쿠키가 있고 유효하면 사용자 정보를 가져올 수 있음
        await getMyInfo()
        
        // 성공하면 이미 로그인된 상태
        console.log('기존 로그인 상태 확인됨 - 메인 페이지로 이동')
        setCurrentPage('main')
        
      } catch (error) {
        // 실패하면 로그인이 필요한 상태 (쿠키 없음 또는 만료)
        console.log('로그인이 필요함 - 로그인 페이지 유지')
        setCurrentPage('login')
        
      } finally {
        setIsInitializing(false)
      }
    }

    checkAuthStatus()
  }, [])

  // 초기화 중일 때는 로딩 화면 표시
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage 
          onNavigateToSignUp={() => setCurrentPage('signup')}
          onNavigateToMain={() => setCurrentPage('main')}
        />
      )}
      {currentPage === 'signup' && (
        <SignUpPage onNavigateToLogin={() => setCurrentPage('login')} />
      )}
      {currentPage === 'main' && (
        <MainPage 
          onNavigateToLogin={() => setCurrentPage('login')}
          onNavigateToCalendar={() => setCurrentPage('calendar')}
        />
      )}
      {currentPage === 'calendar' && (
        <CalendarPage onNavigateToMain={() => setCurrentPage('main')} />
      )}
    </>
  )
}

export default App