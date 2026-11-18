import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { createAdmin, getAdmins } from '../services/adminCalendar.api.js'

const blank = { nombre_completo:'', email:'', password:'', telefono:'' }
export default function AdminAccounts() {
  const { sesion } = useAuth()
  const [form,setForm] = useState(blank)
  const [admins,setAdmins] = useState([])
  const [error,setError] = useState('')
  const [message,setMessage] = useState('')
  const [busy,setBusy] = useState(false)
  useEffect(()=>{if (sesion?.usuario?.rol !== 'Administrador') return; const c=new AbortController();getAdmins(sesion.token,c.signal).then(setAdmins).catch(e=>{if(e.name!=='AbortError')setError(e.message)});return ()=>c.abort()},[sesion])
  if(sesion?.usuario?.rol !== 'Administrador') return <Navigate to="/ingresar" replace />
  async function submit(e) {e.preventDefault();setError('');setMessage('');setBusy(true);try {const result=await createAdmin(sesion.token,form);setAdmins(a=>[...a,result.administrador]);setForm(blank);setMessage(`Cuenta de administrador creada para ${result.usuario.nombre_completo}`)}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <div className="min-h-screen bg-[#f6f8f3] text-[#25382e]"><Navbar/><main className="mx-auto max-w-5xl px-6 py-12"><Link to="/account" className="text-sm font-semibold text-[#C45111] underline">Volver a mi cuenta</Link><h1 className="mt-5 text-3xl font-bold">Crear cuentas de administrador</h1><p className="mt-2 text-[#526554]">Solo los administradores autenticados pueden registrar nuevos administradores.</p>{error&&<p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}{message&&<p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-green-800">{message}</p>}<form onSubmit={submit} className="mt-7 grid gap-5 rounded-2xl border bg-white p-7 sm:grid-cols-2">{[['nombre_completo','Nombre completo','text'],['email','Correo electrónico','email'],['password','Contraseña (mínimo 8 caracteres)','password'],['telefono','Teléfono (opcional)','tel']].map(([key,label,type])=><label key={key} className="text-sm font-semibold">{label}<input className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3" required={key!=='telefono'} minLength={key==='password'?8:undefined} type={type} autoComplete="off" value={form[key]} onChange={e=>setForm(o=>({...o,[key]:e.target.value}))}/></label>)}<div className="sm:col-span-2"><button disabled={busy} className="rounded-full bg-[#344e3b] px-6 py-3 font-bold text-white disabled:opacity-50">{busy?'Creando…':'Crear cuenta de administrador'}</button></div></form><section className="mt-9 rounded-2xl bg-white p-7"><h2 className="text-xl font-bold">Administradores registrados ({admins.length})</h2><div className="mt-4 space-y-2">{admins.map(a=><div key={a.id_administrador} className="flex justify-between border-b py-2 text-sm"><span>Administrador #{a.id_administrador} · Usuario #{a.id_usuario}</span><span>{a.rol}</span></div>)}</div></section></main><Footer homeHref="/"/></div>
}
