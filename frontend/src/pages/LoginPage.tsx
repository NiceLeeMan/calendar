import LoginForm from '../components/forms/LoginForm'

interface LoginPageProps {
  onNavigateToSignUp: () => void
}

const LoginPage = ({ onNavigateToSignUp }: LoginPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <LoginForm onNavigateToSignUp={onNavigateToSignUp} />
    </div>
  )
}

export default LoginPage
