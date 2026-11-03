import React, { useRef, useState } from 'react'
import { Upload, Camera, CheckCircle2, RefreshCw, ChevronDown, ChevronUp, Image as ImageIcon, Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import type { PhotoView } from '../../domain/generationRequest'

export interface StudioUploadProps {
  photos: Partial<Record<PhotoView, string>>
  onPhotoChange: (view: PhotoView, dataUrl: string) => void
  onContinue: () => void
}

export function StudioUpload({ photos, onPhotoChange, onContinue }: StudioUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showMultiAngle, setShowMultiAngle] = useState(false)
  const [activeUploadView, setActiveUploadView] = useState<PhotoView>('Front')

  const hasFront = !!photos.Front

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onPhotoChange(activeUploadView, reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUseSample = async () => {
    try {
      const res = await fetch('/sample-front.jpg')
      const blob = await res.blob()
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onPhotoChange('Front', reader.result)
        }
      }
      reader.readAsDataURL(blob)
    } catch (err) {
      console.error('Failed to load sample photo', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload your photo
        </h2>
        <p className="mt-2 text-slate-500 text-sm">
          A clear, front-facing portrait with good lighting works best. Your photo stays private in your browser.
        </p>
      </div>

      {/* Main Upload Box */}
      <Card className="p-6 sm:p-8 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {hasFront ? (
          <div className="space-y-6">
            <div className="relative mx-auto w-44 h-56 rounded-2xl overflow-hidden shadow-lg border-2 border-blue-500 bg-slate-900 group">
              <img
                src={photos.Front}
                alt="Your front photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setActiveUploadView('Front')
                    fileInputRef.current?.click()
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Replace</span>
                </Button>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Front photo ready</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setActiveUploadView('Front')
                  fileInputRef.current?.click()
                }}
              >
                Change Photo
              </Button>
              <Button variant="primary" onClick={onContinue}>
                Continue to Preferences
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              setActiveUploadView('Front')
              fileInputRef.current?.click()
            }}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-2xl p-8 sm:p-12 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 group"
          >
            <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>

            <div>
              <p className="font-bold text-slate-800 text-base">
                Click or drag & drop your photo here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG, or WebP up to 15MB
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveUploadView('Front')
                  fileInputRef.current?.click()
                }}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Photo</span>
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  handleUseSample()
                }}
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Use Sample Photo</span>
              </Button>
            </div>
          </div>
        )}

        {/* Multi-angle expansion toggle */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-left">
          <button
            type="button"
            onClick={() => setShowMultiAngle(!showMultiAngle)}
            className="inline-flex items-center justify-between w-full text-xs font-bold text-slate-600 hover:text-blue-600 cursor-pointer"
          >
            <span>Optional: Add Side & Back Photos for 4-Angle Try-On</span>
            {showMultiAngle ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showMultiAngle && (
            <div className="mt-4 grid grid-cols-3 gap-3 animate-fade-in">
              {(['Left', 'Right', 'Back'] as PhotoView[]).map((angle) => (
                <div
                  key={angle}
                  onClick={() => {
                    setActiveUploadView(angle)
                    fileInputRef.current?.click()
                  }}
                  className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${
                    photos[angle]
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-700 mb-1">{angle} View</p>
                  {photos[angle] ? (
                    <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-300">
                      <img src={photos[angle]} alt={angle} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-16 w-full rounded-lg bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
                      <ImageIcon className="h-5 w-5 text-slate-400" />
                    </div>
                  )}
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {photos[angle] ? 'Uploaded' : 'Click to add'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default StudioUpload
