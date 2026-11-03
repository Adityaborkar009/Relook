import React, { useState } from 'react'
import { Check, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react'
import StudioUpload from '../components/studio/StudioUpload'
import StudioPreferences, { type UserPreferences } from '../components/studio/StudioPreferences'
import StudioRecommendations from '../components/studio/StudioRecommendations'
import StudioResult from '../components/studio/StudioResult'
import { hairstyles, type Hairstyle } from '../data/hairstyles'
import type { PhotoView } from '../domain/generationRequest'

export interface StudioProps {
  provider: 'flux' | 'gemini'
  fluxToken: string
  geminiKey: string
  onOpenSettings?: () => void
}

export function Studio({ provider, fluxToken, geminiKey, onOpenSettings }: StudioProps) {
  const [currentStep, setCurrentStep] = useState<number>(1)

  // State
  const [photos, setPhotos] = useState<Partial<Record<PhotoView, string>>>({})
  const [preferences, setPreferences] = useState<UserPreferences>({
    gender: 'Men',
    length: 'Short',
    styleVibe: 'Modern / Fade',
    occasion: 'Everyday',
  })
  const [selectedHairstyle, setSelectedHairstyle] = useState<Hairstyle>(hairstyles[0])
  const [generatedViews, setGeneratedViews] = useState<Partial<Record<PhotoView, string>>>({})
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generationProgress, setGenerationProgress] = useState<string>('')
  const [generationError, setGenerationError] = useState<string | null>(null)

  const steps = [
    { num: '01', label: 'Photo', id: 1 },
    { num: '02', label: 'Preferences', id: 2 },
    { num: '03', label: 'Styles', id: 3 },
    { num: '04', label: 'Result', id: 4 },
  ]

  const handlePhotoChange = (view: PhotoView, dataUrl: string) => {
    setPhotos((prev) => ({ ...prev, [view]: dataUrl }))
  }

  // Generation trigger
  const runGeneration = async (targetView?: PhotoView) => {
    setIsGenerating(true)
    setGenerationError(null)

    const viewsToRun: PhotoView[] = targetView
      ? [targetView]
      : ['Front', 'Left', 'Right', 'Back']

    const currentViews = { ...generatedViews }

    try {
      for (let i = 0; i < viewsToRun.length; i++) {
        const view = viewsToRun[i]
        setGenerationProgress(`Synthesizing ${view} angle (${i + 1}/${viewsToRun.length})...`)

        const payload = {
          photos: {
            Front: photos.Front || photos.Left || photos.Right || photos.Back,
            Left: photos.Left || photos.Front,
            Right: photos.Right || photos.Front,
            Back: photos.Back || photos.Front,
          },
          hairstyle: {
            kind: 'preset' as const,
            id: selectedHairstyle.id,
          },
          provider,
          apiKey: provider === 'flux' ? fluxToken : geminiKey,
          view,
        }

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || `Failed generating ${view} angle`)
        }

        const viewKey = (data.view as PhotoView) || view
        const dataUrl = `data:${data.image.mimeType};base64,${data.image.data}`
        currentViews[viewKey] = dataUrl
        setGeneratedViews({ ...currentViews })
      }
    } catch (err: any) {
      console.error('Generation error:', err)
      setGenerationError(err.message || 'An error occurred during generation.')
    } finally {
      setIsGenerating(false)
      setGenerationProgress('')
    }
  }

  const handleStartGeneration = () => {
    setCurrentStep(4)
    runGeneration()
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Top 4-Step Progress Indicator */}
      <div className="mx-auto max-w-4xl mb-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          {steps.map((s, idx) => {
            const isCompleted = currentStep > s.id
            const isCurrent = currentStep === s.id

            return (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.id < currentStep || (s.id === 4 && Object.keys(generatedViews).length > 0)) {
                      setCurrentStep(s.id)
                    }
                  }}
                  className={`flex items-center gap-2.5 sm:gap-3 flex-1 text-left cursor-pointer transition-all ${
                    isCurrent
                      ? 'opacity-100'
                      : isCompleted
                      ? 'opacity-80 hover:opacity-100'
                      : 'opacity-40'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/30'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : s.num}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Step {s.num}
                    </p>
                    <p className={`text-xs font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-600'}`}>
                      {s.label}
                    </p>
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <div className="hidden sm:block h-0.5 w-6 sm:w-10 bg-slate-200" />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="mx-auto max-w-5xl">
        {currentStep === 1 && (
          <StudioUpload
            photos={photos}
            onPhotoChange={handlePhotoChange}
            onContinue={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <StudioPreferences
            preferences={preferences}
            onPreferencesChange={setPreferences}
            onContinue={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <StudioRecommendations
            preferences={preferences}
            selectedHairstyle={selectedHairstyle}
            onSelectHairstyle={(style) => setSelectedHairstyle(style)}
            onContinue={handleStartGeneration}
          />
        )}

        {currentStep === 4 && (
          <StudioResult
            originalPhotos={photos}
            generatedViews={generatedViews}
            selectedHairstyle={selectedHairstyle}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            generationError={generationError}
            onRegenerate={runGeneration}
            onChangeHairstyle={() => setCurrentStep(3)}
            onOpenSettings={onOpenSettings}
          />
        )}
      </div>
    </div>
  )
}

export default Studio
