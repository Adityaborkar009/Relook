import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { KeyRound, Sparkles, Menu, X, Scissors } from 'lucide-react'
import BrandLogo from './ui/BrandLogo'
import Button from './ui/Button'

export interface NavbarProps {
  onOpenSettings?: () => void
}

export function Navbar({ onOpenSettings }: NavbarProps) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/studio', label: 'Studio' },
    { to: '/hairstyles', label: 'Hairstyles' },
    { to: '/for-salons', label: 'For Salons' },
    { to: '/pricing', label: 'Pricing' },
  ]

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <BrandLogo size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive(link.to)
                  ? 'text-blue-600 bg-blue-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Settings */}
        <div className="hidden sm:flex items-center gap-2.5">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors"
              title="API Key & Provider Settings"
            >
              <KeyRound className="h-3.5 w-3.5 text-blue-600" />
              <span>API Settings</span>
            </button>
          )}

          <Link to="/studio">
            <Button size="sm" variant="primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Start Try-On</span>
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
              aria-label="Settings"
            >
              <KeyRound className="h-4 w-4 text-blue-600" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                isActive(link.to)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link to="/studio" onClick={() => setMobileMenuOpen(false)}>
              <Button fullWidth size="md">
                <Sparkles className="h-4 w-4" />
                <span>Start Try-On</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
