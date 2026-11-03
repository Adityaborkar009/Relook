import React from 'react'

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <a
          href="#top"
          aria-label="Relook home"
          className="block h-[64px] w-[220px] shrink-0 bg-center bg-no-repeat sm:w-[250px]"
          style={{ backgroundImage: 'url(/relook-logo.png)', backgroundSize: '145% auto' }}
        />

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">How it Works</a>
          <a href="#why-4-views" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Why 4 Views</a>
          <a href="#hairstyles" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Hairstyles</a>
        </nav>

        {/* Primary CTA */}
        <a href="#photos" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors text-sm">
          Try Relook
        </a>
      </div>
    </header>
  )
}
