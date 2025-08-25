import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, getMyInfo } from '../api'
import type { UserResponse } from '../types'

const MainPage = () => {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const info = await getMyInfo()
        setUserInfo(info)
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error)
      } finally {
        setIsLoadingUser(false)
      }
    }
    
    loadUserInfo()
  }, [])

  const handleNavigateToCalendar = () => {
    navigate('/calendar')
    setIsSidebarOpen(false)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      await logout()
      console.log('로그아웃 성공')
      navigate('/signIn')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      navigate('/signIn')
    } finally {
      setIsLoggingOut(false)
      setIsSidebarOpen(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // 키보드 이벤트 처리 (접근성)
  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      callback()
    }
  }

  // ESC 키로 사이드바 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    }
    
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isSidebarOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-purple-200/30 to-pink-200/30 blur-3xl"></div>
      </div>

      {/* 햄버거 메뉴 버튼 - 우측 최상단 */}
      <button
        onClick={toggleSidebar}
        onKeyDown={(e) => handleKeyDown(e, toggleSidebar)}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 group"
        aria-label="메뉴 열기"
        aria-expanded={isSidebarOpen}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* 메인 콘텐츠 - 중앙 배치 */}
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto relative z-10">
          {/* 로딩 상태 */}
          {isLoadingUser ? (
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200/50 rounded-lg mb-4 mx-auto w-3/4"></div>
              <div className="h-6 bg-gray-200/50 rounded-lg mx-auto w-1/2"></div>
            </div>
          ) : (
            <>
              {/* 웰컴 메시지 */}
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4 leading-tight">
                  메인 페이지
                </h1>
                
                {userInfo && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-4 shadow-sm border border-white/20">
                    <p className="text-lg sm:text-xl text-gray-700 mb-2">
                      안녕하세요, <span className="font-semibold text-blue-700">{userInfo.userName}</span>님! 👋
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      캘린더 서비스에 오신 것을 환영합니다.
                    </p>
                  </div>
                )}
                
                {!userInfo && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-4 shadow-sm border border-white/20">
                    <p className="text-lg sm:text-xl text-gray-700">
                      로그인에 성공했습니다! ✨
                    </p>
                  </div>
                )}
              </div>

              {/* 빠른 액션 힌트 */}
              <div className="text-gray-600 text-sm sm:text-base">
                <p className="mb-2">우측 상단의 메뉴 버튼을 클릭하여</p>
                <p className="flex items-center justify-center gap-1">
                  <span>다양한 기능을 이용하실 수 있습니다</span>
                  <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 배경 오버레이 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* 슬라이드 사이드바 */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        {/* 사이드바 헤더 */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200/50">
          <h3 id="sidebar-title" className="text-lg sm:text-xl font-semibold text-gray-800">
            메뉴
          </h3>
          <button
            onClick={closeSidebar}
            onKeyDown={(e) => handleKeyDown(e, closeSidebar)}
            className="p-2 rounded-full hover:bg-gray-100/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="메뉴 닫기"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 사이드바 메뉴 */}
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* 캘린더 페이지 이동 */}
            <button
              onClick={handleNavigateToCalendar}
              onKeyDown={(e) => handleKeyDown(e, handleNavigateToCalendar)}
              className="w-full flex items-center p-3 sm:p-4 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg mr-3 sm:mr-4 group-hover:bg-blue-600 transition-colors duration-200">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-left flex-grow">
                <div className="font-medium text-gray-800 text-sm sm:text-base">캘린더</div>
                <div className="text-xs sm:text-sm text-gray-500">일정 관리 페이지로 이동</div>
              </div>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ml-auto group-hover:text-gray-600 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* 구분선 */}
            <div className="border-t border-gray-200/50 my-4 sm:my-6"></div>

            {/* 정책 및 약관 섹션 */}
            <div className="mb-4 sm:mb-6">
              <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 px-1">
                정책 및 약관
              </h4>
              <div className="space-y-2">
                {/* 이용약관 */}
                <button
                  onClick={() => {
                    navigate('/terms')
                    setIsSidebarOpen(false)
                  }}
                  className="w-full flex items-center p-2 sm:p-3 rounded-lg text-left hover:bg-gray-50/80 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 mr-3">
                    <svg
                      className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                      이용약관
                    </div>
                  </div>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 ml-auto group-hover:text-gray-600 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </button>

                {/* 개인정보 처리방침 */}
                <button
                  onClick={() => {
                    navigate('/privacy')
                    setIsSidebarOpen(false)
                  }}
                  className="w-full flex items-center p-2 sm:p-3 rounded-lg text-left hover:bg-gray-50/80 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 mr-3">
                    <svg
                      className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                      개인정보 처리방침
                    </div>
                  </div>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 ml-auto group-hover:text-gray-600 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-200/50 my-4 sm:my-6"></div>

            {/* 로그아웃 */}
            <button
              onClick={handleLogout}
              onKeyDown={(e) => handleKeyDown(e, handleLogout)}
              disabled={isLoggingOut}
              className="w-full flex items-center p-3 sm:p-4 rounded-xl bg-red-50/80 hover:bg-red-100/80 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-lg mr-3 sm:mr-4 group-hover:bg-red-600 transition-colors duration-200">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div className="text-left flex-grow">
                <div className="font-medium text-gray-800 text-sm sm:text-base">
                  {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">계정에서 안전하게 로그아웃</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage