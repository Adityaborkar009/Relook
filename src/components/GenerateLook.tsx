import { useEffect, useRef, useState } from 'react'
import { hairstyles } from '../data/hairstyles'
import { photoViews, type GenerationRequest, type PhotoView } from '../domain/generationRequest'
import { Download, Columns2, Eye, Loader2, RefreshCw, Grid2X2, CheckCircle2 } from 'lucide-react'

type GeneratedImage = { mimeType: string; data: string }

const orderedViews: PhotoView[] = ['Front', 'Left', 'Right', 'Back']

async function encode(file: File): Promise<string> {
  const url = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read a photo. Please replace it and try again.'))
    reader.readAsDataURL(file)
  })
  return url.slice(url.indexOf(',') + 1)
}

export default function GenerateLook({ request }: { request: GenerationRequest }) {
  const [provider, setProvider] = useState<'flux' | 'gemini'>('flux')
  const [key, setKey] = useState('')
  const [views, setViews] = useState<Partial<Record<PhotoView, GeneratedImage>>>({})
  const [activeTab, setActiveTab] = useState<'all' | PhotoView>('all')
  const [busy, setBusy] = useState(false)
  const [currentProgress, setCurrentProgress] = useState<string>('')
  const [error, setError] = useState('')
  const [originalUrls, setOriginalUrls] = useState<Partial<Record<PhotoView, string>>>({})
  const controller = useRef<AbortController | null>(null)

  useEffect(() => {
    const urls: Partial<Record<PhotoView, string>> = {}
    for (const view of photoViews) {
      if (request.photos[view]) {
        urls[view] = URL.createObjectURL(request.photos[view])
      }
    }
    setOriginalUrls(urls)
    return () => {
      Object.values(urls).forEach(url => url && URL.revokeObjectURL(url))
    }
  }, [request.photos])

  useEffect(() => {
    controller.current?.abort()
    setViews({})
    setError('')
    setBusy(false)
    setCurrentProgress('')
    return () => controller.current?.abort()
  }, [request, provider])

  const canSubmit = provider === 'gemini' ? Boolean(key.trim()) : true

  const generateSingleView = async (view: PhotoView, encodedPhotos: Record<string, { mimeType: string; data: string }>, signal: AbortSignal) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        apiKey: key.trim(),
        photos: encodedPhotos,
        hairstyle: request.hairstyle,
        view,
      }),
      signal,
    })
    const payload = await response.json()
    if (!response.ok) {
      const message = typeof payload.error === 'string' ? payload.error : `Failed to generate ${view} view.`
      const status = Number.isInteger(payload.providerStatus) ? `HTTP ${payload.providerStatus}` : ''
      const code = typeof payload.providerCode === 'string' && /^[a-z_]{1,50}$/.test(payload.providerCode) ? payload.providerCode : ''
      const diagnostic = [status, code].filter(Boolean).join(' / ')
      const summary = diagnostic ? `${message} (${diagnostic})` : message
      const detail = typeof payload.providerDetail === 'string' ? payload.providerDetail : ''
      throw new Error(detail ? `${summary}\n${detail}` : summary)
    }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(payload.mimeType) || typeof payload.data !== 'string') {
      throw new Error(`The provider returned an unexpected image format for ${view} view.`)
    }
    return payload as GeneratedImage
  }

  const generateAllViews = async () => {
    if (!canSubmit || busy) return
    const abort = new AbortController()
    controller.current = abort
    setBusy(true)
    setError('')
    setViews({})

    try {
      const encodedPhotos = Object.fromEntries(
        await Promise.all(
          photoViews.map(async (view) => [
            view,
            {
              mimeType: request.photos[view].type,
              data: await encode(request.photos[view]),
            },
          ])
        )
      )

      if (abort.signal.aborted) return

      if (provider === 'gemini') {
        setCurrentProgress('Generating 4-view preview with Gemini…')
        const single = await generateSingleView('Front', encodedPhotos, abort.signal)
        if (!abort.signal.aborted) {
          setViews({ Front: single })
        }
      } else {
        // FLUX multi-angle separate generation
        const accumulated: Partial<Record<PhotoView, GeneratedImage>> = {}
        for (let i = 0; i < orderedViews.length; i++) {
          const view = orderedViews[i]
          if (abort.signal.aborted) break
          setCurrentProgress(`Generating ${view} view (${i + 1} of ${orderedViews.length})…`)
          const generated = await generateSingleView(view, encodedPhotos, abort.signal)
          accumulated[view] = generated
          setViews({ ...accumulated })
        }
      }
    } catch (cause) {
      if (!abort.signal.aborted) {
        setError(cause instanceof Error ? cause.message : 'Generation failed. Try again.')
      }
    } finally {
      if (!abort.signal.aborted) {
        setBusy(false)
        setCurrentProgress('')
      }
    }
  }

  const regenerateSingle = async (view: PhotoView) => {
    if (busy) return
    const abort = new AbortController()
    controller.current = abort
    setBusy(true)
    setError('')
    setCurrentProgress(`Regenerating ${view} view…`)

    try {
      const encodedPhotos = Object.fromEntries(
        await Promise.all(
          photoViews.map(async (v) => [
            v,
            {
              mimeType: request.photos[v].type,
              data: await encode(request.photos[v]),
            },
          ])
        )
      )
      if (abort.signal.aborted) return
      const generated = await generateSingleView(view, encodedPhotos, abort.signal)
      if (!abort.signal.aborted) {
        setViews((prev) => ({ ...prev, [view]: generated }))
      }
    } catch (cause) {
      if (!abort.signal.aborted) {
        setError(cause instanceof Error ? cause.message : `Failed to regenerate ${view} view.`)
      }
    } finally {
      if (!abort.signal.aborted) {
        setBusy(false)
        setCurrentProgress('')
      }
    }
  }

  const choice = request.hairstyle
  const selectedStyle = choice.kind === 'preset' ? hairstyles.find((style) => style.id === choice.id) : null
  const styleName = selectedStyle?.name ?? 'Custom hairstyle'
  const generatedCount = orderedViews.filter((v) => Boolean(views[v])).length
  const hasAnyGenerated = generatedCount > 0

  const downloadImage = (img: GeneratedImage, view: string) => {
    const ext = img.mimeType === 'image/jpeg' ? 'jpg' : img.mimeType === 'image/webp' ? 'webp' : 'png'
    const link = document.createElement('a')
    link.href = `data:${img.mimeType};base64,${img.data}`
    link.download = `relook-${styleName.toLowerCase().replace(/\s+/g, '-')}-${view.toLowerCase()}.${ext}`
    link.click()
  }

  const downloadAll = () => {
    orderedViews.forEach((view) => {
      const img = views[view]
      if (img) downloadImage(img, view)
    })
  }

  return (
    <section className="mt-6 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm" aria-labelledby="generate-heading">
      <h3 id="generate-heading" className="text-xl font-bold text-slate-900">
        Generate your 4-view preview
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Relook generates realistic previews for each angle—Front, Left, Right, and Back—matching your chosen haircut.
      </p>

      <label htmlFor="generation-provider" className="mt-5 block text-sm font-semibold text-slate-800">
        Generation Provider
      </label>
      <select
        id="generation-provider"
        disabled={busy}
        value={provider}
        onChange={(event) => {
          setProvider(event.target.value as 'flux' | 'gemini')
          setKey('')
        }}
        className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-slate-900 shadow-sm"
      >
        <option value="flux">FLUX — 4 separate high-resolution views (Front, Left, Right, Back)</option>
        <option value="gemini">Gemini — single 4-panel collage preview</option>
      </select>

      <p className="mt-2 text-xs text-slate-500">
        {provider === 'flux'
          ? 'FLUX Klein renders each angle individually for maximum clarity and identity preservation. Enter your Hugging Face access token to use your dedicated compute quota.'
          : 'Gemini sends all 4 views together to generate a single 4-panel image. Requires a paid Google AI Studio API key with gemini-3.1-flash-image quota.'}
      </p>

      <label htmlFor="provider-key" className="mt-5 block text-sm font-semibold text-slate-800">
        {provider === 'flux' ? 'Hugging Face Access Token' : 'Gemini API Key'}
      </label>
      <input
        id="provider-key"
        type="password"
        autoComplete="off"
        spellCheck={false}
        value={key}
        onChange={(event) => setKey(event.target.value)}
        placeholder={provider === 'flux' ? 'hf_… (your Hugging Face token)' : 'Paste your Gemini API key'}
        className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-slate-900 shadow-sm"
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canSubmit || busy}
          onClick={generateAllViews}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{currentProgress || 'Generating views…'}</span>
            </>
          ) : (
            <span>Generate 4-View Look</span>
          )}
        </button>

        {busy && (
          <button
            type="button"
            onClick={() => controller.current?.abort()}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
        )}
      </div>

      <div aria-live="polite">
        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Generation Notice</p>
            <p className="mt-1 whitespace-pre-wrap break-words">{error}</p>
          </div>
        )}
        {busy && (
          <p className="mt-3 text-sm text-slate-600">
            {currentProgress} Please keep this browser tab open.
          </p>
        )}
      </div>

      {hasAnyGenerated && (
        <div className="mt-10 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-bold text-slate-900">{styleName} Preview</h4>
                {generatedCount === 4 && (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 4 of 4 Views Ready
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Each view has been individually rendered to preserve your facial features and follow the haircut geometry.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === 'all' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid2X2 className="h-4 w-4" />
                  All 4 Views
                </button>
                {orderedViews.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setActiveTab(v)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                      activeTab === v ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {generatedCount > 1 && (
                <button
                  type="button"
                  onClick={downloadAll}
                  className="flex items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  <Download className="h-4 w-4" />
                  Download All Views
                </button>
              )}
            </div>
          </div>

          {activeTab === 'all' ? (
            /* 4 Separate Views Grid */
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {orderedViews.map((view) => {
                const img = views[view]
                const orig = originalUrls[view]
                return (
                  <div
                    key={view}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition shadow-sm hover:shadow"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3">
                        <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                          {view} View
                        </span>
                        {img && (
                          <button
                            type="button"
                            title={`Re-generate ${view} view`}
                            disabled={busy}
                            onClick={() => regenerateSingle(view)}
                            className="text-slate-400 hover:text-blue-600 disabled:opacity-50"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        {img ? (
                          <img
                            src={`data:${img.mimeType};base64,${img.data}`}
                            alt={`${view} view hairstyle preview`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 text-center text-xs text-slate-400">
                            {busy && currentProgress.includes(view) ? (
                              <>
                                <Loader2 className="mb-2 h-6 w-6 animate-spin text-blue-600" />
                                <span>Generating {view}…</span>
                              </>
                            ) : (
                              <span>Pending generation</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {img && (
                      <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setActiveTab(view)}
                          className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-blue-600"
                        >
                          <Columns2 className="h-3.5 w-3.5" /> Compare
                        </button>

                        <button
                          type="button"
                          onClick={() => downloadImage(img, view)}
                          className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            /* Single View Detailed Comparison */
            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <h5 className="font-semibold text-slate-900">
                  {activeTab} View · Detailed Inspection
                </h5>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  &larr; Back to all views
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* 1. Original Photo */}
                <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Original {activeTab} Photo
                  </span>
                  {originalUrls[activeTab] ? (
                    <img
                      src={originalUrls[activeTab]}
                      alt={`Original ${activeTab} photo`}
                      className="h-80 w-full rounded-lg object-contain bg-white border border-slate-200"
                    />
                  ) : (
                    <div className="flex h-80 w-full items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-500">
                      Photo not loaded
                    </div>
                  )}
                  <span className="mt-2 text-xs text-slate-500">Your natural hair & features</span>
                </div>

                {/* 2. Reference Hairstyle */}
                <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Target Reference
                  </span>
                  {selectedStyle ? (
                    <img
                      src={selectedStyle.views?.[activeTab] || selectedStyle.src}
                      alt={`${selectedStyle.name} ${activeTab} view reference`}
                      className="h-80 w-full rounded-lg object-contain bg-white border border-slate-200"
                    />
                  ) : (
                    <div className="flex h-80 w-full items-center justify-center rounded-lg bg-white p-4 text-center text-xs text-slate-600 border border-slate-200">
                      {choice.kind === 'custom' ? choice.description : 'Custom hairstyle'}
                    </div>
                  )}
                  <span className="mt-2 text-xs text-slate-500">{styleName} Reference</span>
                </div>

                {/* 3. Generated Result */}
                <div className="flex flex-col items-center rounded-xl border-2 border-blue-500 bg-blue-50/50 p-4 shadow-sm">
                  <span className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                    Generated {activeTab} Preview
                  </span>
                  {views[activeTab] ? (
                    <img
                      src={`data:${views[activeTab]!.mimeType};base64,${views[activeTab]!.data}`}
                      alt={`Generated ${activeTab} preview`}
                      className="h-80 w-full rounded-lg object-contain bg-white border border-blue-200"
                    />
                  ) : (
                    <div className="flex h-80 w-full items-center justify-center rounded-lg bg-white text-xs text-slate-400 border border-slate-200">
                      View not generated yet
                    </div>
                  )}
                  <div className="mt-2 flex w-full items-center justify-between">
                    <span className="text-xs font-medium text-blue-800">High-Res Render</span>
                    {views[activeTab] && (
                      <button
                        type="button"
                        onClick={() => downloadImage(views[activeTab]!, activeTab)}
                        className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        <Download className="h-3 w-3" /> Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
