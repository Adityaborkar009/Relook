import React, { useState } from 'react'
import { Copy, Check, Scissors, Calendar, Download } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import type { Hairstyle } from '../data/hairstyles'

export interface ShowBarberModalProps {
  open: boolean
  onClose: () => void
  hairstyle: Hairstyle
  referenceCode: string
  previewImage?: string
}

export function ShowBarberModal({
  open,
  onClose,
  hairstyle,
  referenceCode,
  previewImage,
}: ShowBarberModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(referenceCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const imageSrc = previewImage || hairstyle.src

  return (
    <Modal open={open} onClose={onClose} title="Show this look to your barber" size="md">
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-28 h-36 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
            <img src={imageSrc} alt={hairstyle.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-bold mb-1">
                <Scissors className="h-3 w-3" />
                <span>Barber Specs</span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg">{hairstyle.name}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{hairstyle.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/80">
              <div>
                <span className="text-slate-400 block">Length:</span>
                <span className="font-semibold text-slate-800 capitalize">{hairstyle.length}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Category:</span>
                <span className="font-semibold text-slate-800 capitalize">{hairstyle.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Instructions for the Barber */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-2 text-xs">
          <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
            <Scissors className="h-4 w-4 text-blue-600" />
            <span>Styling Instructions for Stylist:</span>
          </h5>
          <ul className="space-y-1.5 text-slate-600 pl-4 list-disc leading-relaxed">
            <li>
              <strong>Top Volume:</strong> Keep medium textured length with point-cut ends for piecey separation.
            </li>
            <li>
              <strong>Sides & Temples:</strong> Low taper fade starting just above the ears, blending naturally into beard and neckline.
            </li>
            <li>
              <strong>Neckline:</strong> Clean tapered finish without harsh box cuts.
            </li>
            <li>
              <strong>Product Finish:</strong> Matte styling paste or texturizing powder for dry volume.
            </li>
          </ul>
        </div>

        {/* Reference Code Box */}
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center bg-slate-50/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Barber Reference Code
          </p>
          <p className="text-2xl font-black text-slate-900 tracking-widest font-mono">
            {referenceCode}
          </p>
          <button
            onClick={handleCopy}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              window.print()
            }}
          >
            <Download className="h-4 w-4" />
            <span>Save / Print Card</span>
          </Button>
          <Button variant="primary" fullWidth onClick={onClose}>
            <span>Done</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ShowBarberModal
