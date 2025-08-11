import LoginForm from '../components/auth/LoginForm'

interface LoginPageProps {
  onNavigateToSignUp: () => void
  onNavigateToMain: () => void
}

const LoginPage = ({ onNavigateToSignUp, onNavigateToMain }: LoginPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <LoginForm 
        onNavigateToSignUp={onNavigateToSignUp}
        onNavigateToMain={onNavigateToMain}
      />
    </div>
  )
}

export default LoginPage
