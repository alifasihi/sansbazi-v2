import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
// Note: `react-multi-date-picker` CSS may not be available if the package
// wasn't installed due to registry/npm errors. Use a minimal fallback so the
// app doesn't crash while you install dependencies.
import './date-picker-fallback.css'
import { seedRandomReservations } from './utils/reservations'

// Seed random reservations once on app start (if storage is empty)
// Seed more reservations so more slots are shown as booked by default
seedRandomReservations({ days: 21, density: 0.22 })

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
