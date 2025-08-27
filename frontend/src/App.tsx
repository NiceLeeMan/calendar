import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import MainPage from './pages/MainPage'
import CalendarPage from './pages/CalendarPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import { getMyInfo } from './api'

// 인증 상태를 확인하는 컴포넌트
function AuthWrapper({ children, requireAuth = true }: { children: React.ReactNode, requireAuth?: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getMyInfo()
        
        // 이미 로그인된 상태
        if (!requireAuth && (location.pathname === '/signIn' || location.pathname === '/signup')) {
          // 로그인/회원가입 페이지에 있는데 이미 로그인됨 → 메인으로 이동
          console.log('이미 로그인됨 - 메인 페이지로 이동')
          navigate('/', { replace: true })
        }
        
      } catch (error) {
        // 로그인 안된 상태
        if (requireAuth) {
          // 인증이 필요한 페이지인데 로그인 안됨 → 로그인으로 이동
          console.log('인증이 필요함 - 로그인 페이지로 이동')
          navigate('/signIn', { replace: true })
        }
      }
    }

    if (requireAuth) {
      checkAuth()
    }
  }, [navigate, location, requireAuth])

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route 
        path="/signIn" 
        element={
          <AuthWrapper requireAuth={false}>
            <LoginPage />
          </AuthWrapper>
        } 
      />
      
      {/* 회원가입 페이지 */}
      <Route 
        path="/signup" 
        element={
          <AuthWrapper requireAuth={false}>
            <SignUpPage />
          </AuthWrapper>
        } 
      />
      
      {/* 메인 페이지 (보호된 라우트) */}
      <Route 
        path="/" 
        element={
          <AuthWrapper requireAuth={true}>
            <MainPage />
          </AuthWrapper>
        } 
      />
      
      {/* 캘린더 페이지 (보호된 라우트) */}
      <Route 
        path="/calendar" 
        element={
          <AuthWrapper requireAuth={true}>
            <CalendarPage />
          </AuthWrapper>
        } 
      />
      
      {/* 약관 페이지 (인증 불필요) */}
      <Route path="/terms" element={<TermsPage />} />
      
      {/* 개인정보 처리방침 페이지 (인증 불필요) */}
      <Route path="/privacy" element={<PrivacyPage />} />
      
      {/* 잘못된 경로는 메인 페이지로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App