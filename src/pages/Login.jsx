import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { loginUser, getUserByPhone } from '../utils/auth'

export default function Login(){
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const loc = useLocation()

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    const user = loginUser(phone)
    if(user){
      // redirect back if specified
      const dest = loc.state && loc.state.from ? loc.state.from : '/'
      navigate(dest)
      window.location.reload()
    }else{
      setError('کاربری با این شماره وجود ندارد. لطفاً ثبت نام کنید یا شماره را بررسی کنید.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-glass backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-glass animate-bounce-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-modernBlue to-neonBlue bg-clip-text text-transparent mb-2">ورود به حساب</h2>
            <p className="text-slate-600">برای ادامه لطفاً شماره تماس خود را وارد کنید</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">شماره تماس</label>
              <input
                value={phone}
                onChange={e=>setPhone(e.target.value)}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                className="w-full p-4 border border-glass rounded-2xl focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-transparent transition-all duration-200 bg-glass backdrop-blur-sm hover:bg-glassDark text-slate-800 placeholder-slate-500"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 animate-shake">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse-slow"></span>
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-modernGreen to-neonGreen text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 animate-glow"
              >
                ورود
              </button>

              <Link
                to="/signup"
                className="block w-full text-center bg-glassDark border border-glass text-slate-700 py-4 rounded-2xl font-medium transition-all duration-200 hover:bg-glass hover:border-neonBlue hover:text-neonBlue"
              >
                ثبت نام حساب جدید
              </Link>
            </div>
          </form>

          <div className="text-xs text-slate-500 mt-6 text-center bg-glassDark rounded-xl p-4 border border-glass">
            <span className="inline-block w-2 h-2 bg-modernBlue rounded-full mr-2 animate-pulse-slow"></span>
            برای ورود کافی است شمارهٔ ثبت شده را وارد کنید.
          </div>
        </div>
      </div>
    </div>
  )
}
