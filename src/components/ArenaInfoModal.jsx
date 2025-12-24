import React from 'react'
import { XMarkIcon, MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/solid'

export default function ArenaInfoModal({arena, open, onClose}){
  if(!open || !arena) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-50 animate-bounce-in border border-slate-200">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-800">اطلاعات {arena.name}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200">
            <XMarkIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        <div className="space-y-4 text-slate-700">
          <div className="flex items-start gap-3">
            <MapPinIcon className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <strong className="text-slate-800">آدرس:</strong> {arena.address}
            </div>
          </div>
          {arena.location && (
            <div className="flex items-center gap-3">
              <MapPinIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <a
                href={`https://www.google.com/maps?q=${arena.location.lat},${arena.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-modernBlue hover:text-sportBlue transition-colors duration-200 font-medium"
              >
                نمایش در نقشهٔ گوگل
              </a>
            </div>
          )}
          {arena.phone && (
            <div className="flex items-center gap-3">
              <PhoneIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <strong className="text-slate-800">تلفن:</strong>
                <a className="text-modernGreen hover:text-sportGreen transition-colors duration-200 font-medium mr-2" href={`tel:${arena.phone}`}>{arena.phone}</a>
              </div>
            </div>
          )}
          {arena.sportType && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-sportBlue rounded-full flex-shrink-0"></div>
              <div>
                <strong className="text-slate-800">نوع ورزش:</strong> <span className="text-sportBlue font-medium">{arena.sportType}</span>
              </div>
            </div>
          )}
          <div>
            <strong className="text-slate-800 block mb-2">امکانات:</strong>
            <ul className="list-disc mr-6 text-slate-600 space-y-1">
              {arena.amenities && arena.amenities.map((am,i)=>(
                <li key={i} className="text-sm">{am}</li>
              ))}
            </ul>
          </div>
          {arena.openingHours && (
            <div className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-slate-800">ساعات کاری:</strong> {arena.openingHours}
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 text-left">
          <button onClick={onClose} className="bg-gradient-to-r from-modernGreen to-sportGreen text-white py-3 px-6 rounded-xl hover:from-sportGreen hover:to-modernGreen transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
            باشه
          </button>
        </div>
      </div>
    </div>
  )
}
