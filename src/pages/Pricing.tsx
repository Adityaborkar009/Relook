import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles, HelpCircle, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export function Pricing() {
  const plans = [
    {
      name: 'Starter / Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying haircuts with your own free token or queue.',
      features: [
        'Full 4-view try-on (Front, Left, Right, Back)',
        'Interactive Before / After split slider',
        'Catalog of modern & classic hairstyles',
        'Show Your Barber reference specs card',
        'Stateless in-memory privacy guarantee',
      ],
      cta: 'Start Free Try-On',
      popular: false,
    },
    {
      name: 'Pro Look Pass',
      price: '$9',
      period: 'one-time / 30 days',
      description: 'Ideal before a major haircut or salon makeover.',
      features: [
        'Everything in Free',
        'Dedicated high-speed ZeroGPU queue',
        'High-resolution multi-angle downloads',
        'All 100+ hairstyles & custom prompt styling',
        'Face shape analysis & personalized haircut matches',
      ],
      cta: 'Get Pro Access',
      popular: true,
    },
    {
      name: 'Salon Partner',
      price: '$49',
      period: 'per month / salon',
      description: 'For barbershops and salons modernizing client consultations.',
      features: [
        'Custom In-Salon QR Code Stand for waiting chairs',
        'Unlimited client scans & mobile try-ons',
        'Custom salon branding & logo on client card',
        'Barber technical clipper guard sheets',
        'Priority studio support & custom salon cuts',
      ],
      cta: 'Start Salon Trial',
      popular: false,
    },
  ]

  const faqs = [
    {
      q: 'Are my uploaded photos private and safe?',
      a: 'Yes, 100%. Relook processes photos strictly in-memory during generation. We do not store, catalog, train on, or retain your personal photos.',
    },
    {
      q: 'How does Relook preserve my exact facial expression and beard?',
      a: 'We use a dual-layer faceless reference architecture and identity locking prompts. The AI only replaces scalp hair while keeping your facial geometry, smile, and beard intact.',
    },
    {
      q: 'Can I bring my own Hugging Face token or Google key?',
      a: 'Absolutely! Click the API Settings icon in the navigation bar to enter your personal Hugging Face token or Google AI Studio key for unlimited quota.',
    },
    {
      q: 'How do I show the result to my barber?',
      a: 'Click "Show My Barber" on the result page. It generates a summary card with your haircut name, clipper guard recommendations, and a reference code.',
    },
  ]

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 animate-fade-in">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="blue">Transparent Pricing</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Pricing that grows with you
        </h1>
        <p className="text-slate-500 text-base leading-relaxed">
          Start free with our open generator and upgrade whenever you are ready for salon features.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        {plans.map((p, i) => (
          <Card
            key={i}
            className={`p-8 flex flex-col justify-between relative transition-all ${
              p.popular
                ? 'border-2 border-blue-600 shadow-xl ring-4 ring-blue-500/10'
                : 'border-slate-200'
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3.5 py-1 text-xs font-bold text-white shadow-sm">
                Most Popular
              </div>
            )}

            <div>
              <h3 className="font-bold text-slate-900 text-xl">{p.name}</h3>
              <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{p.description}</p>

              <div className="my-6">
                <span className="text-4xl font-extrabold text-slate-900">{p.price}</span>
                <span className="text-xs font-semibold text-slate-400 ml-1.5">/ {p.period}</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-100">
              <Link to="/studio">
                <Button
                  variant={p.popular ? 'primary' : 'secondary'}
                  fullWidth
                  size="md"
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <Badge variant="purple">FAQ</Badge>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <Card key={idx} className="p-5">
              <h4 className="font-bold text-slate-900 text-sm flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{f.q}</span>
              </h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed pl-6">{f.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Pricing
