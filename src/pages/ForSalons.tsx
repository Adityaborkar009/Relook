import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode,
  Sparkles,
  Scissors,
  CheckCircle2,
  TrendingUp,
  Users,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export function ForSalons() {
  const [salonName, setSalonName] = useState('Raj Hair Studio')

  const benefits = [
    {
      icon: QrCode,
      title: 'In-Chair QR Experience',
      description: 'Clients scan your salon QR code from the waiting area mirror or reception desk.',
    },
    {
      icon: Scissors,
      title: 'Zero Consultation Miscommunication',
      description: 'Clients show you the exact multi-angle preview and clipper guard specs before you cut.',
    },
    {
      icon: TrendingUp,
      title: 'Boost Upsells & Premium Styling',
      description: 'Encourage clients to try bolder fades and premium styling products they can see on themselves.',
    },
    {
      icon: Users,
      title: 'Higher Client Retention',
      description: 'Save client look history and reference codes for seamless return visits.',
    },
    {
      icon: Smartphone,
      title: 'No App Download Required',
      description: 'Runs instantly in client mobile browsers (Safari/Chrome) without app store friction.',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Privacy & Speed',
      description: 'In-memory processing ensures customer photos are protected and never stored.',
    },
  ]

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-14 lg:p-20 shadow-xl">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 border border-white/20 text-xs font-bold text-blue-200">
              <Building2 className="h-3.5 w-3.5" />
              <span>For Barbershops & Salons</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Give your clients an <span className="gradient-text">AI consultation</span> experience.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Place one Relook QR stand in your waiting area. Clients scan, visualize trending fades on their actual face while waiting, and show you exact haircut specs when they sit in your chair.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/studio">
                <Button size="lg" variant="primary">
                  <Sparkles className="h-4 w-4" />
                  <span>Try Interactive Demo</span>
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="secondary">
                  <span>View Salon Pricing</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive QR Stand Simulator */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="space-y-1">
                <input
                  type="text"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="Enter salon name"
                  className="w-full font-black text-xl text-center text-slate-900 border-b border-dashed border-slate-300 pb-1 focus:border-blue-600 outline-none"
                />
                <p className="text-xs text-slate-400">Scan to preview cuts on your phone</p>
              </div>

              <div className="h-48 w-48 mx-auto rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center p-4 shadow-inner">
                <QrCode className="h-36 w-36 text-slate-900" />
              </div>

              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Client scans with camera</p>
                <p>Loads 4-angle try-on tailored to your salon menu</p>
              </div>

              <Button size="sm" variant="secondary" fullWidth onClick={() => window.print()}>
                <span>Print QR Table Stand</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="blue">Why Salons Love Relook</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for the Modern Barbershop
          </h2>
          <p className="text-slate-500 text-sm">
            Eliminate awkward haircut misunderstandings and turn indecisive walk-ins into repeat customers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <Card key={i} hover className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{b.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{b.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ForSalons
