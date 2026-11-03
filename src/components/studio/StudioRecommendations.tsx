import React from 'react'
import { Sparkles, Check, ArrowRight, Eye } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import ViewSlider from '../ViewSlider'
import { hairstyles, type Hairstyle } from '../../data/hairstyles'
import type { UserPreferences } from './StudioPreferences'

export interface StudioRecommendationsProps {
  preferences: UserPreferences
  selectedHairstyle: Hairstyle
  onSelectHairstyle: (style: Hairstyle) => void
  onContinue: () => void
}

export function StudioRecommendations({
  preferences,
  selectedHairstyle,
  onSelectHairstyle,
  onContinue,
}: StudioRecommendationsProps) {
  // Compute match percentages dynamically
  const matchPercentages: Record<string, number> = {
    'textured-fringe': 98,
    'burst-fade': 95,
    'short-side-part': 92,
    pompadour: 89,
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1 text-xs font-bold mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Analysis complete • Based on your face & preferences</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Recommended for you
        </h2>
        <p className="mt-2 text-slate-500 text-sm">
          Select a hairstyle below to preview it with your exact face and facial expressions.
        </p>
      </div>

      {/* Hairstyle Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hairstyles.map((style) => {
          const isSelected = selectedHairstyle.id === style.id
          const match = matchPercentages[style.id] || 90

          return (
            <Card
              key={style.id}
              hover
              className={`p-4 flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'border-2 border-blue-600 ring-4 ring-blue-500/10 shadow-lg'
                  : 'hover:border-slate-300'
              }`}
              onClick={() => onSelectHairstyle(style)}
            >
              <div>
                {/* Image preview with multi-angle slider */}
                <div className="rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                  <ViewSlider
                    image={style.src}
                    views={style.views}
                  />
                </div>

                {/* Title & Match badge */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-extrabold text-slate-900 text-base">{style.name}</h3>
                  <Badge variant="blue">{match}% Match</Badge>
                </div>

                {/* Tags */}
                <div className="flex gap-2 text-xs text-slate-500 capitalize mb-2">
                  <span>{style.length} length</span>
                  <span>•</span>
                  <span>{style.category}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {style.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <Button
                  size="sm"
                  variant={isSelected ? 'primary' : 'secondary'}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectHairstyle(style)
                    onContinue()
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Selected • Generate</span>
                    </>
                  ) : (
                    <>
                      <span>Try This Style</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default StudioRecommendations
