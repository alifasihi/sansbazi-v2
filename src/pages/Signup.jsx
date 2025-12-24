import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser, getUserByPhone } from '../utils/auth'

export default function Signup(){
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function onSubmit(e){
    e.preventDefault()
    setError('')
    if(!name || !phone){ setError('لطفاً نام و شماره را وارد کنید'); return }
    if(getUserByPhone(phone)){ setError('این شماره قبلاً ثبت شده است. لطفا وارد شوید.'); return }
    const user = registerUser({ name, phone })
    if(user){
      navigate('/')
      window.location.reload()
    }else{
      setError('خطا در ثبت نام')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-glass backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-glass animate-bounce-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-neonPurple to-modernGreen bg-clip-text text-transparent mb-2">ثبت نام حساب جدید</h2>
            <p className="text-slate-600">برای شروع رزرو، اطلاعات خود را وارد کنید</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">نام و نام خانوادگی</label>
              <input
                value={name}
                onChange={e=>setName(e.target.value)}
                placeholder="مثال: علی محمدی"
                className="w-full p-4 border border-glass rounded-2xl focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-transparent transition-all duration-200 bg-glass backdrop-blur-sm hover:bg-glassDark text-slate-800 placeholder-slate-500"
              />
            </div>

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

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-modernBlue to-neonBlue text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 animate-glow"
            >
              ثبت نام و ورود
            </button>
          </form>

          <div className="text-xs text-slate-500 mt-6 text-center bg-glassDark rounded-xl p-4 border border-glass">
            <span className="inline-block w-2 h-2 bg-modernGreen rounded-full mr-2 animate-pulse-slow"></span>
            با ثبت نام، شما به‌صورت خودکار وارد خواهید شد.
          </div>
        </div>
      </div>
    </div>
  )
}
