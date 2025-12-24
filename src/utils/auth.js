const USERS_KEY = 'sansbazi_users_v1'
const CURRENT_KEY = 'sansbazi_current_user'

function loadUsers(){
  try{ const raw = localStorage.getItem(USERS_KEY); return raw ? JSON.parse(raw) : [] }catch(e){ return [] }
}

function saveUsers(u){ try{ localStorage.setItem(USERS_KEY, JSON.stringify(u)) }catch(e){} }

export function getUsers(){ return loadUsers() }

export function getUserByPhone(phone){ return loadUsers().find(u => u.phone === phone) }

export function registerUser({name, phone}){
  const users = loadUsers()
  // prevent duplicate phone
  if(users.find(u=>u.phone===phone)) return null
  const user = { id: 'u_'+Date.now(), name, phone }
  users.push(user)
  saveUsers(users)
  // set as current
  try{ localStorage.setItem(CURRENT_KEY, JSON.stringify(user)) }catch(e){}
  return user
}

export function loginUser(phone){
  const user = getUserByPhone(phone)
  if(!user) return null
  try{ localStorage.setItem(CURRENT_KEY, JSON.stringify(user)) }catch(e){}
  return user
}

export function logout(){ try{ localStorage.removeItem(CURRENT_KEY) }catch(e){} }

export function getCurrentUser(){
  try{ const raw = localStorage.getItem(CURRENT_KEY); return raw ? JSON.parse(raw) : null }catch(e){ return null }
}

export function ensureLoggedIn(navigate, from){
  // helper to redirect to login page with optional return
  navigate('/login', { state: { from } })
}
