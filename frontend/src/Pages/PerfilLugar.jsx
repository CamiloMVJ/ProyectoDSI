import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, Phone, Clock, DollarSign, CheckCircle2, Image as ImageIcon, Loader2, Star, Info, Map, Utensils, ShieldAlert } from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import { getLugarTuristicoById } from '../services/PerfilLugar.api.js' 

export default function PerfilLugar() {
  const { id } = useParams()
  const [lugar, setLugar] = useState(null)
  const [imagenActiva, setImagenActiva] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setCargando(true)
    setError(null)

    getLugarTuristicoById(id, controller.signal)
      .then(data => {
        console.log(id)
        if (controller.signal.aborted) return
        setLugar(data)
        if (data?.imagenes?.length > 0) {
          setImagenActiva(data.imagenes[0])
        }
        setCargando(false)
      })
      .catch(cause => {
        if (!controller.signal.aborted) {
          setError(cause.message || 'No se pudo cargar la información del lugar')
          setCargando(false)
        }
      })

    return () => controller.abort()
  }, [id])

  if (cargando) return (
    <div className="flex min-h-screen flex-col bg-[#f6f8f3]">
      <Navbar />
      <div className="flex flex-grow items-center justify-center"><Loader2 size={40} className="animate-spin text-[#c45111]" /></div>
      <Footer />
    </div>
  )

  if (error || !lugar) return (
    <div className="flex min-h-screen flex-col bg-[#f6f8f3]">
      <Navbar />
      <div className="flex flex-grow items-center justify-center font-bold text-[#526554]">{error || "No se encontró el lugar"}</div>
      <Footer />
    </div>
  )

  const renderStars = (rating) => [...Array(5)].map((_, i) => <Star key={i} size={16} className={i < rating ? 'fill-[#c45111] text-[#c45111]' : 'text-[#d8e1d5]'} />)

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8f3] text-[#25382e]">
      <Navbar />
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-10 sm:px-10 sm:pt-14">
        {/* ENCABEZADO */}
        <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-[#f6eee5] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#9d3e0b]">
                {lugar.tipo_local?.replace('_', ' ') || 'Lugar'}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-[#526554]">
                <MapPin size={16} /> {lugar.municipio}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#263f32] sm:text-5xl">{lugar.nombre}</h1>
          </div>
          {lugar.promedio_calificacion && (
            <div className="flex flex-col items-end rounded-2xl border border-[#d8e1d5] bg-white px-4 py-2 shadow-sm">
              <div className="mb-1 flex items-center gap-1">{renderStars(Math.round(lugar.promedio_calificacion))}</div>
              <span className="text-xs font-bold text-[#526554]">{lugar.resenas?.length || 0} Reseñas</span>
            </div>
          )}
        </header>

        {/* GALERÍA MULTIMEDIA */}
        <section className="mb-12">
          <div className="mb-4 flex h-[300px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#eaf0e7] shadow-sm sm:h-[450px]">
            {imagenActiva ? (
              <img src={imagenActiva} alt={lugar.nombre} className="h-full w-full object-cover transition-opacity duration-500" />
            ) : (
              <ImageIcon size={64} className="text-[#79927c]" />
            )}
          </div>
          {lugar.imagenes && lugar.imagenes.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {lugar.imagenes.map((img, idx) => (
                <button key={idx} type="button" onClick={() => setImagenActiva(img)} className={`h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-24 sm:w-32 ${imagenActiva === img ? 'border-[#c45111] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt={`Miniatura ${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* CUADRÍCULA DE INFORMACIÓN */}
        <div className="grid gap-10 lg:grid-cols-3">
          
          {/* COLUMNA IZQUIERDA (Info Principal) */}
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="mb-4 flex items-center gap-2 border-b border-[#d8e1d5] pb-2 text-2xl font-bold text-[#263f32]">
                <Info size={24} className="text-[#c45111]" /> Descripción
              </h2>
              <p className="whitespace-pre-wrap leading-relaxed text-[#526554]">{lugar.descripcion}</p>
            </section>

            {lugar.tipo_local === 'atractivo_independiente' && lugar.normativa_visitantes && (
              <section className="rounded-2xl border border-[#f6eee5] bg-[#fffefa] p-6 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-[#263f32]">
                  <ShieldAlert size={24} className="text-[#c45111]" /> Normativas y Acceso
                </h2>
                <p className="mb-2 text-sm font-bold text-[#9d3e0b]">Acceso: {lugar.tipo_acceso}</p>
                <p className="whitespace-pre-wrap text-sm text-[#526554]">{lugar.normativa_visitantes}</p>
              </section>
            )}

            {lugar.menus && lugar.menus.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 border-b border-[#d8e1d5] pb-2 text-2xl font-bold text-[#263f32]">
                  <Utensils size={24} className="text-[#c45111]" /> Menú
                </h2>
                {lugar.menus.map((menu, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="mb-3 text-lg font-bold text-[#263f32]">{menu.titulo_menu}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {menu.items?.map((item, i) => (
                        <div key={i} className="flex justify-between gap-4 rounded-xl border border-[#d8e1d5] bg-white p-4 shadow-sm">
                          <div>
                            <h4 className="text-sm font-bold text-[#263f32]">{item.nombre_platillo}</h4>
                            <p className="mt-1 text-xs text-[#526554]">{item.descripcion}</p>
                            <span className="mt-2 inline-block rounded-full bg-[#f6f8f3] px-2 py-1 text-[10px] text-[#526554]">{item.categoria}</span>
                          </div>
                          <span className="font-bold text-[#c45111]">C$ {item.precio}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {lugar.servicios && lugar.servicios.length > 0 && (
              <section>
                <h2 className="mb-4 border-b border-[#d8e1d5] pb-2 text-2xl font-bold text-[#263f32]">Servicios y Facilidades</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {lugar.servicios.map((servicio, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-xl border border-[#d8e1d5] bg-white p-4 shadow-sm">
                      <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#79927c]" />
                      <div>
                        <span className="block text-sm font-bold text-[#263f32]">{servicio.nombre_servicio}</span>
                        {servicio.precio > 0 && <span className="text-xs font-bold text-[#c45111]">C$ {servicio.precio}</span>}
                        {servicio.incluye && <p className="mt-1 text-xs text-[#526554]">{servicio.incluye}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {lugar.resenas && lugar.resenas.length > 0 && (
              <section>
                <h2 className="mb-4 border-b border-[#d8e1d5] pb-2 text-2xl font-bold text-[#263f32]">Reseñas de Usuarios</h2>
                <div className="space-y-4">
                  {lugar.resenas.map((resena) => (
                    <div key={resena.id_resena} className="rounded-2xl border border-[#d8e1d5] bg-white p-5 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-bold text-[#263f32]">{resena.usuario}</span>
                        <span className="text-xs text-[#657b65]">{new Date(resena.fecha_publicacion).toLocaleDateString()}</span>
                      </div>
                      <div className="mb-3 flex items-center gap-1">{renderStars(resena.calificacion)}</div>
                      <p className="text-sm text-[#526554]">{resena.comentario}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* COLUMNA DERECHA (Tarjetas Laterales) */}
          <div className="space-y-6">
            
            {(lugar.precio_minimo || lugar.costo_entrada) && (
              <div className="rounded-2xl border border-[#d8e1d5] bg-white p-6 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign size={24} className="text-[#c45111]" />
                  <h3 className="text-xl font-bold text-[#263f32]">{lugar.costo_entrada ? 'Costo de Entrada' : 'Rango de Precios'}</h3>
                </div>
                {lugar.precio_minimo && lugar.precio_maximo ? (
                  <p className="font-bold text-[#526554]">C$ {lugar.precio_minimo} - C$ {lugar.precio_maximo} <span className="mt-1 block text-xs font-normal text-[#657b65]">(Promedio calculado)</span></p>
                ) : (
                  <p className="font-bold text-[#526554]">C$ {lugar.costo_entrada}</p>
                )}
              </div>
            )}

            {lugar.horarios && lugar.horarios.length > 0 && (
              <div className="rounded-2xl border border-[#d8e1d5] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Clock size={24} className="text-[#c45111]" />
                  <h3 className="text-xl font-bold text-[#263f32]">Horarios</h3>
                </div>
                <ul className="space-y-3">
                  {lugar.horarios.map((h, idx) => (
                    <li key={idx} className="flex flex-col border-b border-[#eaf0e7] pb-2 last:border-0 last:pb-0">
                      <span className="text-sm font-bold text-[#263f32]">{h.dia_semana}</span>
                      <span className="text-sm text-[#526554]">{h.hora_apertura} - {h.hora_cierre}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl bg-[#263f32] p-6 text-white shadow-md">
              <h3 className="mb-4 text-xl font-bold">Ubicación y Contacto</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-[#c45111]" />
                  <span className="text-sm text-[#eaf0e7]">{lugar.direccion_exacta}</span>
                </li>
              </ul>
              {lugar.maps_link && (
                <a href={lugar.maps_link} target="_blank" rel="noopener noreferrer" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c45111] px-4 py-3 font-bold text-white transition-colors hover:bg-[#9d3e0b]">
                   Ver en Google Maps
                </a>
              )}
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}