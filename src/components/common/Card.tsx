import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface' | 'glow' | 'interactive' | 'danger'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

/**
 * Shared Card component with high-contrast borders and unified dark theme styling.
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200'

  const variantClasses = {
    default: 'bg-[#141822] border border-[#263045] shadow-lg',
    surface: 'bg-[#1B2130] border border-[#263045]',
    glow: 'bg-[#141822] border border-[#C8FF4D]/30 shadow-lg shadow-[#C8FF4D]/5',
    interactive:
      'bg-[#141822] border border-[#263045] hover:border-[#A5ADBE] hover:shadow-xl cursor-pointer',
    danger: 'bg-[#141822] border border-[#FF5C5C]/30 shadow-lg shadow-[#FF5C5C]/5',
  }[variant]

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-8',
  }[padding]

  return (
    <div className={`${baseClasses} ${variantClasses} ${paddingClasses} ${className}`} {...props}>
      {children}
    </div>
  )
}
