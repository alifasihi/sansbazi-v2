import React from 'react'
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'

export default function DailySlots({ slots = [], onSelect = () => {}, selectedTime, reservations = [] }){
  // Find reservation details for a booked slot
  function getBookingInfo(slotTime){
    const reservation = reservations.find(r => r.time === slotTime)
    if(!reservation) return null
    return reservation
  }

  function formatJalaliDate(dateISO){
    try {
      const d = new Date(dateISO + 'T00:00:00')
      return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {year:'numeric', month:'2-digit', day:'2-digit'}).format(d)
    } catch(e) {
      return dateISO
    }
  }

  function getSlotEndTime(timeString){
    // Extract end time from "09:00 - 10:30" format
    if(!timeString) return ''
    const parts = timeString.split('-')
    return parts.length > 1 ? parts[1].trim() : ''
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {slots.map((s, i) => {
        const bookingInfo = getBookingInfo(s.time)
        const endTime = getSlotEndTime(s.time)
        return (
          <div key={i} className={`p-4 rounded-2xl border-2 flex flex-col items-start transition-all duration-300 transform hover:scale-105 animate-fade-in ${s.status==='free' ? 'hover:shadow-xl bg-white border-slate-200 hover:border-modernBlue' : 'bg-gradient-to-br from-slate-100 to-slate-200 opacity-80 border-slate-300'}`} style={{animationDelay: `${i * 0.05}s`}}>
            <div className="flex items-center gap-2 mb-3">
              <ClockIcon className="w-5 h-5 text-slate-600" />
              <div className="text-base font-semibold text-slate-800">{s.time}</div>
            </div>
            {s.status === 'free' ? (
              <button onClick={()=>onSelect(s.time)} className={`w-full mt-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${selectedTime===s.time ? 'bg-gradient-to-r from-modernBlue to-sportBlue text-white' : 'bg-gradient-to-r from-green-50 to-green-100 text-modernGreen hover:from-green-100 hover:to-green-200 border border-modernGreen'}`}>
                <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                انتخاب
              </button>
            ) : (
              <div className="w-full mt-2">
                <div className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-red-50 to-red-100 text-red-700 mb-2 border border-red-200 font-medium">
                  <XCircleIcon className="w-4 h-4 inline mr-1" />
                  رزرو شده
                </div>
                {bookingInfo && (
                  <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">
                    تا {formatJalaliDate(bookingInfo.date)}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
