import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, isPriceHigh } from '../utils/format'
import ArenaInfoModal from './ArenaInfoModal'
import { StarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid'

export default function ArenaCard({arena}){
  const [showInfo, setShowInfo] = useState(false)
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 hover:scale-105 animate-fade-in">
      <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
        <img src={arena.images[0]} alt={arena.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-3 py-1 flex items-center gap-1">
          <StarIcon className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-semibold text-slate-800">{arena.rating}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <img src={arena.logo} alt={`${arena.name} logo`} className="w-20 h-20 rounded-xl object-cover shadow-lg border-2 border-white" />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3 justify-center">
          <MapPinIcon className="w-4 h-4" />
          <span>{arena.address} • {arena.city}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-sportGreen" />
            <span className="text-sm text-slate-700">{arena.sportType}</span>
          </div>
          <div className="text-lg font-bold text-modernGreen">{formatPrice(arena.price)}</div>
        </div>
        <div className="flex gap-3">
          <Link to={`/arena/${arena.id}`} className="flex-1 text-center bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 rounded-xl py-3 hover:from-slate-200 hover:to-slate-300 transition-all duration-200 font-medium text-slate-700 hover:text-slate-900">
            مشاهده
          </Link>
          <button onClick={()=>setShowInfo(true)} className="flex-1 text-center bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl py-3 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 font-medium text-blue-700 hover:text-blue-900">
            اطلاعات سالن
          </button>
          <Link to={`/booking/${arena.id}`} className="flex-1 text-center bg-gradient-to-r from-modernGreen to-sportGreen text-white rounded-xl py-3 hover:from-sportGreen hover:to-modernGreen transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
            رزرو
          </Link>
        </div>
      </div>
      <ArenaInfoModal arena={arena} open={showInfo} onClose={()=>setShowInfo(false)} />
    </div>
  )
}
