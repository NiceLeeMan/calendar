import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

type Page = 'login' | 'signup'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login')

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage onNavigateToSignUp={() => setCurrentPage('signup')} />
      )}
      {currentPage === 'signup' && (
        <SignUpPage onNavigateToLogin={() => setCurrentPage('login')} />
      )}
    </>
  )
}

export default App
