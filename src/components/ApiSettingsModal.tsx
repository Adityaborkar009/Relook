import React, { useState } from 'react'
import { Shield, KeyRound, Sparkles, Check, ExternalLink } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'

export interface ApiSettingsModalProps {
  open: boolean
  onClose: () => void
  provider: 'flux' | 'gemini'
  onProviderChange: (p: 'flux' | 'gemini') => void
  fluxToken: string
  onFluxTokenChange: (token: string) => void
  geminiKey: string
  onGeminiKeyChange: (key: string) => void
}

export function ApiSettingsModal({
  open,
  onClose,
  provider,
  onProviderChange,
  fluxToken,
  onFluxTokenChange,
  geminiKey,
  onGeminiKeyChange,
}: ApiSettingsModalProps) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 600)
  }

  return (
    <Modal open={open} onClose={onClose} title="AI Generation Settings" size="md">
      <div className="space-y-6">
        {/* Provider Radio Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Generation Provider
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onProviderChange('flux')}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                provider === 'flux'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>FLUX (Hugging Face)</span>
                {provider === 'flux' && <Check className="h-4 w-4 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Fast multi-angle diffusion. Free queue supported, or use personal token for quota.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onProviderChange('gemini')}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                provider === 'gemini'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Google Gemini</span>
                {provider === 'gemini' && <Check className="h-4 w-4 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                4-photo multi-modal conditioning via Gemini 3.1 Flash Image.
              </p>
            </button>
          </div>
        </div>

        {/* Credentials Field */}
        {provider === 'flux' ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="flux-token" className="block text-sm font-semibold text-slate-700">
                Hugging Face Access Token (Optional)
              </label>
              <a
                href="https://huggingface.co/settings/tokens"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <span>Get token</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <input
              id="flux-token"
              type="password"
              value={fluxToken}
              onChange={(e) => onFluxTokenChange(e.target.value)}
              placeholder="hf_... (leave blank to run on anonymous public queue)"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Tokens remain in browser memory only and are never stored to disk or database.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="gemini-key" className="block text-sm font-semibold text-slate-700">
                Google AI Studio Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <span>Get API key</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <input
              id="gemini-key"
              type="password"
              value={geminiKey}
              onChange={(e) => onGeminiKeyChange(e.target.value)}
              placeholder="AIza..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Requires a paid project quota for gemini-3.1-flash-image.
            </p>
          </div>
        )}

        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Privacy Guarantee:</strong> Relook operates completely statelessly.
            Your keys, uploaded photos, and generated previews are never saved, tracked, or logged.
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {saved ? 'Saved!' : 'Apply Settings'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ApiSettingsModal
