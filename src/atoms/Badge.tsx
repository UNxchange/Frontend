import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'vigente' | 'no-vigente' | 'pendiente' | 'default'
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  const baseStyles = 'inline-block px-2 py-1 rounded text-xs font-bold'
  
  const variantStyles = {
    vigente: 'bg-green-500 text-white',
    'no-vigente': 'bg-red-500 text-white',
    pendiente: 'bg-yellow-500 text-white',
    default: 'bg-gray-500 text-white'
  }

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
