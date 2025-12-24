import React from 'react'

export default function Gallery({images}){
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((src, i)=> (
        <div key={i} className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{animationDelay: `${i * 0.1}s`}}>
          <img src={src} alt={`img-${i}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
        </div>
      ))}
    </div>
  )
}
