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
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">ثبت نام</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="نام" className="p-2 border rounded w-full" />
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="شماره تماس" className="p-2 border rounded w-full" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button type="submit" className="w-full bg-sportGreen text-white py-2 rounded">ثبت نام و ورود</button>
      </form>
      <div className="text-xs text-slate-500 mt-3">با ثبت نام، شما به‌صورت خودکار وارد خواهید شد.</div>
    </div>
  )
}
