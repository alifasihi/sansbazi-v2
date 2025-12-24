import React from 'react'

export default function ScheduleTable({slots}){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {slots.map((s, idx)=> (
        <div key={idx} className={`p-3 rounded border flex items-center justify-between ${s.status==='free' ? 'bg-white' : 'bg-slate-100 opacity-70'}`}>
          <div className="font-medium">{s.time}</div>
          <div className={`px-2 py-1 rounded text-sm ${s.status==='free' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>{s.status==='free' ? 'آزاد' : 'رزرو شده'}</div>
        </div>
      ))}
    </div>
  )
}
