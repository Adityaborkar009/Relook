import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Sparkles, ArrowRight, SlidersHorizontal } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ViewSlider from '../components/ViewSlider'
import { hairstyles, type Hairstyle } from '../data/hairstyles'

export function Hairstyles() {
  const [search, setSearch] = useState('')
  const [selectedLength, setSelectedLength] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredStyles = hairstyles.filter((style) => {
    const matchesSearch =
      style.name.toLowerCase().includes(search.toLowerCase()) ||
      style.description.toLowerCase().includes(search.toLowerCase())
    const matchesLength = selectedLength === 'all' || style.length.toLowerCase() === selectedLength.toLowerCase()
    const matchesCategory = selectedCategory === 'all' || style.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesLength && matchesCategory
  })

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="blue">Hairstyle Catalog</Badge>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore All Hairstyles
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Browse our AI-ready haircuts featuring multi-angle views and faceless identity-preservation reference models.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="max-w-4xl mx-auto bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by haircut name, fade type, texture..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          {/* Length filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-400 mr-1">Length:</span>
            {['all', 'short', 'medium', 'medium-long'].map((len) => (
              <button
                key={len}
                onClick={() => setSelectedLength(len)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize cursor-pointer transition-colors ${
                  selectedLength === len
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {len}
              </button>
            ))}
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-400 mr-1">Category:</span>
            {['all', 'classic', 'modern'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStyles.map((style) => (
          <Card key={style.id} hover className="p-4 flex flex-col justify-between">
            <div>
              <div className="rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                <ViewSlider
                  image={style.src}
                  views={style.views}
                />
              </div>

              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-slate-900 text-base">{style.name}</h3>
                <Badge variant="blue">{style.category}</Badge>
              </div>

              <p className="text-xs text-slate-500 capitalize mb-2">{style.length} length</p>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {style.description}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100">
              <Link to="/studio">
                <Button size="sm" variant="primary" fullWidth>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Try on in Studio</span>
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Hairstyles
