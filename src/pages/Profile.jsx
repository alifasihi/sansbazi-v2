import React from 'react'
import data from '../data/arenas.json'
import { getCurrentUser } from '../utils/auth'
import { getAllReservations } from '../utils/reservations'

export default function Profile(){
  const user = getCurrentUser()
  const all = getAllReservations()
  const reservations = user ? all.filter(r => r.userId === user.id) : []
  // sort by date then start time (earliest first)
  const sortedReservations = reservations.slice().sort((a,b)=>{
    try{
      const aStart = (a.time || '').split('-')[0].trim().split(' ')[0]
      const bStart = (b.time || '').split('-')[0].trim().split(' ')[0]
      const aDt = new Date(a.date + 'T' + (aStart || '00:00') + ':00')
      const bDt = new Date(b.date + 'T' + (bStart || '00:00') + ':00')
      return aDt - bDt
    }catch(e){ return 0 }
  })

  if(!user) return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">پروفایل</h2>
      <div className="bg-white p-4 rounded shadow">لطفاً ابتدا <a className="text-sportGreen" href="/login">وارد</a> شوید یا <a className="text-sportGreen" href="/signup">ثبت‌نام</a> کنید.</div>
    </div>
  )

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">پروفایل</h2>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">اطلاعات کاربر</h3>
        <p className="text-sm text-slate-600 mt-2">نام: {user.name}</p>
        <p className="text-sm text-slate-600">تلفن: {user.phone}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">رزروهای شما</h3>
        <ul className="mt-3 space-y-2">
          {reservations.length===0 && <div className="text-sm text-slate-500">تا کنون رزروی ثبت نشده است.</div>}
          <div className="text-xs text-slate-400 mb-2">مرتب‌شده بر اساس تاریخ و ساعت (صعودی)</div>
          {sortedReservations.map(r=> (
            <li key={r.id} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">{(data.find(a=>a.id===r.arenaId) || {}).name}</div>
                <div className="text-sm text-slate-600">{r.date} • {r.time}</div>
                {r.extraBall && <div className="text-xs text-slate-500 mt-1">اجاره توپ: {r.extraFee} تومان</div>}
              </div>
              <div className={`px-3 py-1 rounded text-sm ${r.status==='confirmed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{r.status}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
