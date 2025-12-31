import initial from '../data/reservations.json'
import arenas from '../data/arenas.json'
import { generateSlots } from './slots'

const STORAGE_KEY = 'sansbazi_reservations_v1'

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(raw) return JSON.parse(raw)
  }catch(e){/*ignore*/}
  return initial.slice()
}

function save(data){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }catch(e){/*ignore*/}
}

export function getAllReservations(){
  return load()
}

export function getReservationsForArenaDate(arenaId, dateISO){
  const all = load()
  return all.filter(r => r.arenaId === arenaId && r.date === dateISO)
}

export function addReservation(res){
  const all = load()
  const id = 'r_' + Date.now()
  const entry = { id, ...res }
  all.push(entry)
  save(all)
  return entry
}

export function clearReservations(){
  save([])
}

export function seedRandomReservations({ days = 14, density = 0.22 } = {}){
  // density: fraction of slots to mark as booked across days (higher => more booked slots)
  try{
    const existing = load()
    // if there are already many reservations, skip seeding
    // raise threshold so we can seed more slots on fresh installs
    if(existing && existing.length > 30) return existing

    const slotsTemplate = generateSlots(90)
    const res = []
    const today = new Date()
    const maxDate = new Date(2026,2,19) // 2026-03-19 (29/12/1404)

    for(let d=0; d<days; d++){
      const cur = new Date(today.getFullYear(), today.getMonth(), today.getDate() + d)
      if(cur > maxDate) break
      const dateISO = cur.toISOString().slice(0,10)
      arenas.forEach(arena => {
        // choose random subset of slots to book
        slotsTemplate.forEach(slot => {
          if(Math.random() < density){
            const id = 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2,6)
            res.push({ id, arenaId: arena.id, date: dateISO, time: slot.time, status: 'confirmed' })
          }
        })
      })
    }

    // Merge with existing reservations, avoiding duplicates based on arenaId, date, and time
    const existingMap = new Map()
    if(existing && existing.length > 0){
      existing.forEach(r => {
        const key = `${r.arenaId}_${r.date}_${r.time}`
        existingMap.set(key, r)
      })
    }

    // Add new reservations only if they don't already exist
    res.forEach(r => {
      const key = `${r.arenaId}_${r.date}_${r.time}`
      if(!existingMap.has(key)){
        existingMap.set(key, r)
      }
    })

    const merged = Array.from(existingMap.values())
    save(merged)
    return merged
  }catch(e){
    return load()
  }
}
