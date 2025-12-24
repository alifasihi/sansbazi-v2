import React from 'react'
import SearchBar from '../components/SearchBar'
import ArenaCard from '../components/ArenaCard'
import data from '../data/arenas.json'

export default function Home(){
  const recommended = data.slice(0,3)
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-gradient-to-br from-modernBlue via-neonBlue to-modernGreen text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden animate-float">
        <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-xs"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up bg-gradient-to-r from-white to-neonBlue bg-clip-text text-transparent">رزرو آسان و سریع سالن‌های ورزشی</h2>
          <p className="text-xl md:text-2xl opacity-90 animate-slide-up" style={{animationDelay: '0.2s'}}>جستجو بر اساس شهر، نوع ورزش و تاریخ — بهترین گزینه‌ها را بیابید</p>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-neonGreen bg-opacity-20 rounded-full animate-glow"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-neonPurple bg-opacity-20 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white bg-opacity-5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      </section>

      <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
        <SearchBar />
      </div>

      <section className="animate-slide-up" style={{animationDelay: '0.6s'}}>
        <h3 className="text-3xl font-bold mb-8 text-center md:text-left bg-gradient-to-r from-modernBlue to-sportGreen bg-clip-text text-transparent">پیشنهادی برای شما</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((a, index) => (
            <div key={a.id} className="animate-bounce-in" style={{animationDelay: `${0.8 + index * 0.1}s`}}>
              <ArenaCard arena={a} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
