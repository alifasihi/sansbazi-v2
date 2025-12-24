import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import List from './pages/List'
import Details from './pages/Details'
import Booking from './pages/Booking'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Header from './components/Header'

export default function App(){
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-lightBg via-slate-50 to-slate-100">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/list" element={<List/>} />
          <Route path="/arena/:id" element={<Details/>} />
          <Route path="/booking/:id" element={<Booking/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </main>
    </div>
  )
}
