import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, MapPin, Pencil, Trash2 } from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getEventos, createEvento, updateEvento, deleteEvento } from '../services/adminCalendar.api.js'
import { eventsForDay, eventsForMonth, formatEventTime, isoDay, timeInputValue } from '../services/calendarUtils.js'
import { getDepartments } from '../services/places.api.js'

const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
const empty = { titulo: '', descripcion: '', fecha_inicio: today(), fecha_fin: today(), hora_inicio: '', hora_fin: '', id_departamento: '', municipio: '', direccion_referencia: '', tipo_evento: '', costo_entrada: '', es_gratuito: true, es_anual_recurrente: false, id_lugar_asociado: '', estado: 'Programado' }
const fields = [['titulo', 'Título'], ['descripcion', 'Descripción'], ['fecha_inicio', 'Fecha de inicio'], ['fecha_fin', 'Fecha de fin'], ['hora_inicio', 'Hora inicial'], ['hora_fin', 'Hora final'], ['municipio', 'Municipio'], ['direccion_referencia', 'Dirección o referencia'], ['tipo_evento', 'Tipo de evento'], ['costo_entrada', 'Costo de entrada (C$)'], ['id_lugar_asociado', 'ID de lugar turístico (opcional)']]
const dateField = new Set(['fecha_inicio', 'fecha_fin'])
const timeField = new Set(['hora_inicio', 'hora_fin'])
const numberField = new Set(['costo_entrada', 'id_lugar_asociado'])
const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const weekdays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
function dateLabel(value) { return isoDay(value).split('-').reverse().join('/') }
function formFrom(event) { return Object.fromEntries(Object.keys(empty).map(key => [key, dateField.has(key) ? isoDay(event[key]) : timeField.has(key) ? timeInputValue(event[key]) : event[key] ?? empty[key]])) }
function payload(form) { return { ...form, id_departamento: Number(form.id_departamento), costo_entrada: form.es_gratuito ? 0 : form.costo_entrada === '' ? null : Number(form.costo_entrada), id_lugar_asociado: form.id_lugar_asociado ? Number(form.id_lugar_asociado) : null, hora_inicio: form.hora_inicio || null, hora_fin: form.hora_fin || null } }

function EventActions({ event, onEdit, onRemove }) {
  return <div className="flex flex-wrap items-center gap-2">
    <button type="button" onClick={() => onEdit(event)} aria-label={`Editar ${event.titulo}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#cbd8ca] bg-[#f4f8f1] px-3 text-sm font-semibold text-[#344e3b] transition-colors hover:border-[#344e3b] hover:bg-[#eaf0e7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344e3b]">
      <Pencil size={15} aria-hidden="true" /> Editar
    </button>
    <button type="button" onClick={() => onRemove(event)} aria-label={`Eliminar ${event.titulo}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#f1c9c5] bg-[#fff6f4] px-3 text-sm font-semibold text-[#a3352a] transition-colors hover:border-[#a3352a] hover:bg-[#fde8e5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3352a]">
      <Trash2 size={15} aria-hidden="true" /> Eliminar
    </button>
  </div>
}

export default function NationalEvents({ admin = false }) {
  const { sesion } = useAuth()
  const allowed = sesion?.usuario?.rol === 'Administrador'
  const [selected, setSelected] = useState(today())
  const [year, setYear] = useState(Number(today().slice(0, 4)))
  const [month, setMonth] = useState(Number(today().slice(5, 7)))
  const [events, setEvents] = useState([])
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([getEventos(controller.signal), getDepartments(controller.signal)])
      .then(([items, deps]) => { setEvents(items); setDepartments(deps) })
      .catch(e => { if (e.name !== 'AbortError') setError(e.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])
  const start = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const dayEvents = useMemo(() => eventsForDay(events, selected).filter(e => admin || e.estado === 'Programado'), [events, selected, admin])
  const monthly = useMemo(() => eventsForMonth(events.filter(e => admin || e.estado === 'Programado'), year, month), [events, year, month, admin])
  function move(delta) {
    const d = new Date(Date.UTC(year, month - 1 + delta, 1))
    const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1
    setYear(y); setMonth(m); setSelected(`${y}-${String(m).padStart(2, '0')}-01`)
  }
  async function submit(e) {
    e.preventDefault(); setSaving(true); setError(''); setNotice('')
    try {
      const body = payload(form)
      if (body.fecha_fin < body.fecha_inicio) throw new Error('La fecha final no puede ser anterior a la inicial')
      const item = editing ? await updateEvento(sesion.token, editing, body) : await createEvento(sesion.token, body)
      setEvents(current => editing ? current.map(e => e.id_evento === editing ? item : e) : [...current, item])
      setNotice(editing ? 'Evento actualizado correctamente' : 'Evento creado correctamente')
      setForm(empty); setEditing(null)
    } catch (e) { setError(e.message) } finally { setSaving(false) }
  }
  function edit(event) { setEditing(event.id_evento); setForm(formFrom(event)); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  async function remove(event) {
    if (!window.confirm(`¿Eliminar el evento «${event.titulo}»?`)) return
    setError(''); setNotice('')
    try { await deleteEvento(sesion.token, event.id_evento); setEvents(cur => cur.filter(e => e.id_evento !== event.id_evento)); setNotice('Evento eliminado'); if (editing === event.id_evento) { setEditing(null); setForm(empty) } }
    catch (e) { setError(e.message) }
  }
  if (admin && !allowed) return <Navigate to="/ingresar" replace />
  const inputClass = 'mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-[#25382e]'
  return <div className="min-h-screen bg-[#f6f8f3] text-[#25382e]"><Navbar />
    <div className={admin ? undefined : 'home-explore-content'}>
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#C45111]">SINATUR · Agenda Nacional</p><h1 className="mt-2 text-3xl font-bold">{admin ? 'Administrar eventos nacionales' : 'Calendario de eventos nacionales'}</h1><p className="mt-2 text-sm text-[#526554]">Consulta eventos por día y mes{admin ? ', y registra o modifica actividades.' : ' en Nicaragua.'}</p></div>{admin ? <Link to="/calendario" aria-label="Ver calendario público" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#344e3b] px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#25382e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C45111]" > Ver calendario público <ArrowRight size={18} aria-hidden="true" /> </Link> : allowed && <Link to="/admin/eventos" aria-label="Gestionar eventos nacionales" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#344e3b] px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#25382e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C45111]">Gestionar eventos <ArrowRight size={18} aria-hidden="true" /></Link>}</div>
      {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-red-800">{error}</p>}
      {notice && <p role="status" className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-green-800">{notice}</p>}
      {admin && <form onSubmit={submit} className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="mb-5 text-xl font-bold">{editing ? `Editar evento #${editing}` : 'Registrar nuevo evento'}</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(([key, label]) => <label className="text-sm font-semibold" key={key}>{label}<input className={inputClass} type={dateField.has(key) ? 'date' : timeField.has(key) ? 'time' : numberField.has(key) ? 'number' : 'text'} min={numberField.has(key) ? '0' : undefined} step={key === 'costo_entrada' ? '0.01' : undefined} required={['titulo', 'fecha_inicio', 'fecha_fin', 'municipio'].includes(key)} disabled={key === 'costo_entrada' && form.es_gratuito} value={form[key]} onChange={e => setForm(old => ({ ...old, [key]: e.target.value }))} /></label>)}
        <label className="text-sm font-semibold">Departamento<select required className={inputClass} value={form.id_departamento} onChange={e => setForm(old => ({ ...old, id_departamento: e.target.value }))}><option value="">Seleccionar departamento</option>{departments.map(d => <option key={d.id_departamento} value={d.id_departamento}>{d.nombre}</option>)}</select></label>
        <label className="text-sm font-semibold">Estado<select className={inputClass} value={form.estado} onChange={e => setForm(old => ({ ...old, estado: e.target.value }))}><option>Programado</option><option>Cancelado</option><option>Finalizado</option></select></label>
        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold"><label><input type="checkbox" checked={form.es_gratuito} onChange={e => setForm(old => ({ ...old, es_gratuito: e.target.checked }))} /> Entrada gratuita</label><label><input type="checkbox" checked={form.es_anual_recurrente} onChange={e => setForm(old => ({ ...old, es_anual_recurrente: e.target.checked }))} /> Repetición anual</label></div>
      </div><div className="mt-6 flex gap-3"><button disabled={saving} className="rounded-full bg-[#344e3b] px-6 py-3 font-bold text-white disabled:opacity-50">{saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear evento'}</button>{editing && <button type="button" className="rounded-full border px-6 py-3" onClick={() => { setEditing(null); setForm(empty) }}>Cancelar edición</button>}</div></form>}
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"><section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="mb-6 flex items-center justify-between"><button onClick={() => move(-1)} className="rounded-full p-2 hover:bg-gray-100" aria-label="Mes anterior"><ChevronLeft /></button><h2 className="text-xl font-bold capitalize">{months[month - 1]} {year}</h2><button onClick={() => move(1)} className="rounded-full p-2 hover:bg-gray-100" aria-label="Mes siguiente"><ChevronRight /></button></div><div className="grid grid-cols-7 text-center text-xs font-bold text-[#526554]">{weekdays.map((d, i) => <div key={i} className="py-2">{d}</div>)}</div><div className="grid grid-cols-7 gap-1">{Array.from({ length: start }, (_, i) => <div key={`blank${i}`} />)}{Array.from({ length: days }, (_, i) => { const date = `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`; const has = monthly.some(e => eventsForDay([e], date).length > 0); return <button key={date} type="button" onClick={() => setSelected(date)} aria-pressed={selected === date} className={`relative aspect-square rounded-xl text-sm font-semibold ${selected === date ? 'bg-[#344e3b] text-white' : date === today() ? 'bg-orange-50 text-[#C45111]' : 'hover:bg-gray-100'}`}>{i + 1}{has && <span className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${selected === date ? 'bg-white' : 'bg-[#C45111]'}`} />}</button> })}</div><p className="mt-4 text-xs text-[#526554]">El punto naranja señala días con eventos.</p></section>
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="mb-5 flex items-center gap-2 text-xl font-bold"><CalendarDays size={20} /> Eventos del {dateLabel(selected)}</h2>{loading ? <p>Cargando eventos…</p> : dayEvents.length === 0 ? <p className="text-sm text-[#526554]">No hay eventos registrados para esta fecha.</p> : <div className="space-y-4">{dayEvents.map(e => <article key={e.id_evento} className="rounded-xl border border-gray-200 p-4"><div className="flex items-start justify-between gap-2"><h3 className="font-bold">{e.titulo}</h3><span className="rounded-full bg-[#eaf0e7] px-2 py-1 text-xs">{e.estado}</span></div><p className="mt-2 text-sm text-[#526554]">{e.descripcion}</p><p className="mt-2 flex items-center gap-2 text-xs"><MapPin size={14} />{e.municipio} · {e.departamento}</p><p className="mt-1 text-xs">{dateLabel(e.fecha_inicio)} – {dateLabel(e.fecha_fin)}{e.hora_inicio ? ` · ${formatEventTime(e.hora_inicio)}` : ''} · {e.es_gratuito ? 'Gratis' : `C$ ${e.costo_entrada ?? 'Por confirmar'}`}{e.es_anual_recurrente ? ' · Anual' : ''}</p>{admin && <div className="mt-4"><EventActions event={e} onEdit={edit} onRemove={remove} /></div>}</article>)}</div>}</section></div>
      {admin && <section className="mt-8 rounded-2xl bg-white p-5"><h2 className="mb-3 text-xl font-bold">Eventos registrados ({events.length})</h2><div className="grid gap-3 sm:grid-cols-2">{events.map(e => <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3" key={e.id_evento}><span className="text-sm">{e.titulo} · {dateLabel(e.fecha_inicio)}</span><EventActions event={e} onEdit={edit} onRemove={remove} /></div>)}</div></section>}
    </main><Footer homeHref="/" />
    </div></div>
}
