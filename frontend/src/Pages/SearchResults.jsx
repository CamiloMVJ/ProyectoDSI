import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Compass, ExternalLink, Filter, LoaderCircle, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import DepartmentDropdown from '../Components/DepartmentDropdown.jsx'
import { filterPlaces, getPlacesCatalog } from '../services/places.api.js'

const inputClass = 'min-h-11 w-full rounded-xl border border-[#d8e1d5] bg-[#f8faf6] px-4 text-sm text-[#25382e] outline-none focus:border-[#c45111] focus:ring-2 focus:ring-[#c45111]/15'
const PAGE_SIZE = 8

function SearchFilters({ applied, departments, onApply, onClear }) {
  const [filters, setFilters] = useState(() => ({
    q: applied.get('q') ?? '',
    departamento: applied.get('departamento') ?? '',
    municipio: applied.get('municipio') ?? '',
    tipo: applied.get('tipo') ?? 'todos',
    orden: applied.get('orden') ?? 'nombre-asc',
  }))

  function change(event) {
    const { name, value } = event.target
    setFilters(current => ({ ...current, [name]: value }))
  }

  function submit(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (filters.q.trim()) params.set('q', filters.q.trim())
    if (filters.departamento) params.set('departamento', filters.departamento)
    if (filters.municipio.trim()) params.set('municipio', filters.municipio.trim())
    if (filters.tipo !== 'todos') params.set('tipo', filters.tipo)
    if (filters.orden !== 'nombre-asc') params.set('orden', filters.orden)
    onApply(params)
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[#d8e1d5] bg-[#fffefa] p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3 border-b border-[#d8e1d5] pb-4">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#eaf0e7] text-[#344e3b]"><SlidersHorizontal size={20} aria-hidden="true" /></span>
        <div><h2 className="font-bold text-[#263f32]">Filtra tu búsqueda</h2><p className="text-xs text-[#526554]">Ajusta los resultados a tu viaje</p></div>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="search-query" className="mb-2 block text-sm font-semibold">¿Qué estás buscando?</label>
          <div className="relative"><Search size={17} aria-hidden="true" className="absolute left-4 top-3.5 text-[#657b65]" />
            <input id="search-query" name="q" value={filters.q} onChange={change} maxLength={150} placeholder="Lugar, actividad o destino" className={`${inputClass} pl-11`} />
          </div>
        </div>
        <div>
          <label htmlFor="search-department" className="mb-2 block text-sm font-semibold">Departamento o región</label>
          <DepartmentDropdown id="search-department" value={filters.departamento} departments={departments} onChange={value => setFilters(current => ({ ...current, departamento: value }))} />
        </div>
        <div>
          <label htmlFor="search-municipality" className="mb-2 block text-sm font-semibold">Municipio</label>
          <input id="search-municipality" name="municipio" value={filters.municipio} onChange={change} maxLength={100} placeholder="Cualquier municipio" className={inputClass} />
        </div>
        <div>
          <label htmlFor="search-type" className="mb-2 block text-sm font-semibold">Tipo de lugar</label>
          <select id="search-type" name="tipo" value={filters.tipo} onChange={change} className={inputClass}>
            <option value="todos">Todos los lugares</option>
            <option value="complejo">Complejos turísticos</option>
            <option value="atractivo">Atractivos independientes</option>
            <option value="otro">Otros lugares</option>
          </select>
        </div>
        <div>
          <label htmlFor="search-order" className="mb-2 block text-sm font-semibold">Ordenar por</label>
          <select id="search-order" name="orden" value={filters.orden} onChange={change} className={inputClass}>
            <option value="nombre-asc">Nombre: A a Z</option>
            <option value="nombre-desc">Nombre: Z a A</option>
            <option value="recientes">Agregados recientemente</option>
          </select>
        </div>
      </div>

      <button type="submit" className="mt-7 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#c45111] px-5 text-sm font-bold text-white hover:bg-[#9d3e0b]">
        <Filter size={17} aria-hidden="true" /> Aplicar filtros
      </button>
      <button type="button" onClick={onClear} className="mt-2 min-h-11 w-full rounded-xl text-sm font-semibold text-[#344e3b] hover:bg-[#f4f7f1]">Limpiar filtros</button>
    </form>
  )
}

const typeLabels = {
  complejo: 'Complejo turístico',
  atractivo: 'Atractivo independiente',
  otro: 'Lugar turístico',
}

function PlaceCard({ place }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#d8e1d5] bg-[#fffefa] shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-48 shrink-0 items-center justify-center bg-[#eaf0e7]">
        {place.url_imagen ? <img src={place.url_imagen} alt={place.nombre} className="h-full w-full object-cover" /> : <Compass size={42} aria-hidden="true" className="text-[#79927c]" />}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="inline-flex self-start rounded-full bg-[#f6eee5] px-3 py-1 text-xs font-bold text-[#9d3e0b]">{typeLabels[place.tipo] ?? typeLabels.otro}</span>
        <h3 className="mt-3 min-h-14 line-clamp-2 break-words text-lg leading-7 font-bold text-[#263f32]">{place.nombre}</h3>
        <p className="mt-2 flex min-h-10 items-start gap-2 text-sm leading-5 text-[#526554]"><MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0" /><span className="line-clamp-2">{[place.municipio, place.departamento].filter(Boolean).join(', ')}</span></p>
        <div className="mt-3 min-h-18">
          {place.descripcion && <p className="line-clamp-3 text-sm leading-6 text-[#526554]">{place.descripcion}</p>}
        </div>
        <div className="mt-3 min-h-15 border-t border-[#d8e1d5] pt-3">
          {place.direccion_exacta && <p className="line-clamp-2 text-xs leading-5 text-[#526554]">{place.direccion_exacta}</p>}
        </div>
        <div className="mt-auto flex min-h-11 items-center">
          {place.maps_link && <a href={place.maps_link} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#c45111] hover:text-[#9d3e0b]">Ver en Google Maps <ExternalLink size={15} aria-hidden="true" /></a>}
        </div>
      </div>
    </article>
  )
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filterParams = new URLSearchParams(searchParams)
  filterParams.delete('page')
  const filtersKey = filterParams.toString()
  const [retry, setRetry] = useState(0)
  const [catalog, setCatalog] = useState({ key: null, places: [], departments: [], error: '' })

  useEffect(() => {
    const controller = new AbortController()
    getPlacesCatalog(controller.signal)
      .then(data => { if (!controller.signal.aborted) setCatalog({ key: retry, ...data, error: '' }) })
      .catch(error => {
        if (!controller.signal.aborted) setCatalog({ key: retry, places: [], departments: [], error: error instanceof TypeError ? 'No se pudo conectar con el servidor.' : error.message })
      })
    return () => controller.abort()
  }, [retry])

  const places = useMemo(() => filterPlaces(catalog.places, Object.fromEntries(new URLSearchParams(filtersKey))), [catalog.places, filtersKey])
  const loading = catalog.key !== retry
  const hasFilters = Boolean(filtersKey)
  const totalPages = Math.max(1, Math.ceil(places.length / PAGE_SIZE))
  const requestedPage = Number(searchParams.get('page'))
  const currentPage = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, totalPages)
    : 1
  const visiblePlaces = places.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)

  function goToPage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return
    setSearchParams(current => {
      const next = new URLSearchParams(current)
      if (page === 1) next.delete('page')
      else next.set('page', String(page))
      return next
    })
    document.getElementById('results-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div id="inicio" className="flex min-h-screen flex-col bg-[#f6f8f3] text-[#25382e]">
      <Navbar />
      <main className="w-full flex-1 px-6 pt-10 sm:px-10 sm:pt-14 lg:px-12 2xl:px-16">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#344e3b] hover:text-[#c45111]"><ArrowLeft size={17} aria-hidden="true" /> Volver al inicio</Link>
        <header className="mt-5 border-b border-[#d8e1d5] pb-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c45111]">Explora Nicaragua</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#263f32] sm:text-4xl">Encuentra tu próximo destino</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#526554] sm:text-base">Busca lugares turísticos y usa los filtros para encontrar experiencias a tu medida.</p>
        </header>

        <div id="explorar" className="mt-8 grid scroll-mt-28 items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside aria-label="Filtros de búsqueda">
            <SearchFilters key={filtersKey} applied={searchParams} departments={catalog.departments} onApply={setSearchParams} onClear={() => setSearchParams({})} />
          </aside>

          <section aria-labelledby="results-title" className="min-w-0">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-widest text-[#c45111]">Lugares para descubrir</p><h2 id="results-title" className="mt-1 scroll-mt-28 text-2xl font-bold text-[#263f32]">Resultados de búsqueda</h2></div>
              {!loading && !catalog.error && <span role="status" className="rounded-full bg-[#eaf0e7] px-3 py-2 text-xs font-bold text-[#344e3b]">{places.length} {places.length === 1 ? 'lugar' : 'lugares'}</span>}
            </div>

            {loading && <p role="status" className="flex items-center gap-3 rounded-2xl border border-[#d8e1d5] bg-white p-8 text-sm text-[#526554]"><LoaderCircle size={20} aria-hidden="true" className="animate-spin" /> Buscando lugares…</p>}
            {!loading && catalog.error && <div role="alert" className="rounded-2xl border border-[#e9c7b6] bg-[#fff0e9] p-8"><p className="text-sm text-[#9d3e0b]">{catalog.error}</p><button type="button" onClick={() => setRetry(value => value + 1)} className="mt-4 min-h-11 rounded-full bg-[#c45111] px-5 text-sm font-bold text-white hover:bg-[#9d3e0b]">Reintentar</button></div>}
            {!loading && !catalog.error && places.length === 0 && <div className="rounded-2xl border border-[#d8e1d5] bg-white px-6 py-12 text-center"><Search size={32} aria-hidden="true" className="mx-auto text-[#79927c]" /><h3 className="mt-4 text-lg font-bold">No encontramos lugares con esos filtros</h3><p className="mt-2 text-sm text-[#526554]">Prueba con otro término o amplía tu búsqueda.</p>{hasFilters && <button type="button" onClick={() => setSearchParams({})} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#c45111] px-5 text-sm font-bold text-white hover:bg-[#9d3e0b]">Ver todos los lugares <ArrowRight size={16} aria-hidden="true" /></button>}</div>}
            {!loading && !catalog.error && places.length > 0 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {visiblePlaces.map(place => <PlaceCard key={place.id_lugar} place={place} />)}
                </div>
                {totalPages > 1 && (
                  <nav aria-label="Paginación de resultados" className="mt-8 flex flex-wrap items-center justify-center gap-2 pb-4">
                    <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="min-h-11 rounded-xl border border-[#d8e1d5] bg-white px-4 text-sm font-semibold text-[#344e3b] hover:bg-[#eaf0e7] disabled:cursor-not-allowed disabled:opacity-50">Anterior</button>
                    {pageNumbers.map((page, index) => (
                      <div key={page} className="flex items-center gap-2">
                        {index > 0 && page - pageNumbers[index - 1] > 1 && <span aria-hidden="true" className="px-1 text-[#526554]">…</span>}
                        <button type="button" onClick={() => goToPage(page)} aria-label={`Página ${page}`} aria-current={page === currentPage ? 'page' : undefined} className={`min-h-11 min-w-11 rounded-xl border px-3 text-sm font-semibold ${page === currentPage ? 'border-[#c45111] bg-[#c45111] text-white' : 'border-[#d8e1d5] bg-white text-[#344e3b] hover:bg-[#eaf0e7]'}`}>{page}</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="min-h-11 rounded-xl border border-[#d8e1d5] bg-white px-4 text-sm font-semibold text-[#344e3b] hover:bg-[#eaf0e7] disabled:cursor-not-allowed disabled:opacity-50">Siguiente</button>
                  </nav>
                )}
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
