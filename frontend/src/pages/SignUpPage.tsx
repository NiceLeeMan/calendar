import SignUpForm from '../components/auth/SignUpForm'

interface SignUpPageProps {
  onNavigateToLogin: () => void
}

const SignUpPage = ({ onNavigateToLogin }: SignUpPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <SignUpForm onNavigateToLogin={onNavigateToLogin} />
    </div>
  )
}

export default SignUpPage
