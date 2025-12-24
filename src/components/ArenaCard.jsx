import React, {useState} from 'react'
import { Link } from 'react-router-dom'

import { formatPrice, isPriceHigh } from '../utils/format'
import ArenaInfoModal from './ArenaInfoModal'

export default function ArenaCard({arena}){
  const [showInfo, setShowInfo] = useState(false)
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
      <div className="h-40 bg-slate-200">
        <img src={arena.images[0]} alt={arena.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{arena.name}</h3>
        <p className="text-sm text-slate-500">{arena.address} • {arena.city}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-slate-700">{arena.sportType} • <span className="font-bold text-green-700">{formatPrice(arena.price)}</span></div>
          <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">⭐ {arena.rating}</div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link to={`/arena/${arena.id}`} className="flex-1 text-center bg-white border rounded py-2 hover:bg-slate-50 transition">مشاهده</Link>
          <button onClick={()=>setShowInfo(true)} className="flex-1 text-center border rounded py-2 hover:bg-slate-50 transition">اطلاعات سالن</button>
          <Link to={`/booking/${arena.id}`} className="flex-1 text-center bg-sportGreen text-white rounded py-2 hover:opacity-90 transition">مشاهده و رزرو</Link>
        </div>
      </div>
      <ArenaInfoModal arena={arena} open={showInfo} onClose={()=>setShowInfo(false)} />
    </div>
  )
}
