import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import data from '../data/arenas.json'
import BookingForm from '../components/BookingForm'
import DailySlots from '../components/DailySlots'
import WeekDaysBar from '../components/WeekDaysBar'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { generateSlots, markBookedSlots } from '../utils/slots'
import { getAllReservations } from '../utils/reservations'
import { getReservationsForArenaDate } from '../utils/reservations'

export default function Booking(){
  const { id } = useParams()
  const arena = data.find(a=>a.id===id)
  if(!arena) return <div>سالن پیدا نشد</div>
  // default to today's date (normalized to midnight) when opening the booking page
  const today = new Date()
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const [selectedDate, setSelectedDate] = useState(normalizedToday)
  const [selectedTime, setSelectedTime] = useState('')
  const [showCustomDate, setShowCustomDate] = useState(false)
  const [futureOptions, setFutureOptions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalFutureOptions, setModalFutureOptions] = useState([])
  const [modalBall, setModalBall] = useState(false)
  const [ballRental, setBallRental] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const slots = useMemo(()=> generateSlots(90), [])

  const bookedForSelectedDate = useMemo(()=>{
    if(!selectedDate) return []
    const iso = (selectedDate.format ? selectedDate.toDate().toISOString().slice(0,10) : selectedDate.toISOString().slice(0,10))
    const res = getReservationsForArenaDate(arena.id, iso)
    return res.map(r=>r.time)
  },[selectedDate, arena, refreshKey])

  const displayedSlots = useMemo(()=> markBookedSlots(slots, bookedForSelectedDate), [slots, bookedForSelectedDate])
  
  // Future weekly suggestions for the selected time (next N weeks)

  function toDate(d){
    if(!d) return null
    if(d.format) return d.toDate()
    if(d instanceof Date) return d
    return new Date(d)
  }

  function formatJalali(d){
    const dateObj = toDate(d)
    if(!dateObj) return ''
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'2-digit',day:'2-digit',weekday:'short'}).format(dateObj)
  }

  function computeFutureOptions(baseDate, time){
    if(!baseDate || !time) return []
    const base = toDate(baseDate)
    if(!base) return []
    const options = []
    const maxDate = new Date(2026,2,19)
    for(let w=1; w<=12; w++){
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + 7*w)
      if(d > maxDate) break
      const iso = d.toISOString().slice(0,10)
      const exists = getReservationsForArenaDate(arena.id, iso).some(r => r.time === time)
      options.push({ date: d, iso, available: !exists, selected: false })
    }
    return options
  }

  React.useEffect(()=>{
    // recompute inline future options when selectedDate, selectedTime or refreshKey changes
    if(!selectedDate || !selectedTime) { setFutureOptions([]); return }
    setFutureOptions(computeFutureOptions(selectedDate, selectedTime))
  },[selectedDate, selectedTime, refreshKey, arena])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold">رزرو {arena.name}</h2>
        <p className="text-sm text-slate-600">{arena.address}</p>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">انتخاب تاریخ (از امروز تا یک هفته)</h4>
            <div>
              <button onClick={()=>setShowCustomDate(s=>!s)} className="text-sm text-sportBlue hover:underline">تاریخ دلخواه (از ۷ روز آینده)</button>
            </div>
          </div>

          {showCustomDate && (
            <div className="mt-3">
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={selectedDate}
                onChange={(d)=>{
                  // d may be DateObject from picker
                  setSelectedDate(d)
                  setSelectedTime('')
                }}
                format="YYYY/MM/DD"
                minDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+7)}
                maxDate={new Date(2026,2,19)}
                className="p-2 border rounded"
              />
              <div className="text-xs text-slate-400 mt-1">حداقل تاریخ: ۷ روز پس از امروز — حداکثر: 29/12/1404</div>
            </div>
          )}

          <div className="mt-4">
            <WeekDaysBar selectedDate={selectedDate} onSelect={(d)=>{ setSelectedDate(d); setSelectedTime('') }} />
            <div className="mt-4">
              <h4 className="font-semibold mb-2">سانس‌ها برای {selectedDate ? (selectedDate.format ? selectedDate.format('YYYY/MM/DD') : new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'2-digit',day:'2-digit'}).format(selectedDate)) : '---'}</h4>
              <DailySlots slots={displayedSlots} onSelect={(t)=>{
                // ensure we have a base date; if none, default to today
                let base = selectedDate
                if(!base){
                  base = new Date()
                  setSelectedDate(base)
                }
                setSelectedTime(t)
                const opts = computeFutureOptions(base, t)
                setModalFutureOptions(opts)
                setModalBall(false)
                setShowModal(true)
              }} selectedTime={selectedTime} reservations={(() => {
                const iso = (selectedDate.format ? selectedDate.toDate().toISOString().slice(0,10) : selectedDate.toISOString().slice(0,10))
                const allRes = getAllReservations()
                return allRes.filter(r => r.date === iso && r.arenaId === arena.id)
              })()} />
              {selectedTime && (
                <div className="mt-4 bg-slate-50 p-3 rounded">
                  <h4 className="font-semibold mb-2">پیشنهاد برای هفته‌های بعد (همان روز و ساعت)</h4>
                  <div className="mb-2">
                    <button onClick={()=>{
                      // open modal seeded with current future options and ball state
                      setModalFutureOptions(futureOptions.map(f => ({ ...f })))
                      setModalBall(ballRental)
                      setShowModal(true)
                    }} className="text-sm text-sportBlue hover:underline">پیکربندی پیشرفته (انتخاب توپ و هفته‌ها)</button>
                  </div>
                  <div className="grid gap-2">
                    {futureOptions.length===0 && <div className="text-sm text-slate-500">هیچ پیشنهادی موجود نیست.</div>}
                    {futureOptions.map((opt, idx)=> (
                      <label key={idx} className={`flex items-center justify-between p-2 rounded ${opt.available ? 'bg-white' : 'bg-slate-100 opacity-80'}`}>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" disabled={!opt.available} checked={opt.selected} onChange={(e)=>{
                            setFutureOptions(fo => fo.map((f,i)=> i===idx ? {...f, selected: e.target.checked} : f))
                          }} />
                          <div>
                            <div className="text-sm font-medium">{formatJalali(opt.date)}</div>
                            <div className="text-xs text-slate-500">{opt.available ? 'آزاد' : 'رزرو شده'}</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium">{selectedTime}</div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
        {/* Modal for selecting future-week repeats and ball rental */}
        {showModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={()=>{ setShowModal(false); setSelectedTime('') }} />
            <div className="relative bg-white rounded shadow-lg w-full max-w-md p-4 z-50">
              <h4 className="font-semibold mb-2">انتخاب‌های اضافی برای {selectedTime}</h4>
              <div className="text-sm text-slate-600 mb-3">برای تاریخ {selectedDate ? (selectedDate.format ? selectedDate.format('YYYY/MM/DD') : new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'2-digit',day:'2-digit'}).format(selectedDate)) : ''}</div>
              <div className="space-y-3 max-h-60 overflow-auto">
                {modalFutureOptions.length===0 && (
                  <div>
                    <div className="text-sm text-slate-500">هیچ پیشنهاد هفتگی موجود نیست.</div>
                    <div className="text-xs text-slate-400 mt-1">اگر تاریخ انتخاب نشده بود، تاریخ امروز استفاده شد؛ در غیر این صورت ممکن است هیچ هفتهٔ بعدی تا تاریخ حداکثر موجود نباشد.</div>
                  </div>
                )}
                {modalFutureOptions.map((opt, idx) => (
                  <label key={idx} className={`flex items-center justify-between p-2 rounded ${opt.available ? 'bg-white' : 'bg-slate-100 opacity-80'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled={!opt.available} checked={!!opt.selected} onChange={(e)=>{
                        setModalFutureOptions(mfo => mfo.map((m,i)=> i===idx ? {...m, selected: e.target.checked} : m))
                      }} />
                      <div>
                        <div className="text-sm font-medium">{formatJalali(opt.date)}</div>
                        <div className="text-xs text-slate-500">{opt.available ? 'آزاد' : 'رزرو شده'}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{selectedTime}</div>
                  </label>
                ))}
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button onClick={()=>{
                  // select all available weeks
                  setModalFutureOptions(mfo => mfo.map(m => m.available ? {...m, selected: true} : m))
                }} className="text-sm text-sportBlue hover:underline">انتخاب همهٔ هفته‌ها</button>
              </div>

              <div className="mt-3 border-t pt-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={modalBall} onChange={(e)=>setModalBall(e.target.checked)} />
                  <div className="text-sm">اجاره توپ (هر سانس <span className="font-medium">50,000</span> تومان اضافی)</div>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">مجموع انتخاب‌شده:</div>
                <div className="font-medium">
                  {(() => {
                    const baseCount = 1 + modalFutureOptions.filter(f=>f.selected && f.available).length
                    const baseTotal = arena.price * baseCount
                    const ballTotal = modalBall ? (50000 * baseCount) : 0
                    const grand = baseTotal + ballTotal
                    return (<span>{baseCount} سانس • {new Intl.NumberFormat('en-US').format(grand)} تومان</span>)
                  })()}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={()=>{
                  // confirm: apply modal choices to main state
                  setFutureOptions(modalFutureOptions)
                  setBallRental(modalBall)
                  setShowModal(false)
                }} className="flex-1 bg-sportGreen text-white py-2 rounded">تأیید</button>
                <button onClick={()=>{ setShowModal(false); setSelectedTime('') }} className="flex-1 bg-slate-200 py-2 rounded">انصراف</button>
              </div>
            </div>
          </div>
        )}
      <aside>
        <BookingForm
          price={arena.price}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          futureDates={futureOptions.filter(f=>f.selected && f.available).map(f=>f.iso)}
          ballRental={ballRental}
          ballFee={50000}
          onBooked={(results)=>{
            // refresh reservations and UI
            setRefreshKey(k=>k+1)
            // clear future selections that were just booked
            const bookedIsos = results.map(r=>r.date)
            setFutureOptions(fo => fo.map(f => ({ ...f, selected: bookedIsos.includes(f.iso) ? false : f.selected })))
            // reset ball rental after booking
            setBallRental(false)
          }}
        />
      </aside>
    </div>
  )
}
