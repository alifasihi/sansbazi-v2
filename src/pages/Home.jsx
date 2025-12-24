import React from 'react'
import SearchBar from '../components/SearchBar'
import ArenaCard from '../components/ArenaCard'
import data from '../data/arenas.json'

export default function Home(){
  const recommended = data.slice(0,3)
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-gradient-to-br from-modernBlue via-sportBlue to-modernGreen text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">رزرو آسان و سریع سالن‌های ورزشی</h2>
          <p className="text-lg md:text-xl opacity-90 animate-slide-up" style={{animationDelay: '0.2s'}}>جستجو بر اساس شهر، نوع ورزش و تاریخ — بهترین گزینه‌ها را بیابید</p>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
      </section>

      <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
        <SearchBar />
      </div>

      <section className="animate-slide-up" style={{animationDelay: '0.6s'}}>
        <h3 className="text-2xl font-bold mb-6 text-center md:text-left">پیشنهادی برای شما</h3>
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
