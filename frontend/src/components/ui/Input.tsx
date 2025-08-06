import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}: InputProps) => {
  return (
    <div className="w-full mb-8">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input 
          className={`
            w-full px-0 py-3 text-base bg-transparent
            border-0 border-b-2 border-gray-300
            transition-all duration-200 outline-none
            placeholder:text-gray-400
            focus:border-blue-500
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-200 focus-within:w-full"></div>
      </div>
      {error && (
        <span className="block text-xs text-red-500 mt-2">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input
