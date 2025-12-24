import React from 'react'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid'

export default function ScheduleTable({slots}){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {slots.map((s, idx)=> (
        <div key={idx} className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 animate-fade-in ${s.status==='free' ? 'bg-white border-slate-200 hover:shadow-lg hover:border-modernBlue' : 'bg-gradient-to-r from-slate-100 to-slate-200 opacity-80 border-slate-300'}`} style={{animationDelay: `${idx * 0.05}s`}}>
          <div className="flex items-center gap-3">
            <ClockIcon className="w-5 h-5 text-slate-600" />
            <div className="font-semibold text-slate-800">{s.time}</div>
          </div>
          <div className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${s.status==='free' ? 'text-modernGreen bg-gradient-to-r from-green-50 to-green-100 border border-modernGreen' : 'text-red-700 bg-gradient-to-r from-red-50 to-red-100 border border-red-200'}`}>
            {s.status==='free' ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
            {s.status==='free' ? 'آزاد' : 'رزرو شده'}
          </div>
        </div>
      ))}
    </div>
  )
}
