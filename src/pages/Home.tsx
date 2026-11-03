import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Camera,
  CheckCircle2,
  Sliders,
  QrCode,
  Star,
  Users,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import BeforeAfterSlider from '../components/ui/BeforeAfterSlider'
import { hairstyles } from '../data/hairstyles'

export function Home() {
  const steps = [
    {
      num: '01',
      icon: Camera,
      title: 'Upload Photo',
      description: 'Upload a clear front selfie or multi-angle photos from your phone or webcam.',
    },
    {
      num: '02',
      icon: Sliders,
      title: 'Set Preferences',
      description: 'Choose your desired length, style vibe, and occasion—or let AI recommend top styles.',
    },
    {
      num: '03',
      icon: Sparkles,
      title: 'AI Visualization',
      description: 'Our engine locks your exact face, smile, and beard while rendering the new haircut.',
    },
    {
      num: '04',
      icon: Scissors,
      title: 'Show Your Barber',
      description: 'Get an appointment reference card with clipper guard specs to show your stylist.',
    },
  ]

  const reviews = [
    {
      name: 'Alex Rivera',
      role: 'Found his signature style',
      text: 'I was terrified of cutting my long hair for years. Seeing the textured fringe on my actual face gave me the confidence to finally go to the barbershop. Result matched the AI preview exactly.',
      rating: 5,
    },
    {
      name: 'Marcus Chen',
      role: 'Professional / Fade test',
      text: 'The Before/After split slider is incredible. Being able to see both the front and profile fade before scissors touched my hair was a game changer.',
      rating: 5,
    },
    {
      name: 'Samir Patel',
      role: 'Salon Client',
      text: 'I just showed my barber the reference card on my phone. No more trying to awkwardly explain what haircut I want—he knew exactly what clippers to use.',
      rating: 5,
    },
  ]

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 pb-16 lg:pb-24 bg-gradient-to-b from-blue-50/50 via-white to-slate-50/40">
        <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left text */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200/90 px-4 py-1.5 shadow-sm">
                <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">AI-Powered Hairstyle Visualization</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                See yourself in any <span className="gradient-text">hairstyle</span>.
              </h1>

              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover your perfect look before you commit. Upload your photo, explore modern fades & textured crops, and receive photorealistic previews with your exact face.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <Link to="/studio">
                  <Button size="lg" variant="primary">
                    <Sparkles className="h-5 w-5" />
                    <span>Start Try-On Free</span>
                  </Button>
                </Link>
                <Link to="/hairstyles">
                  <Button size="lg" variant="secondary">
                    <span>Browse Hairstyles</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  No credit card required
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Front & profile angles
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Barber consultation card
                </span>
              </div>
            </div>

            {/* Right Interactive Before/After Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl" />
                <Card className="relative p-3.5 sm:p-4 shadow-xl border-slate-200">
                  <div className="flex items-center justify-between pb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    </div>
                    <Badge variant="blue">Live Interactive Preview</Badge>
                  </div>

                  <BeforeAfterSlider
                    beforeImage="/demo-before.jpg"
                    afterImage="/demo-after.webp"
                    beforeLabel="Before"
                    afterLabel="After (Textured Fade)"
                    aspectRatio="aspect-[317/288]"
                  />

                  <div className="pt-3 text-center">
                    <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5 text-blue-600" />
                      <span>Drag slider to see seamless face and hairline blending</span>
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step "How it works" */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="purple">Simple 4-Step Process</Badge>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Relook Works
          </h2>
          <p className="mt-2 text-slate-500 text-sm">
            From initial photo upload to your barbershop appointment in under two minutes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <Card key={st.num} hover className="p-6 text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600 shadow-sm mx-auto">
                <st.icon className="h-6 w-6" />
              </div>
              <div className="text-xs font-black text-slate-300 tracking-widest uppercase">
                Step {st.num}
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">{st.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{st.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Styles Showcase */}
      <section className="bg-slate-50/70 py-20 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <Badge variant="blue">Trending Cuts</Badge>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Hairstyles
              </h2>
              <p className="mt-1 text-slate-500 text-sm">
                Tested and verified for accurate multi-angle identity preservation.
              </p>
            </div>
            <Link to="/hairstyles">
              <Button variant="secondary" size="sm">
                <span>View All 100+ Styles</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hairstyles.map((style) => (
              <Card key={style.id} hover className="overflow-hidden p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-3">
                    <img src={style.src} alt={style.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">{style.name}</h3>
                    <Badge variant="green">Top Match</Badge>
                  </div>
                  <p className="text-xs text-slate-500 capitalize">{style.length} • {style.category}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">{style.description}</p>
                </div>
                <Link to="/studio" className="block pt-2">
                  <Button variant="secondary" size="sm" fullWidth>
                    <span>Try In Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Salons & Barbers Banner (from Solair) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3.5 py-1 text-xs font-bold">
                <QrCode className="h-3.5 w-3.5" />
                <span>For Barbershops & Salons</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Modernize client consultations with in-chair QR codes.
              </h2>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Place a Relook QR stand at your salon reception or mirrors. Clients scan, test hairstyles on their phone while waiting, and show you the exact haircut they want.
              </p>
              <div className="pt-2">
                <Link to="/for-salons">
                  <Button size="md" variant="primary">
                    <span>Learn About Salon QR</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 text-center max-w-xs">
                <div className="h-40 w-40 mx-auto rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center p-2 mb-3">
                  <QrCode className="h-28 w-28 text-slate-900" />
                </div>
                <h4 className="font-extrabold text-sm">Raj Hair Studio</h4>
                <p className="text-[11px] text-slate-500">Scan to preview cuts in 3D</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="orange">Verified User Feedback</Badge>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight">
            Real Transformations, Zero Regrets
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic">"{r.text}"</p>
              <div className="pt-2 border-t border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{r.name}</p>
                <p className="text-xs text-slate-400">{r.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <Card className="p-10 sm:p-14 bg-gradient-to-br from-blue-50 via-purple-50/40 to-white border-blue-200/80 shadow-md">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to find your signature look?
          </h2>
          <p className="mt-3 text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
            Upload your photo now and try on trending fades, textured crops, and classic parts in seconds.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/studio">
              <Button size="lg" variant="primary">
                <Sparkles className="h-5 w-5" />
                <span>Launch Studio</span>
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default Home
