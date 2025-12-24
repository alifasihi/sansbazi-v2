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
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">ورود</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="شماره تماس" className="p-2 border rounded w-full" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-sportGreen text-white py-2 rounded">ورود</button>
          <Link to="/signup" className="flex-1 text-center border rounded py-2">ثبت نام</Link>
        </div>
      </form>
      <div className="text-xs text-slate-500 mt-3">برای ورود کافی است شمارهٔ ثبت شده را وارد کنید.</div>
    </div>
  )
}
