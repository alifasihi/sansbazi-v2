export function generateSlots(slotMinutes = 90) {
  const slots = []
  const minutesInDay = 24 * 60
  for (let start = 0; start < minutesInDay; start += slotMinutes) {
    const end = start + slotMinutes
    const startH = Math.floor(start / 60)
    const startM = start % 60
    const endH = Math.floor((end % minutesInDay) / 60)
    const endM = end % 60
    const pad = (n) => n.toString().padStart(2, '0')
    const timeStr = `${pad(startH)}:${pad(startM)} - ${pad(endH)}:${pad(endM)}`
    slots.push({ time: timeStr, startMinutes: start, status: 'free' })
  }
  return slots
}

export function markBookedSlots(allSlots, bookedTimes = []) {
  // bookedTimes: array of time strings like '09:00 - 10:30'
  const set = new Set(bookedTimes)
  return allSlots.map(s => ({ ...s, status: set.has(s.time) ? 'booked' : 'free' }))
}
