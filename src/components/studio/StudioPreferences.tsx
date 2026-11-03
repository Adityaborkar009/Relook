import React from 'react'
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

export interface UserPreferences {
  gender: string
  length: string
  styleVibe: string
  occasion: string
}

export interface StudioPreferencesProps {
  preferences: UserPreferences
  onPreferencesChange: (prefs: UserPreferences) => void
  onContinue: () => void
}

export function StudioPreferences({
  preferences,
  onPreferencesChange,
  onContinue,
}: StudioPreferencesProps) {
  const genderOptions = ['Men', 'Women', 'Kids', 'Prefer not to say']
  const lengthOptions = ['Short', 'Medium', 'Long', 'No Preference']
  const styleOptions = ['Classic', 'Modern / Fade', 'Trendy / Fringe', 'Casual', 'Bold']
  const occasionOptions = ['Everyday', 'Work', 'Party', 'Special Event']

  const handleSelect = (key: keyof UserPreferences, value: string) => {
    onPreferencesChange({ ...preferences, [key]: value })
  }

  const handleAiAutoSelect = () => {
    onPreferencesChange({
      gender: 'Men',
      length: 'Short',
      styleVibe: 'Modern / Fade',
      occasion: 'Everyday',
    })
    onContinue()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Tell us what you're looking for
        </h2>
        <p className="mt-2 text-slate-500 text-sm">
          Our AI matches these preferences to our library of haircuts to give you the highest match percentage.
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-8">
        {/* Gender */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Gender
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {genderOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect('gender', opt)}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                  preferences.gender === opt
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Hair Length */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Desired Hair Length
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {lengthOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect('length', opt)}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                  preferences.length === opt
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Style Vibe */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Style Vibe
          </label>
          <div className="flex flex-wrap gap-2.5">
            {styleOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect('styleVibe', opt)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                  preferences.styleVibe === opt
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Primary Occasion
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {occasionOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect('occasion', opt)}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                  preferences.occasion === opt
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Action buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleAiAutoSelect}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <Wand2 className="h-4 w-4" />
            <span>Not sure? Let AI Choose For Me</span>
          </button>

          <Button variant="primary" size="md" onClick={onContinue}>
            <span>Recommend Hairstyles</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default StudioPreferences
