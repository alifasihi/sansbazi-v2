import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, isPriceHigh } from '../utils/format'
import ArenaInfoModal from './ArenaInfoModal'
import { StarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid'

export default function ArenaCard({arena}){
  const [showInfo, setShowInfo] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState(null)
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-3 hover:scale-105 animate-fade-in border border-glass hover:border-neonBlue/30">
      <div className="relative h-48 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 overflow-hidden">
        {/* ردیف تصاویر بندانگشتی سالن */}
        {arena.images && arena.images.length > 1 && (
          <div className="absolute left-2 top-2 flex gap-2 z-10">
            {arena.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`تصویر ${i+1} ${arena.name}`}
                className="w-12 h-12 object-cover rounded-lg border border-glass shadow bg-white/80 hover:scale-110 transition-transform duration-200 cursor-pointer"
                style={{animationDelay: `${i * 0.07}s`}}
                onClick={e => { setModalImage(img); setShowImageModal(true); }}
              />
            ))}
          </div>
        )}
        {/* انتخاب تصادفی یک عکس از تصاویر سالن برای هر کارت */}
        {(() => {
          let imgSrc = arena.images && arena.images.length > 0 ? arena.images[0] : '';
          if (arena.images && arena.images.length > 1) {
            // انتخاب تصادفی اما ثابت برای هر کارت بر اساس id سالن
            const hash = Array.from(arena.id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
            imgSrc = arena.images[hash % arena.images.length];
          }
          return (
            <img src={imgSrc} alt={arena.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
          );
        })()}
        <div className="absolute top-3 right-3 bg-glass backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 border border-white/20">
          <StarIcon className="w-4 h-4 text-yellow-400 animate-pulse-slow" />
          <span className="text-sm font-semibold text-slate-800">{arena.rating}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <img src={arena.logo} alt={`${arena.name} logo`} className="w-20 h-20 rounded-xl object-cover shadow-lg border-2 border-white animate-float hover:animate-glow" />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3 justify-center">
          <MapPinIcon className="w-4 h-4 text-neonBlue" />
          <span>{arena.address} • {arena.city}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-sportGreen" />
            <span className="text-sm text-slate-700">{arena.sportType}</span>
          </div>
          <div className="text-lg font-bold text-modernGreen">{formatPrice(arena.price)}</div>
        </div>

        {/* شماره تماس */}
        {arena.phone && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2 justify-center">
            <span className="font-bold text-neonGreen">تلفن:</span>
            <a href={`tel:${arena.phone}`} className="hover:text-neonBlue transition-colors">{arena.phone}</a>
          </div>
        )}

        {/* ساعات کاری */}
        {arena.openingHours && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2 justify-center">
            <span className="font-bold text-neonPurple">ساعات کاری:</span>
            <span>{arena.openingHours}</span>
          </div>
        )}

        {/* امکانات */}
        {arena.amenities && arena.amenities.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2 justify-center">
            {arena.amenities.map((am, i) => (
              <span key={i} className="bg-glassDark border border-glass rounded-xl px-3 py-1 text-xs text-slate-700 animate-fade-in">{am}</span>
            ))}
          </div>
        )}

        {/* نمایش اسلات‌ها */}
        {arena.slots && arena.slots.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-slate-500 mb-1 text-center">سانس‌های امروز:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {arena.slots.map((slot, i) => (
                <span key={i} className={`px-2 py-1 rounded-lg text-xs font-medium border ${slot.status === 'free' ? 'bg-green-50 text-modernGreen border-modernGreen' : 'bg-red-50 text-red-600 border-red-300'}`}>{slot.time} {slot.status === 'free' ? 'آزاد' : 'رزرو'}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link to={`/arena/${arena.id}`} className="flex-1 text-center bg-glass backdrop-blur-sm border border-glass rounded-xl py-3 hover:bg-glassDark hover:border-neonBlue/50 transition-all duration-300 font-medium text-slate-700 hover:text-neonBlue transform hover:scale-105">
            مشاهده
          </Link>
          <button onClick={()=>setShowInfo(true)} className="flex-1 text-center bg-glass backdrop-blur-sm border border-glass rounded-xl py-3 hover:bg-glassDark hover:border-neonPurple/50 transition-all duration-300 font-medium text-blue-700 hover:text-neonPurple transform hover:scale-105">
            اطلاعات سالن
          </button>
          <Link to={`/booking/${arena.id}`} className="flex-1 text-center bg-gradient-to-r from-modernGreen to-sportGreen text-white rounded-xl py-3 hover:from-neonGreen hover:to-modernGreen transition-all duration-300 font-medium shadow-lg hover:shadow-xl animate-glow transform hover:scale-105">
            رزرو
          </Link>
        </div>
      </div>
      <ArenaInfoModal arena={arena} open={showInfo} onClose={()=>setShowInfo(false)} />

      {/* Modal نمایش تصویر بزرگ */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setShowImageModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-4 max-w-2xl w-full flex flex-col items-center animate-bounce-in border border-glass">
            <img src={modalImage} alt="تصویر سالن" className="max-h-[70vh] w-auto rounded-2xl shadow-lg mb-4" />
            <button onClick={()=>setShowImageModal(false)} className="bg-gradient-to-r from-modernGreen to-neonGreen text-white py-2 px-8 rounded-xl hover:from-neonGreen hover:to-modernGreen transition-all duration-300 font-medium shadow-xl hover:shadow-2xl animate-glow transform hover:scale-105">
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
