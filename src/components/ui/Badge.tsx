import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'slate'
}

const variantStyles = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200/60',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
  orange: 'bg-orange-50 text-orange-700 border-orange-200/60',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
}

export function Badge({ variant = 'blue', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
