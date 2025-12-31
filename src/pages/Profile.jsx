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
    <div className="space-y-8 animate-fade-in">
      <div className="bg-glass backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-glass animate-slide-up">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-neonPurple to-modernGreen bg-clip-text text-transparent mb-4">پروفایل</h2>
        <div className="bg-glassDark rounded-2xl p-6 border border-glass">
          <p className="text-slate-600 text-center">لطفاً ابتدا <a className="text-neonBlue hover:text-neonPurple transition-colors duration-200 font-medium" href="/login">وارد</a> شوید یا <a className="text-neonGreen hover:text-modernGreen transition-colors duration-200 font-medium" href="/signup">ثبت‌نام</a> کنید.</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-glass backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-glass animate-slide-up">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-modernBlue to-neonBlue bg-clip-text text-transparent mb-6">پروفایل</h2>
        <div className="bg-glassDark rounded-2xl p-6 border border-glass">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-neonBlue rounded-full animate-pulse-slow"></span>
            اطلاعات کاربر
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-neonGreen rounded-full animate-pulse-slow"></span>
              <span className="text-slate-600">نام:</span>
              <span className="font-semibold text-slate-800">{user.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-neonPurple rounded-full animate-pulse-slow"></span>
              <span className="text-slate-600">تلفن:</span>
              <span className="font-semibold text-slate-800">{user.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-glass backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-glass animate-slide-up" style={{animationDelay: '0.2s'}}>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-neonPurple to-modernGreen bg-clip-text text-transparent mb-6 flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-neonGreen rounded-full animate-pulse-slow"></span>
          رزروهای شما
        </h3>
        <div className="space-y-4">
          {reservations.length===0 && (
            <div className="bg-glassDark rounded-2xl p-6 border border-glass text-center">
              <p className="text-slate-500">تا کنون رزروی ثبت نشده است.</p>
            </div>
          )}
          <div className="text-sm text-slate-500 bg-glassDark rounded-xl p-4 border border-glass">
            <span className="inline-block w-2 h-2 bg-modernBlue rounded-full animate-pulse-slow mr-2"></span>
            مرتب‌شده بر اساس تاریخ و ساعت (صعودی)
          </div>
          {sortedReservations.map(r=> (
            <div key={r.id} className="bg-glassDark rounded-2xl p-6 border border-glass hover:border-neonBlue transition-all duration-200 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={(data.find(a=>a.id===r.arenaId) || {}).logo} alt="arena logo" className="w-10 h-10 rounded-xl object-cover shadow-md animate-float" />
                    <div className="font-bold text-lg text-slate-800">{(data.find(a=>a.id===r.arenaId) || {}).name}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-neonBlue rounded-full animate-pulse-slow"></span>
                      {r.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-neonGreen rounded-full animate-pulse-slow"></span>
                      {r.time}
                    </span>
                  </div>
                  {r.extraBall && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                      <span className="inline-block w-2 h-2 bg-neonPurple rounded-full animate-pulse-slow"></span>
                      اجاره توپ: {(r.extraFee || 0).toLocaleString('en-US')} تومان
                    </div>
                  )}
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-medium ${r.status==='confirmed' ? 'bg-gradient-to-r from-neonGreen to-modernGreen text-white shadow-lg' : 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg'}`}>
                  {r.status === 'confirmed' ? 'تأیید شده' : 'لغو شده'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
