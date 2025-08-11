interface FieldErrorProps {
  error?: string | null
  className?: string
}

const FieldError = ({ error, className = "" }: FieldErrorProps) => {
  if (!error) return null

  return (
    <p className={`text-sm text-red-600 mt-2 ${className}`}>
      {error}
    </p>
  )
}

export default FieldError
