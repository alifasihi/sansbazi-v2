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
    <form onSubmit={onSubmit} className="bg-white rounded p-4 shadow">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <div className="text-sm text-slate-500">تاریخ انتخاب‌شده</div>
          <div className="mt-1 font-medium">{date ? formatDateDisplay(date) : '---'}</div>
        </div>
        <div>
          <div className="text-sm text-slate-500">ساعت انتخاب‌شده</div>
          <div className="mt-1 font-medium">{time || '---'}</div>
        </div>
        {futureDates && futureDates.length>0 && (
          <div className="text-sm text-slate-500">رزرو اضافی برای {futureDates.length} تاریخ انتخاب شده</div>
        )}
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="نام" className="p-2 border rounded" />
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="شماره تماس" className="p-2 border rounded" />
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">قیمت نهایی</div>
          <div className={`text-lg font-bold text-green-700`}>{formatPrice(totalPrice || price)}</div>
        </div>
        {ballRental && selectedCount>0 && (
          <div className="text-sm text-slate-600 mt-1">اجاره توپ: {formatPrice(ballFee)} × {selectedCount} = <span className="font-medium text-green-700">{formatPrice(extraTotal)}</span></div>
        )}
        {selectedCount > 1 && (
          <div className="text-sm text-slate-500">مجموع {selectedCount} سانس • هر سانس: <span className="text-green-700 font-medium">{formatPrice(price)}</span></div>
        )}
        <button type="submit" disabled={!date || !time} className={`mt-2 w-full ${(!date || !time) ? 'bg-slate-300 cursor-not-allowed' : 'bg-sportBlue'} text-white py-2 rounded`}>ثبت رزرو</button>
      </div>
    </form>
  )
}
