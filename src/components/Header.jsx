import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { getCurrentUser, logout } from '../utils/auth'

export default function Header(){
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function onLogout(){
    logout()
    navigate('/')
    window.location.reload()
  }

  return (
    <header className="bg-glass backdrop-blur-md shadow-xl border-b border-glass sticky top-0 z-50 animate-slide-up">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-modernBlue to-neonBlue flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 animate-float">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 group-hover:text-neonBlue transition-colors duration-200">Sansbazi</h1>
            <p className="text-sm text-slate-500">رزرو آنلاین سالن‌های ورزشی</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/list" className="text-slate-700 hover:text-neonBlue transition-colors duration-200 font-medium hover:scale-105 transform">فهرست سالن‌ها</Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 text-slate-700 hover:text-neonBlue transition-colors duration-200 font-medium hover:scale-105 transform">
                <UserCircleIcon className="w-6 h-6 text-slate-600" />
                <span>{user.name}</span>
              </Link>
              <button onClick={onLogout} className="text-sm text-red-600 hover:text-neonPurple font-medium hover:scale-105 transform transition-all duration-200">خروج</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-700 hover:text-neonBlue transition-colors duration-200 font-medium hover:scale-105 transform">ورود</Link>
              <Link to="/signup" className="bg-gradient-to-r from-modernGreen to-neonGreen text-white px-6 py-2 rounded-xl hover:from-neonGreen hover:to-modernGreen transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105 transform animate-glow">ثبت نام</Link>
            </div>
          )}
        </nav>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-glassDark transition-all duration-200"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6 text-slate-600" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-slate-600" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-glass backdrop-blur-md border-t border-glass animate-slide-down">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/list"
              className="block text-slate-700 hover:text-neonBlue transition-colors duration-200 font-medium py-2 px-4 rounded-xl hover:bg-glassDark"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              فهرست سالن‌ها
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-slate-700 hover:text-neonBlue transition-colors duration-200 font-medium py-2 px-4 rounded-xl hover:bg-glassDark"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserCircleIcon className="w-5 h-5 text-slate-600" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={() => {
                    onLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-red-600 hover:text-neonPurple font-medium py-2 px-4 rounded-xl hover:bg-glassDark transition-all duration-200"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-slate-700 hover:text-neonBlue transition-colors duration-200 font-medium py-2 px-4 rounded-xl hover:bg-glassDark"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ورود
                </Link>
                <Link
                  to="/signup"
                  className="block bg-gradient-to-r from-modernGreen to-neonGreen text-white py-3 px-4 rounded-xl hover:from-neonGreen hover:to-modernGreen transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-center animate-glow"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ثبت نام
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
