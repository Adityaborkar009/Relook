import React, { useState } from 'react'
import {
  Sparkles,
  RefreshCw,
  Scissors,
  Download,
  Share2,
  ChevronLeft,
  Calendar,
  Eye,
  Sliders,
  Check,
} from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import BeforeAfterSlider from '../ui/BeforeAfterSlider'
import ShowBarberModal from '../ShowBarberModal'
import type { Hairstyle } from '../../data/hairstyles'
import type { PhotoView } from '../../domain/generationRequest'

export interface StudioResultProps {
  originalPhotos: Partial<Record<PhotoView, string>>
  generatedViews: Partial<Record<PhotoView, string>>
  selectedHairstyle: Hairstyle
  isGenerating: boolean
  generationProgress?: string
  generationError?: string | null
  onRegenerate: (view?: PhotoView) => void
  onChangeHairstyle: () => void
  onOpenSettings?: () => void
}

export function StudioResult({
  originalPhotos,
  generatedViews,
  selectedHairstyle,
  isGenerating,
  generationProgress = 'Generating your new look...',
  generationError,
  onRegenerate,
  onChangeHairstyle,
  onOpenSettings,
}: StudioResultProps) {
  const [activeAngle, setActiveAngle] = useState<PhotoView>('Front')
  const [showBarberModal, setShowBarberModal] = useState(false)
  const [barberCode] = useState(() => `RLK-${Math.floor(1000 + Math.random() * 9000)}`)

  const angles: PhotoView[] = ['Front', 'Left', 'Right', 'Back']

  // Current images for the slider
  const beforeImg = originalPhotos[activeAngle] || originalPhotos.Front || '/sample-front.jpg'
  const afterImg =
    generatedViews[activeAngle] ||
    generatedViews.Front ||
    selectedHairstyle.views?.[activeAngle] ||
    selectedHairstyle.src

  const handleDownloadActive = () => {
    if (!afterImg) return
    const a = document.createElement('a')
    a.href = afterImg
    a.download = `relook-${selectedHairstyle.id}-${activeAngle.toLowerCase()}.png`
    a.click()
  }

  const handleDownloadAll = () => {
    angles.forEach((angle, idx) => {
      const url = generatedViews[angle]
      if (url) {
        setTimeout(() => {
          const a = document.createElement('a')
          a.href = url
          a.download = `relook-${selectedHairstyle.id}-${angle.toLowerCase()}.png`
          a.click()
        }, idx * 250)
      }
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        {isGenerating ? (
          <div className="space-y-4 py-8">
            <div className="relative mx-auto h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-600 animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
              <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-orange-500 animate-spin [animation-duration:0.8s]" />
            </div>
            <p className="text-lg font-bold text-slate-900">{generationProgress}</p>
            <p className="text-xs text-slate-400">Locking facial identity and synthesizing multi-angle haircut...</p>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1 text-xs font-bold mb-3">
              <Check className="h-3.5 w-3.5" />
              <span>Your new look is ready</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Your New Look
            </h2>
            <p className="mt-2 text-slate-500 text-sm">
              Drag the center slider to compare before and after. Switch angles to inspect all 4 views.
            </p>
          </div>
        )}
      </div>

      {generationError && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{generationError}</span>
          {onOpenSettings && (
            <Button size="sm" variant="secondary" onClick={onOpenSettings}>
              Open API Settings
            </Button>
          )}
        </div>
      )}

      {/* Main Grid: Left side Slider, Right side Barber & Specs */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Before/After Slider + Angle Tabs */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 sm:p-5">
            {/* Angle Selector Tabs */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {angles.map((angle) => (
                <button
                  key={angle}
                  onClick={() => setActiveAngle(angle)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeAngle === angle
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {angle} View
                </button>
              ))}
            </div>

            {/* Interactive Before/After Split Slider */}
            <BeforeAfterSlider
              beforeImage={beforeImg}
              afterImage={afterImg}
              beforeLabel={`Original ${activeAngle}`}
              afterLabel={`AI ${selectedHairstyle.name}`}
              aspectRatio="aspect-[3/4]"
            />

            {/* Sub-caption */}
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
              <Sliders className="h-3.5 w-3.5 text-blue-600" />
              <span>Drag the white bar horizontally to reveal the before/after transition</span>
            </div>
          </Card>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onRegenerate(activeAngle)}
                disabled={isGenerating}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate Look</span>
              </Button>

              <Button variant="secondary" size="sm" onClick={onChangeHairstyle}>
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Change Hairstyle</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={handleDownloadActive}>
                <Download className="h-3.5 w-3.5" />
                <span>Download {activeAngle}</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={handleDownloadAll}>
                <span>Download All 4 Views</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Col: Hairstyle Details & Show Your Barber Card */}
        <div className="space-y-6">
          {/* Hairstyle Specs */}
          <Card className="p-5 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Hairstyle Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Haircut</span>
                <span className="font-bold text-slate-800">{selectedHairstyle.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Length</span>
                <span className="font-bold text-slate-800 capitalize">{selectedHairstyle.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Category</span>
                <span className="font-bold text-slate-800 capitalize">{selectedHairstyle.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Face Match</span>
                <Badge variant="blue">98% Match</Badge>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              {selectedHairstyle.description}
            </p>
          </Card>

          {/* Show Your Barber Feature (from Solair) */}
          <Card className="p-5 bg-gradient-to-br from-blue-50/60 via-purple-50/30 to-white border-blue-200 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Scissors className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Show your barber</h4>
                <p className="text-[11px] text-slate-500">Take this exact look to the salon</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Generate a client reference card with technical clipper guard specs and styling notes to show your barber.
            </p>

            <Button
              variant="primary"
              fullWidth
              size="sm"
              onClick={() => setShowBarberModal(true)}
            >
              <Scissors className="h-3.5 w-3.5" />
              <span>Show My Barber</span>
            </Button>
          </Card>
        </div>
      </div>

      {/* Show Barber Modal */}
      <ShowBarberModal
        open={showBarberModal}
        onClose={() => setShowBarberModal(false)}
        hairstyle={selectedHairstyle}
        referenceCode={barberCode}
        previewImage={afterImg}
      />
    </div>
  )
}

export default StudioResult
