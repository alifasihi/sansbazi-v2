import React from 'react'
import SearchBar from '../components/SearchBar'
import ArenaCard from '../components/ArenaCard'
import data from '../data/arenas.json'

export default function Home(){
  const recommended = data.slice(0,3)
  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-sportGreen to-sportBlue text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold">رزرو آسان و سریع سالن‌های ورزشی</h2>
        <p className="mt-2 opacity-90">جستجو بر اساس شهر، نوع ورزش و تاریخ — بهترین گزینه‌ها را بیابید</p>
      </section>

      <SearchBar />

      <section>
        <h3 className="text-lg font-semibold mb-3">پیشنهادی برای شما</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended.map(a=> <ArenaCard key={a.id} arena={a} />)}
        </div>
      </section>
    </div>
  )
}
