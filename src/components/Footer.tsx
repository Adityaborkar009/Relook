import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Sparkles, Scissors, QrCode } from 'lucide-react'
import BrandLogo from './ui/BrandLogo'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-12 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-100">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <BrandLogo size="md" />
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              AI-powered hairstyle visualization that helps you discover your perfect haircut before you commit.
              Preserves authentic facial identity across front, profile, and back angles.
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 border border-slate-200 text-xs font-medium text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Stateless in-memory processing • Zero photo retention</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/studio" className="hover:text-blue-600 transition-colors">Studio Try-On</Link>
              </li>
              <li>
                <Link to="/hairstyles" className="hover:text-blue-600 transition-colors">Hairstyle Library</Link>
              </li>
              <li>
                <Link to="/for-salons" className="hover:text-blue-600 transition-colors">For Salons & Barbers</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Features</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-500">4-Angle Consistency</span>
              </li>
              <li>
                <span className="text-slate-500">Before / After Slider</span>
              </li>
              <li>
                <span className="text-slate-500">Show Your Barber</span>
              </li>
              <li>
                <span className="text-slate-500">Salon QR Consultation</span>
              </li>
            </ul>
          </div>

          {/* Security & Tech */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Engine</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-500">FLUX Multi-Conditioned</span>
              </li>
              <li>
                <span className="text-slate-500">Gemini Interactions API</span>
              </li>
              <li>
                <span className="text-slate-500">Faceless Reference Lock</span>
              </li>
              <li>
                <span className="text-slate-500">Privacy First</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Relook AI. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Barber Partner Program</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
