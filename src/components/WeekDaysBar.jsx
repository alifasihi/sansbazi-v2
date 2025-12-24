import React from 'react'
import { CalendarDaysIcon } from '@heroicons/react/24/solid'

function toJalaliDay(date){
  // returns object {weekday, day, month}
  try{
    const weekday = new Intl.DateTimeFormat('fa-IR', {weekday: 'short'}).format(date)
    const day = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {day: 'numeric'}).format(date)
    const month = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {month: 'short'}).format(date)
    return { weekday, day, month }
  }catch(e){
    // fallback
    return { weekday: date.toLocaleDateString(), day: date.getDate(), month: '' }
  }
}

export default function WeekDaysBar({ selectedDate, onSelect }){
  const today = new Date()
  const days = Array.from({length:7}).map((_,i)=> {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
    return d
  })
  function toPlainDate(d){
    if(!d) return null
    if(d.format) return d.toDate()
    if(d instanceof Date) return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    return new Date(d)
  }

  const plainSelected = toPlainDate(selectedDate)

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-4 items-center">
        {days.map((d, idx)=>{
          const {weekday, day, month} = toJalaliDay(d)
          const isSelected = plainSelected && (d.toDateString() === plainSelected.toDateString())
          const isToday = d.toDateString() === today.toDateString()
          return (
            <button key={idx} onClick={()=>onSelect(d)} className={`min-w-[100px] flex flex-col items-center p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in shadow-lg hover:shadow-xl border-2 ${isSelected ? 'bg-gradient-to-br from-modernBlue to-sportBlue text-white border-modernBlue' : isToday ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 hover:border-yellow-400' : 'bg-white border-slate-200 hover:border-modernBlue'}`} style={{animationDelay: `${idx * 0.1}s`}}>
              <div className={`text-sm mb-1 ${isSelected ? 'text-white' : 'text-slate-500'}`}>{weekday}</div>
              <div className={`text-xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-800'}`}>{day}</div>
              <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{month}</div>
              {isToday && !isSelected && <CalendarDaysIcon className="w-4 h-4 text-yellow-600 mt-1" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
