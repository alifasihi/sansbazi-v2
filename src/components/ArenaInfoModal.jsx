import React from "react";
import { XMarkIcon, StarIcon, MapPinIcon, PhoneIcon, ClockIcon } from "@heroicons/react/24/solid";
import { formatPrice } from "../utils/format";

export default function ArenaInfoModal({ arena, open, onClose }) {
  if (!open || !arena) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <XMarkIcon className="w-8 h-8 text-slate-700" />
        </button>

        {/* هدر مودال */}
        <div className="p-8 md:p-12 text-center">
          <img
            src={arena.logo || "https://via.placeholder.com/150?text=لوگو"}
            alt={arena.name}
            className="w-32 h-32 mx-auto rounded-3xl object-cover shadow-2xl mb-6 ring-4 ring-neonBlue/30"
          />
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
            {arena.name}
          </h2>
          <p className="text-xl text-neonBlue font-bold mb-6">
            {arena.sportTypeFa || arena.sportType}
          </p>

          {/* امتیاز */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <StarIcon className="w-8 h-8 text-yellow-500 animate-pulse" />
            <span className="text-2xl font-extrabold text-slate-800">
              {arena.rating?.toFixed(1) || "—"}
            </span>
            {arena.reviewCount && (
              <span className="text-lg text-slate-600">
                ({arena.reviewCount} نظر)
              </span>
            )}
          </div>
        </div>

        {/* اطلاعات اصلی */}
        <div className="px-8 pb-12 space-y-6 text-lg">
          {/* آدرس */}
          <div className="flex items-center gap-4 justify-center text-slate-700">
            <MapPinIcon className="w-7 h-7 text-neonBlue flex-shrink-0" />
            <span>
              {arena.address}، {arena.city}
            </span>
          </div>

          {/* تلفن */}
          {arena.phone && (
            <div className="flex items-center gap-4 justify-center text-slate-700">
              <PhoneIcon className="w-7 h-7 text-neonGreen flex-shrink-0" />
              <a href={`tel:${arena.phone}`} className="hover:text-neonBlue transition-colors font-medium">
                {arena.phone}
              </a>
            </div>
          )}

          {/* ساعات کاری */}
          {arena.openingHours && (
            <div className="flex items-center gap-4 justify-center text-slate-700">
              <ClockIcon className="w-7 h-7 text-neonPurple flex-shrink-0" />
              <span>
                {arena.openingHours.start} تا {arena.openingHours.end}
              </span>
            </div>
          )}

          {/* قیمت */}
          <div className="text-center py-6 bg-glass/60 rounded-3xl border border-glass">
            <p className="text-sm text-slate-600 mb-2">قیمت هر سانس</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-modernGreen to-neonGreen bg-clip-text text-transparent">
              {formatPrice(arena.pricePerSlot || arena.price)}
            </p>
          </div>

          {/* امکانات */}
          {arena.amenities && arena.amenities.length > 0 && (
            <div className="text-center">
              <p className="font-bold text-slate-800 mb-4 text-xl">امکانات سالن</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {arena.amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="px-6 py-3 bg-glass/70 border border-glass rounded-2xl text-slate-700 font-medium shadow-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* توضیحات */}
          {arena.description && (
            <div className="text-center">
              <p className="font-bold text-slate-800 mb-4 text-xl">درباره سالن</p>
              <p className="text-slate-600 leading-relaxed text-base md:text-lg px-4">
                {arena.description}
              </p>
            </div>
          )}

          {/* دکمه رزرو در مودال */}
          <div className="text-center mt-10">
            <Link
              to={`/booking/${arena.id}`}
              onClick={onClose}
              className="inline-block px-12 py-6 rounded-2xl bg-gradient-to-r from-modernGreen via-sportGreen to-neonGreen text-white text-2xl font-extrabold shadow-2xl hover:shadow-neonGreen/60 transition-all duration-500 hover:scale-110"
            >
              رزرو سانس
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
