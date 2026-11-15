import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Compass, Heart, LoaderCircle, MapPin, Search, Store } from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useFavorites } from '../hooks/useFavorites.js'
import { getCommercialCatalog, getPlacesCatalog } from '../services/places.api.js'

const types = { complejo: 'Complejo turístico', atractivo: 'Atractivo independiente', lugar: 'Lugar turístico', local: 'Local comercial' }

function FavoriteCard({ item, saved, pending, onToggle }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#d8e1d5] bg-[#fffefa] shadow-sm transition-shadow hover:shadow-md">
      <div className="relative flex h-48 items-center justify-center bg-[#eaf0e7]">
        {item.url_imagen ? <img src={item.url_imagen} alt={item.nombre} className="h-full w-full object-cover" /> : item.tipo === 'local' ? <Store size={42} className="text-[#79927c]" aria-hidden="true" /> : <Compass size={42} className="text-[#79927c]" aria-hidden="true" />}
        <button type="button" onClick={() => onToggle(item.id_local)} disabled={pending} aria-label={saved ? `Quitar ${item.nombre} de favoritos` : `Guardar ${item.nombre} en favoritos`} aria-pressed={saved} className={`absolute right-3 top-3 flex size-11 items-center justify-center rounded-full shadow-sm disabled:opacity-50 ${saved ? 'bg-[#c45111] text-white' : 'bg-white text-[#526554] hover:text-[#c45111]'}`}>
          {pending ? <LoaderCircle size={19} className="animate-spin" aria-hidden="true" /> : <Heart size={19} className={saved ? 'fill-current' : ''} aria-hidden="true" />}
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="self-start rounded-full bg-[#f6eee5] px-3 py-1 text-xs font-bold text-[#9d3e0b]">{types[item.tipo] ?? types.lugar}</span>
        <h3 className="mt-3 text-lg font-bold text-[#263f32]">{item.nombre}</h3>
        <p className="mt-2 flex items-start gap-2 text-sm text-[#526554]"><MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />{[item.municipio, item.departamento].filter(Boolean).join(', ')}</p>
        {item.descripcion && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#526554]">{item.descripcion}</p>}
        <div className="mt-auto pt-5">
          {item.maps_link && <a href={item.maps_link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#c45111] hover:text-[#9d3e0b]">Ver en el mapa</a>}
        </div>
      </div>
    </article>
  )
}

export default function Favorites() {
  const { sesion } = useAuth()
  const { favorites, loading: loadingFavorites, pendingId, error: favoriteError, toggle } = useFavorites()
  const [tab, setTab] = useState('guardados')
  const [type, setType] = useState('todos')
  const [query, setQuery] = useState('')
  const [catalog, setCatalog] = useState({ items: [], loading: true, error: '' })

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([getPlacesCatalog(controller.signal), getCommercialCatalog(controller.signal)])
      .then(([places, commercial]) => {
        if (controller.signal.aborted) return
        const items = [
          ...places.places.map(place => ({ ...place, id_local: place.id_lugar, tipo: place.tipo === 'otro' ? 'lugar' : place.tipo })),
          ...commercial.map(local => ({ ...local, tipo: 'local' }))
        ]
        setCatalog({ items, loading: false, error: '' })
      })
      .catch(cause => { if (!controller.signal.aborted) setCatalog({ items: [], loading: false, error: cause.message }) })
    return () => controller.abort()
  }, [])

  const savedIds = useMemo(() => new Set(favorites.map(item => Number(item.id_local))), [favorites])
  const items = useMemo(() => {
    const source = tab === 'guardados' ? favorites : catalog.items
    const term = query.trim().toLocaleLowerCase('es')
    return source.filter(item => (type === 'todos' || item.tipo === type) &&
      (!term || [item.nombre, item.municipio, item.departamento].some(value => String(value ?? '').toLocaleLowerCase('es').includes(term))))
  }, [tab, favorites, catalog.items, type, query])

  if (!sesion) return <Navigate to="/ingresar" replace />

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8f3] text-[#25382e]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-10 sm:px-10 sm:pt-14">
        <header className="border-b border-[#d8e1d5] pb-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c45111]">Tu espacio en SINATUR</p>
          <h1 className="mt-3 flex items-center gap-3 text-3xl font-bold text-[#263f32] sm:text-4xl"><Heart className="text-[#c45111]" aria-hidden="true" /> Mis favoritos</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#526554] sm:text-base">Guarda destinos y negocios que quieras visitar. Estarán disponibles cada vez que ingreses a tu cuenta.</p>
        </header>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex rounded-full border border-[#d8e1d5] bg-white p-1">
            <button type="button" onClick={() => setTab('guardados')} aria-pressed={tab === 'guardados'} className={`min-h-11 rounded-full px-5 text-sm font-bold ${tab === 'guardados' ? 'bg-[#344e3b] text-white' : 'text-[#526554] hover:bg-[#eaf0e7]'}`}>Guardados ({favorites.length})</button>
            <button type="button" onClick={() => setTab('explorar')} aria-pressed={tab === 'explorar'} className={`min-h-11 rounded-full px-5 text-sm font-bold ${tab === 'explorar' ? 'bg-[#344e3b] text-white' : 'text-[#526554] hover:bg-[#eaf0e7]'}`}>Explorar</button>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="relative"><span className="sr-only">Buscar por nombre o ubicación</span><Search size={17} className="absolute left-4 top-3.5 text-[#657b65]" aria-hidden="true" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por nombre o ubicación" className="min-h-11 w-64 rounded-xl border border-[#d8e1d5] bg-white pl-11 pr-3 text-sm outline-none focus:border-[#c45111]" /></label>
            <label><span className="sr-only">Filtrar por tipo</span><select value={type} onChange={event => setType(event.target.value)} className="min-h-11 rounded-xl border border-[#d8e1d5] bg-white px-4 text-sm text-[#25382e]"><option value="todos">Todos los tipos</option><option value="lugar">Lugares</option><option value="complejo">Complejos</option><option value="atractivo">Atractivos</option><option value="local">Locales comerciales</option></select></label>
          </div>
        </div>

        {favoriteError && <p role="alert" className="mt-5 rounded-xl bg-[#fff0e9] p-4 text-sm text-[#9d3e0b]">{favoriteError}</p>}
        {tab === 'explorar' && catalog.error && <p role="alert" className="mt-5 rounded-xl bg-[#fff0e9] p-4 text-sm text-[#9d3e0b]">{catalog.error}</p>}
        {((tab === 'guardados' && loadingFavorites) || (tab === 'explorar' && catalog.loading)) && <p role="status" className="mt-8 flex items-center gap-3 text-sm text-[#526554]"><LoaderCircle size={20} className="animate-spin" aria-hidden="true" /> Cargando lugares…</p>}
        {!(tab === 'guardados' && loadingFavorites) && !(tab === 'explorar' && catalog.loading) && items.length === 0 && <div className="mt-8 rounded-2xl border border-[#d8e1d5] bg-white px-6 py-12 text-center"><Heart size={32} className="mx-auto text-[#79927c]" aria-hidden="true" /><h2 className="mt-4 text-xl font-bold text-[#263f32]">{tab === 'guardados' ? 'Aún no tienes favoritos' : 'No encontramos resultados'}</h2><p className="mt-2 text-sm text-[#526554]">{tab === 'guardados' ? 'Explora destinos y negocios para guardar los que te interesen.' : 'Prueba con otro nombre o tipo.'}</p>{tab === 'guardados' && <button type="button" onClick={() => setTab('explorar')} className="mt-5 min-h-11 rounded-full bg-[#c45111] px-5 text-sm font-bold text-white">Explorar lugares</button>}</div>}
        {items.length > 0 && <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map(item => <FavoriteCard key={item.id_local} item={item} saved={savedIds.has(Number(item.id_local))} pending={pendingId === item.id_local} onToggle={toggle} />)}</div>}
        <p className="mt-10 text-sm text-[#526554]">¿Buscas un destino específico? <Link to="/buscar" className="font-bold text-[#c45111] hover:text-[#9d3e0b]">Ir a la búsqueda de lugares</Link></p>
      </main>
      <Footer />
    </div>
  )
}
