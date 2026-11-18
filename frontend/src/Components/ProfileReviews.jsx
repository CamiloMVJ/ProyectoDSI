import { useEffect, useState } from 'react'
import { ChevronDown, MessageSquareText, Star } from 'lucide-react'
import { getResenasLugar } from '../services/PerfilLugar.api.js'

const PAGE_SIZE = 5
const dateFormat = new Intl.DateTimeFormat('es-NI', { day: 'numeric', month: 'long', year: 'numeric' })

export default function ProfileReviews({ id }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

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

  const visible = reviews.slice(0, visibleCount)
  const average = reviews.length
    ? (reviews.reduce((total, review) => total + Number(review.calificacion), 0) / reviews.length).toFixed(1)
    : null

  return <section className="perfil-reviews" aria-labelledby="perfil-reviews-title">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200/60 pb-2">
      <h2 id="perfil-reviews-title" className="flex items-center gap-2 text-2xl font-bold text-[#3A3A3A]"><MessageSquareText size={24} className="text-[#C45111]" aria-hidden="true" /> Reseñas</h2>
      {average && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4df] px-3 py-1 text-sm font-bold text-[#6b4b15]"><Star size={16} fill="currentColor" aria-hidden="true" /> {average} · {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}</span>}
    </div>
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
              </li>)}
            </ol>
            {visibleCount < reviews.length && <div className="mt-5 flex justify-center"><button type="button" onClick={() => setVisibleCount(count => count + PAGE_SIZE)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d8e1d5] bg-white px-5 text-sm font-bold text-[#344e3b] hover:border-[#c45111] hover:text-[#c45111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c45111]"><ChevronDown size={18} aria-hidden="true" /> Cargar más reseñas</button></div>}
          </>}
  </section>
}
