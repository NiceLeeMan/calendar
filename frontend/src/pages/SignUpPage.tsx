import { useNavigate } from 'react-router-dom'
import SignUpForm from '../components/auth/SignUpForm'

const SignUpPage = () => {
  const navigate = useNavigate()

  const handleNavigateToLogin = () => {
    navigate('/signIn')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <SignUpForm onNavigateToLogin={handleNavigateToLogin} />
    </div>
  )
}

export default SignUpPage