import React from 'react'
import { useSearchParams } from 'react-router-dom'
import data from '../data/arenas.json'
import ArenaCard from '../components/ArenaCard'

export default function List(){
  const [qs] = useSearchParams()
  const city = qs.get('city') || ''
  const sport = qs.get('sport') || ''

  const filtered = data.filter(a=> {
    return (city? a.city.includes(city) : true) && (sport? a.sportType.includes(sport) : true)
  })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">نتایج جستجو</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(a=> <ArenaCard key={a.id} arena={a} />)}
      </div>
    </div>
  )
}
