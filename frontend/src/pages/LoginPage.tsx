import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm/LoginForm.tsx'

const LoginPage = () => {
  const navigate = useNavigate()

  const handleNavigateToSignUp = () => {
    navigate('/signup')
  }

  const handleNavigateToMain = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <LoginForm 
        onNavigateToSignUp={handleNavigateToSignUp}
        onNavigateToMain={handleNavigateToMain}
      />
    </div>
  )
}

export default LoginPage