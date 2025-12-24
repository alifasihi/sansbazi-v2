import { useParams, Link } from 'react-router-dom'
import data from '../data/arenas.json'
import Gallery from '../components/Gallery'
import ScheduleTable from '../components/ScheduleTable'
import ArenaInfoModal from '../components/ArenaInfoModal'
import React, { useState } from 'react'

export default function Details(){
  const { id } = useParams()
  const arena = data.find(a=>a.id===id)
  if(!arena) return <div>سالن پیدا نشد</div>
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">{arena.name}</h2>
          <p className="text-sm text-slate-600">{arena.address} • {arena.city}</p>
          <Gallery images={arena.images} />
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">توضیحات</h3>
            <p className="text-sm text-slate-600 mt-2">یک سالن مدرن با امکانات مناسب برای بازی و تمرین.</p>
            <h4 className="mt-3 font-semibold">امکانات</h4>
            <ul className="list-disc mr-5 mt-2 text-sm text-slate-600">
              {arena.amenities.map((am,i)=> <li key={i}>{am}</li>)}
            </ul>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
                <div className="font-bold">قیمت هر سانس</div>
                <div className="font-semibold text-green-700">{arena.price ? (arena.price.toLocaleString('en-US') + ' تومان') : ''}</div>
              </div>
            <div className="mt-3">امتیاز: ⭐ {arena.rating}</div>
            <div className="mt-4 space-y-2">
              <Link to={`/booking/${arena.id}`} className="block text-center bg-sportGreen text-white py-2 rounded">رزرو</Link>
              <button onClick={()=>setShowInfo(true)} className="block w-full text-center border rounded py-2">اطلاعات سالن</button>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">جدول سانس‌ها</h4>
            <ScheduleTable slots={arena.slots} />
          </div>
        </aside>
      </div>
      <ArenaInfoModal arena={arena} open={showInfo} onClose={()=>setShowInfo(false)} />
    </div>
  )
}
