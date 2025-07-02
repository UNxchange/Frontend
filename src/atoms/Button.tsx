import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const baseStyles = 'px-4 py-2 rounded border font-medium cursor-pointer transition-colors'
  
  const variantStyles = {
    primary: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600',
    danger: 'bg-red-500 text-white border-red-500 hover:bg-red-600'
  }

  const disabledStyles = 'opacity-50 cursor-not-allowed'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyles : ''} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
