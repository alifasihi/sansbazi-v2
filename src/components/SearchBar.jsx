import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import locations from '../data/locations.json'
import { MagnifyingGlassIcon, MapPinIcon, CalendarDaysIcon } from '@heroicons/react/24/solid'

export default function SearchBar(){
  const [city, setCity] = useState('')
  const [sport, setSport] = useState('')
  const [province, setProvince] = useState('')
  const [date, setDate] = useState(null)
  const navigate = useNavigate()

  function onSearch(e){
    e.preventDefault()
    // Convert selected Jalali date to ISO YYYY-MM-DD (Gregorian) for query
    const dateStr = date ? date.toDate().toISOString().slice(0,10) : ''
    const q = new URLSearchParams({city, sport, date: dateStr}).toString()
    navigate('/list?' + q)
  }

  useEffect(()=>{
    // reset city when province changes
    setCity('')
  },[province])

  const cityOptions = province ? (locations.find(l=>l.province===province)?.cities || []) : []

  return (
    <form onSubmit={onSearch} className="bg-glass backdrop-blur-md rounded-3xl p-6 shadow-2xl flex flex-col lg:flex-row gap-4 animate-slide-up border border-glass">
      <div className="flex-1 relative">
        <MapPinIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neonBlue animate-pulse-slow" />
        <select value={province} onChange={e=>setProvince(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-transparent transition-all duration-200 bg-glass backdrop-blur-sm hover:bg-glassDark">
          <option value="">استان</option>
          {locations.map((l)=> <option key={l.province} value={l.province}>{l.province}</option>)}
        </select>
      </div>
      <div className="flex-1 relative">
        <MapPinIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neonBlue animate-pulse-slow" />
        <select value={city} onChange={e=>setCity(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-transparent transition-all duration-200 bg-glass backdrop-blur-sm hover:bg-glassDark disabled:opacity-50" disabled={!province}>
          <option value="">شهر</option>
          {cityOptions.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex-1 relative">
        <select value={sport} onChange={e=>setSport(e.target.value)} className="w-full pl-4 pr-4 py-3 border border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-transparent transition-all duration-200 bg-glass backdrop-blur-sm hover:bg-glassDark">
          <option value="">نوع ورزش</option>
          <option>فوتسال</option>
          <option>فوتبال</option>
          <option>بسکتبال</option>
          <option>والیبال</option>
          <option>پینت بال</option>
        </select>
      </div>
      <div className="flex-1 relative">
  <CalendarDaysIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neonBlue animate-pulse-slow z-10" />
  <DatePicker
    calendar={persian}
    locale={persian_fa}
    value={date}
    onChange={setDate}
    className="w-full"
    format="YYYY/MM/DD"
    calendarPosition="top-right" 
    inputClass="w-full pl-10 pr-4 py-3 border border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-transparent transition-all duration-200 bg-glass backdrop-blur-sm hover:bg-glassDark z-10"
  />
</div>
      <button className="bg-gradient-to-r from-modernBlue to-neonBlue text-white px-8 py-3 rounded-xl hover:from-neonBlue hover:to-modernBlue transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-w-[120px] animate-glow">
        <MagnifyingGlassIcon className="w-5 h-5" />
        جستجو
      </button>
    </form>
  )
}
