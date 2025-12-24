import React, {useState, useEffect} from 'react'
import { addReservation } from '../utils/reservations'
import { formatPrice, isPriceHigh } from '../utils/format'
import { useNavigate, useLocation } from 'react-router-dom'
import { getCurrentUser } from '../utils/auth'

export default function BookingForm({price, selectedDate, selectedTime, futureDates = [], onBooked, ballRental = false, ballFee = 50000}){
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(selectedDate || null)
  const [time, setTime] = useState(selectedTime || '')

  useEffect(()=>{
    setDate(selectedDate || null)
  },[selectedDate])

  useEffect(()=>{
    setTime(selectedTime || '')
  },[selectedTime])

  useEffect(()=>{
    const user = getCurrentUser()
    if(user){
      setName(user.name || '')
      setPhone(user.phone || '')
    }
  },[])

  const navigate = useNavigate()
  const location = useLocation()

  const total = price || 0

  const selectedCount = ((date && time) ? 1 : 0) + (futureDates ? futureDates.length : 0)
  const extraTotal = ballRental ? (ballFee * selectedCount) : 0
  const totalPrice = (price || 0) * selectedCount + extraTotal

  function formatDateDisplay(d){
    if(!d) return ''
    if(d.format) return d.format('YYYY/MM/DD')
    if(d instanceof Date) return new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'2-digit',day:'2-digit'}).format(d)
    return String(d)
  }

  function onSubmit(e){
    e.preventDefault()
    const dateStr = formatDateDisplay(date)
    try{
      const isoMain = date ? (date.format ? date.toDate().toISOString().slice(0,10) : date.toISOString().slice(0,10)) : ''
      // require login
      const user = getCurrentUser()
      if(!user){
        // redirect to login and preserve location
        navigate('/login', { state: { from: location.pathname } })
        return
      }

      const datesToBook = [isoMain, ...(futureDates || [])].filter(Boolean)
      const results = []
      datesToBook.forEach(dt => {
        const res = addReservation({ arenaId: window.location.pathname.split('/').pop(), date: dt, time, status: 'confirmed', name, phone, extraBall: !!ballRental, extraFee: ballRental ? ballFee : 0, userId: user.id })
        results.push(res)
      })
      if(results.length > 0){
        alert(`رزرو ثبت شد\nتعداد: ${results.length}`)
        // clear form inputs
        setName('')
        setPhone('')
        if(onBooked) onBooked(results)
      }else{
        alert('هیچ تاریخی برای رزرو انتخاب نشده است')
      }
    }catch(err){
      alert(`خطا در ثبت رزرو (محلی): ناموفق`)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-glass backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-glass animate-slide-up">
      <h3 className="text-3xl font-bold bg-gradient-to-r from-neonPurple to-modernGreen bg-clip-text text-transparent mb-8 text-center">فرم رزرو</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <div className="bg-glassDark rounded-2xl p-5 border border-glass">
            <div className="text-sm text-slate-500 mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-neonBlue rounded-full animate-pulse-slow"></span>
              تاریخ انتخاب‌شده
            </div>
            <div className="text-xl font-bold text-slate-800">{date ? formatDateDisplay(date) : '---'}</div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-glassDark rounded-2xl p-5 border border-glass">
            <div className="text-sm text-slate-500 mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-neonGreen rounded-full animate-pulse-slow"></span>
              ساعت انتخاب‌شده
            </div>
            <div className="text-xl font-bold text-slate-800">{time || '---'}</div>
          </div>
        </div>
        {futureDates && futureDates.length>0 && (
          <div className="md:col-span-2 bg-glassDark rounded-2xl p-5 border border-glass">
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-neonPurple rounded-full animate-pulse-slow"></span>
              رزرو اضافی برای {futureDates.length} تاریخ انتخاب شده
            </div>
          </div>
        )}
        <div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="نام" className="w-full p-4 border border-glass rounded-2xl focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-transparent transition-all duration-200 bg-glass backdrop-blur-sm hover:bg-glassDark text-slate-800 placeholder-slate-500" />
        </div>
        <div>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="شماره تماس" className="w-full p-4 border border-glass rounded-2xl focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-transparent transition-all duration-200 bg-glass backdrop-blur-sm hover:bg-glassDark text-slate-800 placeholder-slate-500" />
        </div>
        <div className="md:col-span-2 bg-glassDark rounded-2xl p-6 border border-glass">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-neonGreen rounded-full animate-pulse-slow"></span>
              قیمت نهایی
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-neonGreen to-modernGreen bg-clip-text text-transparent">{formatPrice(totalPrice || price)}</div>
          </div>
          {ballRental && selectedCount>0 && (
            <div className="text-sm text-slate-600 mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-neonPurple rounded-full animate-pulse-slow"></span>
              اجاره توپ: {formatPrice(ballFee)} × {selectedCount} = <span className="font-semibold text-neonGreen">{formatPrice(extraTotal)}</span>
            </div>
          )}
          {selectedCount > 1 && (
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-modernBlue rounded-full animate-pulse-slow"></span>
              مجموع {selectedCount} سانس • هر سانس: <span className="text-neonBlue font-semibold">{formatPrice(price)}</span>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <button type="submit" disabled={!date || !time} className={`w-full py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 ${(!date || !time) ? 'bg-glassDark cursor-not-allowed text-slate-500 border border-glass' : 'bg-gradient-to-r from-modernGreen to-neonGreen text-white hover:from-neonGreen hover:to-modernGreen animate-glow'}`}>
            ثبت رزرو
          </button>
        </div>
      </div>
    </form>
  )
}
