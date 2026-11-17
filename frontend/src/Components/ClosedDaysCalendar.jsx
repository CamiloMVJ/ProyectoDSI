import { useEffect, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, LoaderCircle, Trash2 } from 'lucide-react'
import { createClosedDay, deleteClosedDay, getClosedDays } from '../services/establishments.api.js'

const weekdays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
const dateFormatter = new Intl.DateTimeFormat('es-NI', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const monthFormatter = new Intl.DateTimeFormat('es-NI', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const dateFromIso = value => new Date(`${value}T00:00:00Z`)
const pad = value => String(value).padStart(2, '0')
const monthOf = value => value.slice(0, 7)

export default function ClosedDaysCalendar({ idLocal, token, readOnly, compact = false }) {
  const [window, setWindow] = useState(null)
  const [days, setDays] = useState([])
  const [month, setMonth] = useState('')
  const [selected, setSelected] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    getClosedDays(token, idLocal, controller.signal).then(data => {
      if (controller.signal.aborted) return
      setWindow({ min: data.fecha_minima, max: data.fecha_maxima })
      setDays(data.dias_cerrados)
      setMonth(current => current >= monthOf(data.fecha_minima) && current <= monthOf(data.fecha_maxima) ? current : monthOf(data.fecha_minima))
      setSelected(current => current >= data.fecha_minima && current <= data.fecha_maxima ? current : '')
      setError('')
    }).catch(fetchError => {
      if (!controller.signal.aborted) {
        setWindow(null)
        setError(fetchError.message || 'No se pudieron cargar los días cerrados.')
      }
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [idLocal, token, reload])

  const selectedDay = days.find(day => day.fecha === selected)
  const [year, monthNumber] = month ? month.split('-').map(Number) : [0, 0]
  const firstDay = month ? new Date(Date.UTC(year, monthNumber - 1, 1)) : null
  const offset = firstDay ? (firstDay.getUTCDay() + 6) % 7 : 0
  const count = month ? new Date(Date.UTC(year, monthNumber, 0)).getUTCDate() : 0
  const cells = Array.from({ length: offset + count }, (_, index) => index < offset ? null : index - offset + 1)

  function moveMonth(delta) {
    const next = new Date(Date.UTC(year, monthNumber - 1 + delta, 1))
    setMonth(`${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}`)
    setSelected('')
    setReason('')
    setError('')
    setNotice('')
  }

  function pickDate(date) {
    setSelected(date)
    setReason('')
    setError('')
    setNotice('')
  }

  async function saveClosure() {
    if (!selected || !window || selected < window.min || selected > window.max || busy || selectedDay) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const created = await createClosedDay(token, idLocal, { fecha: selected, motivo: reason.trim() || null })
      setDays(current => [...current, created].sort((a, b) => a.fecha.localeCompare(b.fecha)))
      setReason('')
      setNotice('Día marcado como cerrado. El cambio ya está guardado.')
    } catch (saveError) {
      setError(saveError.message || 'No se pudo marcar el día como cerrado.')
      if (saveError.status === 400 || saveError.status === 409) setReload(current => current + 1)
    } finally {
      setBusy(false)
    }
  }

  async function removeClosure() {
    if (!selectedDay || busy) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await deleteClosedDay(token, idLocal, selectedDay.id_cierre)
      setDays(current => current.filter(day => day.id_cierre !== selectedDay.id_cierre))
      setNotice('El cierre se quitó. El cambio ya está guardado.')
    } catch (removeError) {
      setError(removeError.message || 'No se pudo quitar el cierre.')
    } finally {
      setBusy(false)
    }
  }

  return <section className="ge-form-section ge-closed-section" aria-labelledby={compact ? 'ge-closed-popup-title' : 'ge-closed-heading'}>
    {!compact && <div className="ge-section-heading"><span className="ge-section-icon"><CalendarDays size={20} aria-hidden="true" /></span><div><h3 id="ge-closed-heading">Días de cierre excepcional</h3><p>Marca los días en que no atenderás aunque tu horario regular indique lo contrario.</p></div></div>}
    {loading && <p className="ge-loading" role="status"><LoaderCircle className="ge-spinner" size={18} aria-hidden="true" /> Cargando calendario…</p>}
    {!loading && !window && <div className="ge-closed-retry"><p className="ge-error" role="alert">{error}</p><button type="button" className="ge-button ge-outline" onClick={() => { setLoading(true); setReload(current => current + 1) }}>Reintentar</button></div>}
    {!loading && window && <>
      <p className="ge-closed-range">Puedes programar cierres del <strong>{dateFormatter.format(dateFromIso(window.min))}</strong> al <strong>{dateFormatter.format(dateFromIso(window.max))}</strong>. Las demás fechas no se pueden seleccionar.</p>
      <div className="ge-closed-layout">
        <div className="ge-calendar" aria-label="Calendario de días cerrados">
          <div className="ge-calendar-nav"><button type="button" onClick={() => moveMonth(-1)} disabled={busy || month <= monthOf(window.min)} aria-label="Mes anterior"><ChevronLeft size={20} /></button><h4>{monthFormatter.format(firstDay)}</h4><button type="button" onClick={() => moveMonth(1)} disabled={busy || month >= monthOf(window.max)} aria-label="Mes siguiente"><ChevronRight size={20} /></button></div>
          <div className="ge-calendar-grid">{weekdays.map(day => <span className="ge-calendar-weekday" key={day}>{day}</span>)}{cells.map((day, index) => {
            if (!day) return <span aria-hidden="true" key={`empty-${index}`} />
            const date = `${month}-${pad(day)}`
            const closure = days.some(item => item.fecha === date)
            const allowed = date >= window.min && date <= window.max
            return <button type="button" key={date} className={`ge-calendar-day${closure ? ' ge-calendar-closed' : ''}${selected === date ? ' ge-calendar-selected' : ''}`} disabled={!allowed || busy} aria-label={`${dateFormatter.format(dateFromIso(date))}${closure ? ', cerrado' : ''}`} aria-pressed={selected === date} onClick={() => pickDate(date)}>{day}{closure && <span className="ge-calendar-dot" aria-hidden="true" />}</button>
          })}</div>
          <div className="ge-calendar-legend"><span><i className="ge-legend-available" /> Disponible</span><span><i className="ge-legend-closed" /> Cerrado</span><span><i className="ge-legend-disabled" /> Fuera de plazo</span></div>
        </div>
        <div className="ge-closed-detail">
          {selected ? <><span className="ge-closed-eyebrow">FECHA SELECCIONADA</span><h4>{dateFormatter.format(dateFromIso(selected))}</h4>{selectedDay ? <><p className="ge-closed-status">Este día está marcado como cerrado.</p>{selectedDay.motivo && <p className="ge-closed-reason"><strong>Motivo:</strong> {selectedDay.motivo}</p>}{!readOnly && <button type="button" className="ge-button ge-outline ge-closed-delete" onClick={removeClosure} disabled={busy}><Trash2 size={17} /> {busy ? 'Quitando…' : 'Quitar cierre'}</button>}</> : <><p>El local atenderá según su horario regular.</p>{!readOnly && <><label className="ge-field ge-closed-reason-input"><span>Motivo (opcional)</span><input className="ge-plain-input" value={reason} maxLength={150} onChange={event => setReason(event.target.value)} placeholder="Ej. mantenimiento o vacaciones" disabled={busy} /></label><button type="button" className="ge-button ge-orange" onClick={saveClosure} disabled={busy}><CalendarDays size={17} /> {busy ? 'Guardando…' : 'Marcar como cerrado'}</button></>}</>}</> : <><span className="ge-closed-eyebrow">PLANIFICA TU ATENCIÓN</span><h4>Selecciona una fecha</h4><p>Elige un día disponible del calendario para marcarlo como cerrado o consultar un cierre existente.</p></>}
          {!readOnly && <small>Los cambios de este calendario se guardan de inmediato, sin usar «Guardar cambios».</small>}
          {error && <p className="ge-error" role="alert">{error}</p>}
          {notice && <p className="ge-notice" role="status">{notice}</p>}
        </div>
      </div>
    </>}
  </section>
}
