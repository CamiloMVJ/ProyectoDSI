import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, MessageSquareText, Star } from 'lucide-react'
import { getPermisosResenas, getResenasLugar, publicarResena, responderResena } from '../services/PerfilLugar.api.js'
import { useAuth } from '../hooks/useAuth.js'

const PAGE_SIZE = 5
const dateFormat = new Intl.DateTimeFormat('es-NI', { day: 'numeric', month: 'long', year: 'numeric' })
const actionClass = 'inline-flex min-h-11 items-center justify-center rounded-xl bg-[#c45111] px-5 text-sm font-bold text-white hover:bg-[#9d3e0b] disabled:cursor-wait disabled:opacity-60'

function ReplyForm({ review, token, onSaved, onCancel }) {
  const [answer, setAnswer] = useState(review.respuesta_propietario ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (!answer.trim() || saving) return
    setSaving(true)
    setError('')
    try {
      const updated = await responderResena(token, review.id_resena, answer.trim())
      onSaved(updated)
    } catch (cause) {
      setError(cause.message)
    } finally {
      setSaving(false)
    }
  }

  return <form onSubmit={submit} className="mt-4 rounded-xl border border-[#d8e1d5] bg-[#f8faf6] p-4">
    <label htmlFor={`reply-${review.id_resena}`} className="block text-sm font-bold text-[#263f32]">Respuesta del establecimiento</label>
    <textarea id={`reply-${review.id_resena}`} value={answer} onChange={event => setAnswer(event.target.value)} required maxLength={2000} rows={3} className="mt-2 w-full rounded-xl border border-[#d8e1d5] bg-white p-3 text-sm text-[#25382e] outline-none focus:border-[#c45111] focus:ring-2 focus:ring-[#c45111]/15" />
    {error && <p role="alert" className="mt-2 text-sm text-[#9d3e0b]">{error}</p>}
    <div className="mt-3 flex flex-wrap gap-3">
      <button type="submit" disabled={saving || !answer.trim()} className={actionClass}>{saving ? 'Guardando…' : 'Publicar respuesta'}</button>
      <button type="button" onClick={onCancel} className="min-h-11 px-3 text-sm font-semibold text-[#344e3b]">Cancelar</button>
    </div>
  </form>
}

export default function ProfileReviews({ id, isCommercial = false }) {
  const { sesion } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [replyPermission, setReplyPermission] = useState({ token: null, value: null, error: '' })
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [editingReply, setEditingReply] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    getResenasLugar(id, controller.signal)
      .then(data => {
        if (!controller.signal.aborted) {
          setReviews(data)
          setError('')
          setLoading(false)
        }
      })
      .catch(cause => {
        if (!controller.signal.aborted) {
          setError(cause.message)
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [id, retry])

  useEffect(() => {
    if (!isCommercial || sesion?.usuario?.rol !== 'Propietario') return
    const controller = new AbortController()
    getPermisosResenas(id, sesion.token, controller.signal)
      .then(data => {
        if (!controller.signal.aborted) {
          setReplyPermission({ token: sesion.token, value: data.puede_responder, error: '' })
        }
      })
      .catch(cause => {
        if (!controller.signal.aborted) setReplyPermission({ token: sesion.token, value: null, error: cause.message })
      })
    return () => controller.abort()
  }, [id, isCommercial, sesion?.token, sesion?.usuario?.rol])

  async function submitReview(event) {
    event.preventDefault()
    if (submitting) return
    if (!rating) {
      setSubmitError('Seleccioná una calificación de 1 a 5 estrellas.')
      return
    }
    if (!comment.trim()) {
      setSubmitError('Escribí un comentario antes de publicar.')
      return
    }
    setSubmitting(true)
    setSubmitError('')
    setSubmitSuccess('')
    try {
      const created = await publicarResena(sesion.token, id, rating, comment.trim())
      setReviews(current => [{ ...created, autor: sesion.usuario.nombre_completo }, ...current])
      setVisibleCount(PAGE_SIZE)
      setRating(0)
      setComment('')
      setSubmitSuccess('Tu reseña se publicó correctamente.')
    } catch (cause) {
      setSubmitError(cause.message)
    } finally {
      setSubmitting(false)
    }
  }

  function saveReply(updated) {
    setReviews(current => current.map(review => review.id_resena === updated.id_resena
      ? { ...review, respuesta_propietario: updated.respuesta_propietario }
      : review))
    setEditingReply(null)
  }

  const role = sesion?.usuario?.rol
  const canReply = replyPermission.token === sesion?.token ? replyPermission.value : null
  const permissionError = replyPermission.token === sesion?.token ? replyPermission.error : ''
  const mayReview = isCommercial && !loading && !error && (role === 'Usuario' || (role === 'Propietario' && canReply === false))
  const ownerCanReply = role === 'Propietario' && canReply === true
  const visible = reviews.slice(0, visibleCount)
  const average = reviews.length
    ? (reviews.reduce((total, review) => total + Number(review.calificacion), 0) / reviews.length).toFixed(1)
    : null

  return <section className="perfil-reviews" aria-labelledby="perfil-reviews-title">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200/60 pb-2">
      <h2 id="perfil-reviews-title" className="flex items-center gap-2 text-2xl font-bold text-[#3A3A3A]"><MessageSquareText size={24} className="text-[#C45111]" aria-hidden="true" /> Reseñas</h2>
      {average && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4df] px-3 py-1 text-sm font-bold text-[#6b4b15]"><Star size={16} fill="currentColor" aria-hidden="true" /> {average} · {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}</span>}
    </div>

    {isCommercial && !sesion && <p className="mb-5 rounded-2xl border border-[#d8e1d5] bg-white p-5 text-sm text-[#526554]"><Link to="/ingresar" className="font-bold text-[#c45111] underline">Iniciá sesión</Link> para publicar una reseña.</p>}
    {mayReview && <form onSubmit={submitReview} className="mb-6 rounded-2xl border border-[#d8e1d5] bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#263f32]">Dejá tu reseña</h3>
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold text-[#344e3b]">Tu calificación</legend>
        <div className="mt-2 flex gap-1" role="group" aria-label="Seleccionar calificación">
          {Array.from({ length: 5 }, (_, index) => <button key={index} type="button" aria-label={`${index + 1} ${index === 0 ? 'estrella' : 'estrellas'}`} aria-pressed={rating === index + 1} onClick={() => { setRating(index + 1); setSubmitError('') }} className="flex size-11 items-center justify-center rounded-lg text-[#d49824] hover:bg-[#fff4df] focus-visible:outline-2 focus-visible:outline-[#c45111]"><Star size={28} fill={index < rating ? 'currentColor' : 'none'} aria-hidden="true" /></button>)}
        </div>
      </fieldset>
      <label htmlFor="review-comment" className="mt-4 block text-sm font-semibold text-[#344e3b]">Tu comentario</label>
      <textarea id="review-comment" value={comment} onChange={event => setComment(event.target.value)} required maxLength={2000} rows={4} placeholder="Contá cómo fue tu experiencia" className="mt-2 w-full rounded-xl border border-[#d8e1d5] bg-[#f8faf6] p-3 text-sm text-[#25382e] outline-none focus:border-[#c45111] focus:ring-2 focus:ring-[#c45111]/15" />
      {submitError && <p role="alert" className="mt-2 text-sm text-[#9d3e0b]">{submitError}</p>}
      {submitSuccess && <p role="status" className="mt-2 text-sm font-semibold text-[#344e3b]">{submitSuccess}</p>}
      <button type="submit" disabled={submitting} className={`${actionClass} mt-3`}>{submitting ? 'Publicando…' : 'Publicar reseña'}</button>
    </form>}
    {permissionError && <p role="alert" className="mb-5 rounded-xl bg-[#fff0e9] p-4 text-sm text-[#9d3e0b]">No se pudo comprobar si podés responder: {permissionError}</p>}

    {loading ? <div role="status" aria-label="Cargando reseñas"><span className="sr-only">Cargando reseñas…</span><div aria-hidden="true" className="space-y-4"><div className="rounded-2xl border border-[#d8e1d5] bg-white p-5"><div className="perfil-skeleton-block h-4 w-36 rounded-full" /><div className="perfil-skeleton-block mt-3 h-4 w-24 rounded-full" /><div className="perfil-skeleton-block mt-5 h-4 w-full rounded-full" /><div className="perfil-skeleton-block mt-2 h-4 w-4/5 rounded-full" /></div><div className="rounded-2xl border border-[#d8e1d5] bg-white p-5"><div className="perfil-skeleton-block h-4 w-32 rounded-full" /><div className="perfil-skeleton-block mt-3 h-4 w-24 rounded-full" /><div className="perfil-skeleton-block mt-5 h-4 w-3/4 rounded-full" /></div></div></div>
      : error ? <div role="alert" className="rounded-2xl border border-[#e9c7b6] bg-[#fff0e9] p-6 text-sm text-[#9d3e0b]"><p>{error}</p><button type="button" onClick={() => { setLoading(true); setVisibleCount(PAGE_SIZE); setRetry(value => value + 1) }} className="mt-3 font-bold underline">Reintentar</button></div>
        : !reviews.length ? <p className="rounded-2xl border border-[#d8e1d5] bg-white p-6 text-sm text-[#526554]">Este lugar todavía no tiene reseñas publicadas.</p>
          : <>
            <ol className="space-y-4">
              {visible.map(review => <li key={review.id_resena} className="rounded-2xl border border-[#d8e1d5] bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div><strong className="text-sm text-[#263f32]">{review.autor}</strong><div className="mt-1 flex gap-1 text-[#d49824]" role="img" aria-label={`${review.calificacion} de 5 estrellas`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill={index < review.calificacion ? 'currentColor' : 'none'} aria-hidden="true" />)}</div></div>
                  {review.fecha_publicacion && <time dateTime={String(review.fecha_publicacion).slice(0, 10)} className="text-xs text-[#718071]">{dateFormat.format(new Date(review.fecha_publicacion))}</time>}
                </div>
                {review.comentario && <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#526554]">{review.comentario}</p>}
                {review.respuesta_propietario && <div className="mt-4 rounded-xl border-l-4 border-[#c45111] bg-[#f6f8f3] p-4"><strong className="text-xs text-[#344e3b]">Respuesta del establecimiento</strong><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#526554]">{review.respuesta_propietario}</p></div>}
                {ownerCanReply && (editingReply === review.id_resena
                  ? <ReplyForm review={review} token={sesion.token} onSaved={saveReply} onCancel={() => setEditingReply(null)} />
                  : <button type="button" onClick={() => setEditingReply(review.id_resena)} className="mt-4 min-h-11 text-sm font-bold text-[#c45111] hover:text-[#9d3e0b]">{review.respuesta_propietario ? 'Editar respuesta' : 'Responder reseña'}</button>)}
              </li>)}
            </ol>
            {visibleCount < reviews.length && <div className="mt-5 flex justify-center"><button type="button" onClick={() => setVisibleCount(count => count + PAGE_SIZE)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d8e1d5] bg-white px-5 text-sm font-bold text-[#344e3b] hover:border-[#c45111] hover:text-[#c45111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c45111]"><ChevronDown size={18} aria-hidden="true" /> Cargar más reseñas</button></div>}
          </>}
  </section>
}
