import { useParams, Link } from 'react-router-dom'
import data from '../data/arenas.json'
import Gallery from '../components/Gallery'
import ScheduleTable from '../components/ScheduleTable'
import ArenaInfoModal from '../components/ArenaInfoModal'
import React, { useState } from 'react'
import { StarIcon, MapPinIcon, ClockIcon, CheckCircleIcon, PhoneIcon } from '@heroicons/react/24/solid'

export default function Details(){
  const { id } = useParams()
  const arena = data.find(a=>a.id===id)
  if(!arena) return (
    <div className="text-center py-12 animate-fade-in">
      <div className="text-6xl mb-4">🏟️</div>
      <h3 className="text-2xl font-bold text-slate-600 mb-2">سالن پیدا نشد</h3>
      <p className="text-slate-500">سالن مورد نظر وجود ندارد</p>
    </div>
  )
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-glass backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-glass animate-slide-up">
            <div className="flex items-center gap-4 mb-4">
              <img src={arena.logo} alt={`${arena.name} logo`} className="w-16 h-16 rounded-2xl object-cover shadow-lg animate-float" />
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-modernBlue to-neonBlue bg-clip-text text-transparent">{arena.name}</h2>
                <div className="flex items-center gap-2 text-slate-600 mt-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{arena.address} • {arena.city}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 bg-glassDark rounded-xl px-3 py-1 border border-glass">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold">{arena.rating}</span>
              </div>
              <div className="flex items-center gap-1 bg-glassDark rounded-xl px-3 py-1 border border-glass">
                <ClockIcon className="w-4 h-4 text-neonGreen" />
                <span>{arena.sportType}</span>
              </div>
              {arena.phone && (
                <div className="flex items-center gap-1 bg-glassDark rounded-xl px-3 py-1 border border-glass">
                  <PhoneIcon className="w-4 h-4 text-neonBlue" />
                  <a href={`tel:${arena.phone}`} className="hover:text-neonBlue transition-colors">{arena.phone}</a>
                </div>
              )}
            </div>
          </div>

          <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Gallery images={arena.images} />
          </div>

          <div className="bg-glass backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-glass animate-slide-up" style={{animationDelay: '0.4s'}}>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-neonPurple to-modernGreen bg-clip-text text-transparent">توضیحات و امکانات</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">یک سالن مدرن با امکانات مناسب برای بازی و تمرین، محیطی حرفه‌ای و راحت برای ورزشکاران.</p>
            <h4 className="text-xl font-semibold mb-4 text-slate-800">امکانات سالن</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {arena.amenities.map((am,i)=> (
                <div key={i} className="flex items-center gap-3 bg-glassDark rounded-xl p-3 border border-glass">
                  <CheckCircleIcon className="w-5 h-5 text-neonGreen flex-shrink-0" />
                  <span className="text-slate-700">{am}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-glass backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-glass animate-slide-up" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-slate-800">قیمت هر سانس</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-modernGreen to-neonGreen bg-clip-text text-transparent">{arena.price ? (arena.price.toLocaleString('en-US') + ' تومان') : ''}</div>
            </div>
            <div className="flex items-center gap-2 mb-6 bg-glassDark rounded-xl p-3 border border-glass">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">امتیاز: {arena.rating}</span>
            </div>
            <div className="space-y-3">
              <Link to={`/booking/${arena.id}`} className="block text-center bg-gradient-to-r from-modernGreen to-neonGreen text-white py-4 rounded-2xl hover:from-neonGreen hover:to-modernGreen transition-all duration-300 font-bold shadow-lg hover:shadow-xl animate-glow transform hover:scale-105">
                رزرو سانس
              </Link>
              <button onClick={()=>setShowInfo(true)} className="block w-full text-center bg-glass backdrop-blur-sm border border-glass rounded-2xl py-4 hover:bg-glassDark transition-all duration-300 font-medium text-slate-700 hover:text-neonBlue transform hover:scale-105">
                اطلاعات سالن
              </button>
            </div>
          </div>

          <div className="bg-glass backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-glass animate-slide-up" style={{animationDelay: '0.8s'}}>
            <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-neonBlue to-modernBlue bg-clip-text text-transparent">جدول سانس‌ها</h4>
            <ScheduleTable slots={arena.slots} />
          </div>
        </aside>
      </div>
      <ArenaInfoModal arena={arena} open={showInfo} onClose={()=>setShowInfo(false)} />
    </div>
  )
}
