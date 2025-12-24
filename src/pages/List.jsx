import React from 'react'
import { useSearchParams } from 'react-router-dom'
import data from '../data/arenas.json'
import ArenaCard from '../components/ArenaCard'
import { FunnelIcon, MapPinIcon, CalendarDaysIcon } from '@heroicons/react/24/solid'

export default function List(){
  const [qs] = useSearchParams()
  const city = qs.get('city') || ''
  const sport = qs.get('sport') || ''
  const date = qs.get('date') || ''

  const filtered = data.filter(a=> {
    return (city? a.city.includes(city) : true) && (sport? a.sportType.includes(sport) : true)
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-glass backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-glass animate-slide-up">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-modernBlue to-neonBlue bg-clip-text text-transparent">نتایج جستجو</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          {city && (
            <div className="flex items-center gap-2 bg-glassDark rounded-xl px-4 py-2 border border-glass">
              <MapPinIcon className="w-4 h-4 text-neonBlue" />
              <span>شهر: {city}</span>
            </div>
          )}
          {sport && (
            <div className="flex items-center gap-2 bg-glassDark rounded-xl px-4 py-2 border border-glass">
              <FunnelIcon className="w-4 h-4 text-neonGreen" />
              <span>ورزش: {sport}</span>
            </div>
          )}
          {date && (
            <div className="flex items-center gap-2 bg-glassDark rounded-xl px-4 py-2 border border-glass">
              <CalendarDaysIcon className="w-4 h-4 text-neonPurple" />
              <span>تاریخ: {date}</span>
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-slate-600 mb-2">نتیجه‌ای یافت نشد</h3>
          <p className="text-slate-500">لطفاً فیلترهای جستجو را تغییر دهید</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((a, index) => (
            <div key={a.id} className="animate-bounce-in" style={{animationDelay: `${index * 0.1}s`}}>
              <ArenaCard arena={a} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
