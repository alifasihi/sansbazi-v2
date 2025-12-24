import React from 'react'

export default function Gallery({images}){
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {images.map((src, i)=> (
        <div key={i} className="h-32 bg-slate-200 overflow-hidden rounded">
          <img src={src} alt={`img-${i}`} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  )
}
