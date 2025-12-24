import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { getCurrentUser, logout } from '../utils/auth'

export default function Header(){
  const navigate = useNavigate()
  const user = getCurrentUser()

  function onLogout(){
    logout()
    navigate('/')
    window.location.reload()
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sportGreen flex items-center justify-center text-white font-bold">S</div>
          <div>
            <h1 className="text-lg font-semibold">Sansbazi</h1>
            <p className="text-sm text-slate-500">رزرو آنلاین سالن‌های ورزشی</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/list" className="text-slate-700 hover:text-sportBlue transition">فهرست سالن‌ها</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 text-slate-700 hover:text-sportBlue transition">
                <UserCircleIcon className="w-6 h-6 text-slate-600" />
                <span>{user.name}</span>
              </Link>
              <button onClick={onLogout} className="text-sm text-red-600">خروج</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-slate-700 hover:text-sportBlue transition">ورود</Link>
              <Link to="/signup" className="text-sportGreen font-medium">ثبت نام</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
