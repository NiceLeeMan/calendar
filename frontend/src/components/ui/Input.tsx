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
    <div className="w-full mb-6">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input 
        className={`
          w-full px-4 py-3 border border-gray-300 rounded-md text-base 
          transition-all duration-200 outline-none
          placeholder:text-gray-400
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="block text-xs text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input
