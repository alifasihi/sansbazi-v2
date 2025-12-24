import React from 'react'

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
    <div className="overflow-x-auto">
      <div className="flex gap-3 items-center">
        {days.map((d, idx)=>{
          const {weekday, day, month} = toJalaliDay(d)
          const isSelected = plainSelected && (d.toDateString() === plainSelected.toDateString())
          return (
            <button key={idx} onClick={()=>onSelect(d)} className={`min-w-[96px] flex flex-col items-center p-3 rounded transition ${isSelected ? 'bg-sportBlue text-white' : 'bg-white hover:shadow-lg'}`}>
              <div className="text-sm text-slate-500">{weekday}</div>
              <div className="text-lg font-bold">{day}</div>
              <div className="text-xs text-slate-400">{month}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
