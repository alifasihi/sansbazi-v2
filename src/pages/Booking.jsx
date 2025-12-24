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
    <div className="space-y-8 animate-fade-in">
      <div className="bg-glass backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-glass animate-slide-up">
        <div className="flex items-center gap-4 mb-4">
          <img src={arena.logo} alt={`${arena.name} logo`} className="w-16 h-16 rounded-2xl object-cover shadow-lg animate-float" />
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-modernBlue to-neonBlue bg-clip-text text-transparent">رزرو {arena.name}</h2>
            <p className="text-slate-600 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-neonGreen rounded-full animate-pulse-slow"></span>
              {arena.address} • {arena.city}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-glass backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-glass animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-slate-800">انتخاب تاریخ</h4>
              <button onClick={()=>setShowCustomDate(s=>!s)} className="text-sm bg-glassDark hover:bg-glass border border-glass rounded-xl px-4 py-2 transition-all duration-200 text-neonBlue hover:text-neonPurple">
                تاریخ دلخواه
              </button>
            </div>

            {showCustomDate && (
              <div className="mt-4 p-4 bg-glassDark rounded-2xl border border-glass">
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  value={selectedDate}
                  onChange={(d)=>{
                    setSelectedDate(d)
                    setSelectedTime('')
                  }}
                  format="YYYY/MM/DD"
                  minDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+7)}
                  maxDate={new Date(2026,2,19)}
                  inputClass="w-full p-3 border border-glass rounded-xl bg-glass backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-transparent"
                />
                <div className="text-xs text-slate-500 mt-2">حداقل تاریخ: ۷ روز پس از امروز — حداکثر: 29/12/1404</div>
              </div>
            )}
          </div>

          <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
            <WeekDaysBar selectedDate={selectedDate} onSelect={(d)=>{ setSelectedDate(d); setSelectedTime('') }} />
          </div>

          <div className="bg-glass backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-glass animate-slide-up" style={{animationDelay: '0.6s'}}>
            <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-neonPurple to-modernGreen bg-clip-text text-transparent">
              سانس‌ها برای {selectedDate ? (selectedDate.format ? selectedDate.format('YYYY/MM/DD') : new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'2-digit',day:'2-digit'}).format(selectedDate)) : '---'}
            </h4>
            <DailySlots slots={displayedSlots} onSelect={(t)=>{
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
          </div>

          {selectedTime && (
            <div className="bg-glass backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-glass animate-slide-up" style={{animationDelay: '0.8s'}}>
              <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-neonBlue to-modernBlue bg-clip-text text-transparent">پیشنهاد برای هفته‌های بعد</h4>
              <div className="mb-4">
                <button onClick={()=>{
                  setModalFutureOptions(futureOptions.map(f => ({ ...f })))
                  setModalBall(ballRental)
                  setShowModal(true)
                }} className="bg-glassDark hover:bg-glass border border-glass rounded-xl px-4 py-2 transition-all duration-200 text-neonGreen hover:text-neonBlue">
                  پیکربندی پیشرفته
                </button>
              </div>
              <div className="grid gap-3">
                {futureOptions.length===0 && <div className="text-slate-500 bg-glassDark rounded-xl p-4 border border-glass">هیچ پیشنهادی موجود نیست.</div>}
                {futureOptions.map((opt, idx)=> (
                  <label key={idx} className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${opt.available ? 'bg-glassDark border-glass hover:border-neonBlue' : 'bg-slate-100 opacity-60 border-slate-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled={!opt.available} checked={opt.selected} onChange={(e)=>{
                        const newOpts = [...futureOptions]
                        newOpts[idx].selected = e.target.checked
                        setFutureOptions(newOpts)
                      }} className="w-4 h-4 text-neonBlue focus:ring-neonBlue border-slate-300 rounded" />
                      <span className={opt.available ? 'text-slate-800' : 'text-slate-500'}>{formatJalali(opt.date)}</span>
                    </div>
                    {!opt.available && <span className="text-xs text-red-500">رزرو شده</span>}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="animate-slide-up" style={{animationDelay: '1s'}}>
          <BookingForm
            price={arena.price}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            futureDates={futureOptions.filter(f=>f.selected).map(f=>f.iso)}
            onBooked={(results)=>{
              setRefreshKey(k=>k+1)
              setSelectedTime('')
              setFutureOptions([])
              setBallRental(false)
            }}
            ballRental={ballRental}
            ballFee={arena.price * 0.1}
          />
        </aside>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setShowModal(false)} />
          <div className="relative bg-glass backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-glass w-full max-w-md animate-bounce-in">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-neonPurple to-modernGreen bg-clip-text text-transparent">پیکربندی پیشرفته</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" checked={modalBall} onChange={e=>setModalBall(e.target.checked)} className="w-4 h-4 text-neonBlue focus:ring-neonBlue border-slate-300 rounded" />
                  <span className="text-slate-700">اجاره توپ ({(arena.price * 0.1).toLocaleString('en-US')} تومان)</span>
                </label>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {modalFutureOptions.map((opt, idx)=> (
                  <label key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${opt.available ? 'bg-glassDark border-glass hover:border-neonBlue' : 'bg-slate-100 opacity-60 border-slate-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" disabled={!opt.available} checked={opt.selected} onChange={(e)=>{
                        const newOpts = [...modalFutureOptions]
                        newOpts[idx].selected = e.target.checked
                        setModalFutureOptions(newOpts)
                      }} className="w-4 h-4 text-neonBlue focus:ring-neonBlue border-slate-300 rounded" />
                      <span className={opt.available ? 'text-slate-800' : 'text-slate-500'}>{formatJalali(opt.date)}</span>
                    </div>
                    {!opt.available && <span className="text-xs text-red-500">رزرو شده</span>}
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={()=>{
                  setFutureOptions(modalFutureOptions)
                  setBallRental(modalBall)
                  setShowModal(false)
                }} className="flex-1 bg-gradient-to-r from-modernGreen to-neonGreen text-white py-3 rounded-xl hover:from-neonGreen hover:to-modernGreen transition-all duration-200 font-medium">
                  اعمال
                </button>
                <button onClick={()=>setShowModal(false)} className="flex-1 bg-glassDark border border-glass text-slate-700 py-3 rounded-xl hover:bg-glass transition-all duration-200">
                  لغو
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
