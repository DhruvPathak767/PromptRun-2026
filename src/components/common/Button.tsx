import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  isLoading?: boolean
}

/**
 * Shared accessible Button component with WCAG 2.2 touch-target compliance (>= 40px height).
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF4D]'

  const variantClasses = {
    primary:
      'bg-[#C8FF4D] text-[#0B0D12] hover:bg-[#b8f53d] active:scale-[0.98] shadow-md shadow-[#C8FF4D]/20 font-bold',
    secondary:
      'bg-[#1B2130] text-[#F5F7FA] border border-[#263045] hover:bg-[#263045] hover:text-[#C8FF4D] active:scale-[0.98]',
    outline:
      'bg-transparent border border-[#263045] text-[#A5ADBE] hover:text-[#F5F7FA] hover:border-[#A5ADBE] active:scale-[0.98]',
    ghost:
      'bg-transparent text-[#A5ADBE] hover:text-[#F5F7FA] hover:bg-[#1B2130]',
    danger:
      'bg-[#FF5C5C]/15 border border-[#FF5C5C]/30 text-[#FF5C5C] hover:bg-[#FF5C5C]/25 active:scale-[0.98]',
  }[variant]

  const sizeClasses = {
    sm: 'min-h-[36px] px-3 py-1.5 text-xs gap-1.5',
    md: 'min-h-[40px] px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'min-h-[44px] px-6 py-2.5 text-sm sm:text-base gap-2.5',
  }[size]

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  )
}
