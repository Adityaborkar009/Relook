import React, { useState } from 'react'
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ApiSettingsModal from './components/ApiSettingsModal'
import Home from './pages/Home'
import Studio from './pages/Studio'
import Hairstyles from './pages/Hairstyles'
import ForSalons from './pages/ForSalons'
import Pricing from './pages/Pricing'

export default function App() {
  const [provider, setProvider] = useState<'flux' | 'gemini'>('flux')
  const [fluxToken, setFluxToken] = useState<string>('')
  const [geminiKey, setGeminiKey] = useState<string>('')
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
        <Navbar onOpenSettings={() => setSettingsOpen(true)} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/studio"
              element={
                <Studio
                  provider={provider}
                  fluxToken={fluxToken}
                  geminiKey={geminiKey}
                  onOpenSettings={() => setSettingsOpen(true)}
                />
              }
            />
            <Route path="/hairstyles" element={<Hairstyles />} />
            <Route path="/for-salons" element={<ForSalons />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        <ApiSettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          provider={provider}
          onProviderChange={setProvider}
          fluxToken={fluxToken}
          onFluxTokenChange={setFluxToken}
          geminiKey={geminiKey}
          onGeminiKeyChange={setGeminiKey}
        />
      </div>
    </HashRouter>
  )
}
