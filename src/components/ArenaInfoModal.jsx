import React from 'react'
import { XMarkIcon, MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/solid'

export default function ArenaInfoModal({arena, open, onClose}){
  if(!open || !arena) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-glass backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg p-8 z-50 animate-bounce-in border border-glass">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={arena.logo} alt={`${arena.name} logo`} className="w-12 h-12 rounded-2xl object-cover shadow-lg animate-float" />
            <h3 className="text-2xl font-bold bg-gradient-to-r from-modernBlue to-neonBlue bg-clip-text text-transparent">اطلاعات {arena.name}</h3>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl hover:bg-glassDark transition-all duration-200 border border-glass hover:border-neonBlue">
            <XMarkIcon className="w-6 h-6 text-slate-500 hover:text-neonBlue transition-colors duration-200" />
          </button>
        </div>
        <div className="space-y-6 text-slate-700">
          <div className="flex items-start gap-4 bg-glassDark rounded-2xl p-4 border border-glass">
            <MapPinIcon className="w-6 h-6 text-red-500 mt-1 flex-shrink-0 animate-pulse-slow" />
            <div>
              <strong className="text-slate-800 block mb-1">آدرس</strong>
              <span className="text-slate-600">{arena.address}</span>
            </div>
          </div>
          {arena.location && (
            <div className="flex items-center gap-4 bg-glassDark rounded-2xl p-4 border border-glass">
              <MapPinIcon className="w-6 h-6 text-blue-500 flex-shrink-0 animate-pulse-slow" />
              <a
                href={`https://www.google.com/maps?q=${arena.location.lat},${arena.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neonBlue hover:text-modernBlue transition-colors duration-200 font-medium hover:underline"
              >
                نمایش در نقشهٔ گوگل
              </a>
            </div>
          )}
          {arena.phone && (
            <div className="flex items-center gap-4 bg-glassDark rounded-2xl p-4 border border-glass">
              <PhoneIcon className="w-6 h-6 text-green-500 flex-shrink-0 animate-pulse-slow" />
              <div>
                <strong className="text-slate-800 block mb-1">تلفن</strong>
                <a className="text-neonGreen hover:text-modernGreen transition-colors duration-200 font-medium hover:underline" href={`tel:${arena.phone}`}>{arena.phone}</a>
              </div>
            </div>
          )}
          {arena.sportType && (
            <div className="flex items-center gap-4 bg-glassDark rounded-2xl p-4 border border-glass">
              <div className="w-6 h-6 bg-neonBlue rounded-full flex-shrink-0 animate-pulse-slow"></div>
              <div>
                <strong className="text-slate-800 block mb-1">نوع ورزش</strong>
                <span className="text-neonBlue font-medium">{arena.sportType}</span>
              </div>
            </div>
          )}
          <div className="bg-glassDark rounded-2xl p-4 border border-glass">
            <strong className="text-slate-800 block mb-3 flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-neonPurple rounded-full animate-pulse-slow"></span>
              امکانات
            </strong>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {arena.amenities && arena.amenities.map((am,i)=>(
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="inline-block w-2 h-2 bg-neonGreen rounded-full animate-pulse-slow"></span>
                  {am}
                </li>
              ))}
            </ul>
          </div>
          {arena.openingHours && (
            <div className="flex items-start gap-4 bg-glassDark rounded-2xl p-4 border border-glass">
              <ClockIcon className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0 animate-pulse-slow" />
              <div>
                <strong className="text-slate-800 block mb-1">ساعات کاری</strong>
                <span className="text-slate-600">{arena.openingHours}</span>
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 text-left">
          <button onClick={onClose} className="bg-gradient-to-r from-modernGreen to-neonGreen text-white py-4 px-8 rounded-2xl hover:from-neonGreen hover:to-modernGreen transition-all duration-300 font-medium shadow-xl hover:shadow-2xl animate-glow transform hover:scale-105">
            باشه
          </button>
        </div>
      </div>
    </div>
  )
}
