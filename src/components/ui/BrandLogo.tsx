import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export interface BrandLogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-11 w-11',
}

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

export function BrandLogo({ className = '', showText = true, size = 'md' }: BrandLogoProps) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      <div
        className={`relative rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow ${sizeClasses[size]}`}
      >
        <Sparkles className="h-1/2 w-1/2 text-white animate-pulse" />
      </div>
      {showText && (
        <span className={`font-black text-slate-900 tracking-tight flex items-center ${textSizeClasses[size]}`}>
          Relook
          <span className="ml-1 text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200/60">
            AI
          </span>
        </span>
      )}
    </Link>
  )
}

export default BrandLogo
