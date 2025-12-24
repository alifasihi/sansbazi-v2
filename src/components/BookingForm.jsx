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
    <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow-2xl animate-slide-up border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">فرم رزرو</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="text-sm text-slate-600 mb-2">تاریخ انتخاب‌شده</div>
            <div className="text-lg font-semibold text-slate-800">{date ? formatDateDisplay(date) : '---'}</div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="text-sm text-slate-600 mb-2">ساعت انتخاب‌شده</div>
            <div className="text-lg font-semibold text-slate-800">{time || '---'}</div>
          </div>
        </div>
        {futureDates && futureDates.length>0 && (
          <div className="md:col-span-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
            <div className="text-sm text-slate-600">رزرو اضافی برای {futureDates.length} تاریخ انتخاب شده</div>
          </div>
        )}
        <div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="نام" className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-modernBlue focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white" />
        </div>
        <div>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="شماره تماس" className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-modernBlue focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white" />
        </div>
        <div className="md:col-span-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-300">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold text-slate-800">قیمت نهایی</div>
            <div className="text-2xl font-bold text-modernGreen">{formatPrice(totalPrice || price)}</div>
          </div>
          {ballRental && selectedCount>0 && (
            <div className="text-sm text-slate-600 mb-2">اجاره توپ: {formatPrice(ballFee)} × {selectedCount} = <span className="font-semibold text-modernGreen">{formatPrice(extraTotal)}</span></div>
          )}
          {selectedCount > 1 && (
            <div className="text-sm text-slate-500">مجموع {selectedCount} سانس • هر سانس: <span className="text-modernGreen font-semibold">{formatPrice(price)}</span></div>
          )}
        </div>
        <div className="md:col-span-2">
          <button type="submit" disabled={!date || !time} className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${(!date || !time) ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-gradient-to-r from-modernBlue to-sportBlue text-white hover:from-sportBlue hover:to-modernBlue'}`}>
            ثبت رزرو
          </button>
        </div>
      </div>
    </form>
  )
}
