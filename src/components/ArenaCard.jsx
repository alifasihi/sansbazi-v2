import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import ArenaInfoModal from './ArenaInfoModal';
import { StarIcon, MapPinIcon, ClockIcon, PhoneIcon } from '@heroicons/react/24/solid';

export default function ArenaCard({ arena }) {
  const [showInfo, setShowInfo] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // انتخاب تصویر اصلی (تصادفی اما ثابت بر اساس id)
  const getMainImage = () => {
    if (!arena.images || arena.images.length === 0) return '';
    if (arena.images.length === 1) return arena.images[0];

    const hash = arena.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return arena.images[hash % arena.images.length];
  };

  const mainImage = getMainImage();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-3 hover:scale-105 border border-glass hover:border-neonBlue/30">
      {/* بخش تصویر اصلی */}
      <div className="relative h-48 overflow-hidden">
        {mainImage && (
          <img
            src={mainImage}
            alt={arena.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        )}

        {/* تصاویر کوچک (thumbnail) */}
        {arena.images && arena.images.length > 1 && (
          <div className="absolute left-2 top-2 flex gap-2 z-10">
            {arena.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`تصویر ${i + 1} ${arena.name}`}
                onClick={() => {
                  setModalImage(img);
                  setShowImageModal(true);
                }}
                className="w-12 h-12 object-cover rounded-lg border border-glass shadow bg-white/80 hover:scale-110 transition-transform duration-200 cursor-pointer"
                style={{ animationDelay: `${i * 0.07}s` }}
              />
            ))}
          </div>
        )}

        {/* امتیاز */}
        <div className="absolute top-3 right-3 bg-glass backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 border border-white/20">
          <StarIcon className="w-4 h-4 text-yellow-400 animate-pulse-slow" />
          <span className="text-sm font-semibold text-slate-800">{arena.rating.toFixed(1)}</span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* بخش محتوا */}
      <div className="p-6 space-y-4">
        {/* آدرس */}
        <div className="flex items-center gap-2 text-sm text-slate-600 justify-center">
          <MapPinIcon className="w-4 h-4 text-neonBlue" />
          <span>{arena.address} • {arena.city}</span>
        </div>

        {/* نوع ورزش و قیمت */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-sportGreen" />
            <span className="text-sm text-slate-700">{arena.sportTypeFa || arena.sportType}</span>
          </div>
          <div className="text-lg font-bold text-modernGreen">{formatPrice(arena.pricePerSlot || arena.price)}</div>
        </div>

        {/* تلفن */}
        {arena.phone && (
          <div className="flex items-center gap-2 text-sm text-slate-600 justify-center">
            <PhoneIcon className="w-4 h-4 text-neonGreen" />
            <a href={`tel:${arena.phone}`} className="hover:text-neonBlue transition-colors">
              {arena.phone}
            </a>
          </div>
        )}

        {/* ساعات کاری */}
        {arena.openingHours && (
          <div className="flex items-center gap-2 text-sm text-slate-600 justify-center">
            <span className="font-bold text-neonPurple">ساعات کاری:</span>
            <span>
              {arena.openingHours.start} تا {arena.openingHours.end}
            </span>
          </div>
        )}

        {/* امکانات */}
        {arena.amenities && arena.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {arena.amenities.map((amenity, i) => (
              <span
                key={i}
                className="bg-glassDark border border-glass rounded-xl px-3 py-1 text-xs text-slate-700"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* سانس‌های امروز */}
        {arena.slots && arena.slots.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-slate-500 text-center">سانس‌های امروز:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {arena.slots.map((slot, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    slot.status === 'free'
                      ? 'bg-green-50 text-modernGreen border-modernGreen'
                      : 'bg-red-50 text-red-600 border-red-300'
                  }`}
                >
                  {slot.startTime} - {slot.endTime} {slot.status === 'free' ? 'آزاد' : 'رزرو شده'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* دکمه‌های اقدام */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <Link
            to={`/arena/${arena.id}`}
            className="text-center bg-glass backdrop-blur-sm border border-glass rounded-xl py-3 hover:bg-glassDark hover:border-neonBlue/50 transition-all duration-300 font-medium text-slate-700 hover:text-neonBlue transform hover:scale-105"
          >
            مشاهده
          </Link>

          <button
            onClick={() => setShowInfo(true)}
            className="text-center bg-glass backdrop-blur-sm border border-glass rounded-xl py-3 hover:bg-glassDark hover:border-neonPurple/50 transition-all duration-300 font-medium text-slate-700 hover:text-neonPurple transform hover:scale-105"
          >
            اطلاعات سالن
          </button>

          <Link
            to={`/booking/${arena.id}`}
            className="text-center bg-gradient-to-r from-modernGreen to-sportGreen text-white rounded-xl py-3 hover:from-neonGreen hover:to-modernGreen transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            رزرو
          </Link>
        </div>
      </div>

      {/* مودال اطلاعات سالن */}
      <ArenaInfoModal arena={arena} open={showInfo} onClose={() => setShowInfo(false)} />

      {/* مودال تصویر بزرگ */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 max-w-3xl w-full flex flex-col items-center">
            <img
              src={modalImage}
              alt="تصویر بزرگ سالن"
              className="max-h-[75vh] w-auto rounded-2xl shadow-lg"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="mt-6 bg-gradient-to-r from-modernGreen to-neonGreen text-white py-3 px-10 rounded-xl hover:from-neonGreen hover:to-modernGreen transition-all duration-300 font-medium shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
