import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) => {
  const baseClasses = 'border-none rounded-md font-medium cursor-pointer transition-all duration-200 outline-none focus:outline-2 focus:outline-blue-500 focus:outline-offset-2'
  
  const variantClasses = {
    primary: disabled 
      ? 'bg-gray-400 text-white cursor-not-allowed'
      : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: disabled
      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
  }
  
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-4 py-3 text-base w-full',
    large: 'px-6 py-4 text-lg'
  }

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
