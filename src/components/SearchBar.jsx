import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import locations from '../data/locations.json'

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
    <form onSubmit={onSearch} className="bg-white rounded-lg p-4 shadow flex flex-col md:flex-row gap-3">
      <select value={province} onChange={e=>setProvince(e.target.value)} className="p-2 border rounded">
        <option value="">استان</option>
        {locations.map((l)=> <option key={l.province} value={l.province}>{l.province}</option>)}
      </select>
      <select value={city} onChange={e=>setCity(e.target.value)} className="p-2 border rounded" disabled={!province}>
        <option value="">شهر</option>
        {cityOptions.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={sport} onChange={e=>setSport(e.target.value)} className="p-2 border rounded">
        <option value="">نوع ورزش</option>
        <option>فوتسال</option>
        <option>فوتبال</option>
        <option>بسکتبال</option>
        <option>والیبال</option>
        <option>پینت بال</option>
      </select>
      <div className="p-0">
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          value={date}
          onChange={setDate}
          className="p-2 border rounded"
          format="YYYY/MM/DD"
          calendarPosition="bottom-right"
        />
      </div>
      <button className="bg-sportBlue text-white px-4 py-2 rounded">جستجو</button>
    </form>
  )
}
