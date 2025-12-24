import React from 'react'

export default function ArenaInfoModal({arena, open, onClose}){
  if(!open || !arena) return null
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded shadow-lg w-full max-w-lg p-5 z-50">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">اطلاعات {arena.name}</h3>
          <button onClick={onClose} className="text-slate-500">بستن</button>
        </div>
        <div className="mt-3 space-y-3 text-sm text-slate-700">
          <div><strong>آدرس:</strong> {arena.address}</div>
          {arena.location && (
            <div>
              <a
                href={`https://www.google.com/maps?q=${arena.location.lat},${arena.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sportBlue hover:underline"
              >
                📍 نمایش در نقشهٔ گوگل
              </a>
            </div>
          )}
          {arena.phone && <div><strong>تلفن:</strong> <a className="text-sportBlue" href={`tel:${arena.phone}`}>{arena.phone}</a></div>}
          {arena.sportType && <div><strong>نوع ورزش:</strong> {arena.sportType}</div>}
          <div>
            <strong>امکانات:</strong>
            <ul className="list-disc mr-5 mt-1 text-slate-600">
              {arena.amenities && arena.amenities.map((am,i)=>(<li key={i}>{am}</li>))}
            </ul>
          </div>
          {arena.openingHours && <div><strong>ساعات کاری:</strong> {arena.openingHours}</div>}
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="bg-sportGreen text-white py-2 px-3 rounded">باشه</button>
        </div>
      </div>
    </div>
  )
}
