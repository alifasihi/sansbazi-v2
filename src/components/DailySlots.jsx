import React from 'react'

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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {slots.map((s, i) => {
        const bookingInfo = getBookingInfo(s.time)
        const endTime = getSlotEndTime(s.time)
        return (
          <div key={i} className={`p-3 rounded border flex flex-col items-start transition ${s.status==='free' ? 'hover:shadow-lg bg-white' : 'bg-slate-100 opacity-80'}`}>
            <div className="text-sm font-medium">{s.time}</div>
            {s.status === 'free' ? (
              <button onClick={()=>onSelect(s.time)} className={`mt-2 px-3 py-1 rounded text-sm ${selectedTime===s.time ? 'bg-sportBlue text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>انتخاب</button>
            ) : (
              <div className="mt-2 w-full">
                <div className="px-3 py-1 rounded text-sm bg-red-50 text-red-700 mb-1">رزرو شده</div>
                {bookingInfo && (
                  <div className="text-xs text-slate-500">
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
