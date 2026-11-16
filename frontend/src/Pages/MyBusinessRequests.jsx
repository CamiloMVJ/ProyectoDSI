import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, CalendarDays, ClipboardList, ExternalLink, FileText, LoaderCircle, MapPin } from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getMyBusinessRequests, getMyBusinessDocumentUrl } from '../services/businessRequests.api.js'

const fecha = valor => {
  if (!valor) return 'Fecha no disponible'
  const date = new Date(valor)
  return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : new Intl.DateTimeFormat('es-NI', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

const estadoClass = {
  Pendiente: 'bg-[#fff2df] text-[#87500c]',
  Aprobada: 'bg-[#eaf0e7] text-[#344e3b]',
  Rechazada: 'bg-[#fff0e9] text-[#9d3e0b]',
}

export default function MyBusinessRequests() {
  const { sesion } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [abierta, setAbierta] = useState(null)
  const [visor, setVisor] = useState(null)

  async function mostrarDocumento(solicitud, documento) {
    const key = `${solicitud.id_solicitud}:${documento.id_documento}`
    setVisor({ key, nombre: documento.nombre_archivo || documento.tipo_documento || 'Documento', cargando: true })
    try {
      const result = await getMyBusinessDocumentUrl(sesion.token, solicitud.id_solicitud, documento.id_documento)
      setVisor(current => current?.key === key ? { ...current, cargando: false, url: result.url } : current)
    } catch {
      setVisor(current => current?.key === key ? { ...current, cargando: false, error: 'No se pudo abrir el documento. Inténtalo de nuevo.' } : current)
    }
  }

  useEffect(() => {
    if (!sesion?.token) return
    const controller = new AbortController()
    getMyBusinessRequests(sesion.token, controller.signal)
      .then(data => { setSolicitudes(data); setError('') })
      .catch(() => { if (!controller.signal.aborted) setError('No pudimos cargar tus solicitudes. Inténtalo de nuevo más tarde.') })
      .finally(() => { if (!controller.signal.aborted) setCargando(false) })
    return () => controller.abort()
  }, [sesion])

  if (!sesion) return <Navigate to="/ingresar" replace state={{ from: '/mis-solicitudes' }} />
  if (!['Usuario', 'Propietario'].includes(sesion.usuario.rol)) return <Navigate to="/account" replace />

  return (
    <div id="inicio" className="flex min-h-screen flex-col bg-[#f6f8f3] text-[#25382e]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-10 sm:px-10 sm:pt-14">
        <Link to="/account" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)]">
          <ArrowLeft size={18} aria-hidden="true" /> Volver a mi cuenta
        </Link>
        <header className="mb-9 mt-4 border-b border-[var(--color-border)] pb-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-accent)]">Tu espacio en SINATUR</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Mis solicitudes de negocio</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">Consulta el estado de tus registros y revisa la información que enviaste.</p>
        </header>

        {cargando && <p role="status" className="flex items-center gap-3 py-10 text-sm text-[var(--color-text-muted)]"><LoaderCircle size={20} className="animate-spin" aria-hidden="true" /> Cargando tus solicitudes…</p>}
        {error && <p role="alert" className="rounded-xl bg-[#fff0e9] p-4 text-sm text-[#9d3e0b]">{error}</p>}
        {!cargando && !error && solicitudes.length === 0 && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-sm">
            <ClipboardList size={36} className="mx-auto text-[var(--color-primary)]" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold">Aún no tienes solicitudes</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">Cuando solicites el registro de un negocio, podrás seguirlo aquí.</p>
            <Link to="/registro-negocio" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--color-accent-hover)]">Registrar un negocio <ArrowRight size={17} aria-hidden="true" /></Link>
          </section>
        )}
        {!cargando && !error && solicitudes.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-muted)]">{solicitudes.length} {solicitudes.length === 1 ? 'solicitud' : 'solicitudes'}</p>
            {solicitudes.map(solicitud => {
              const expanded = abierta === solicitud.id_solicitud
              return (
                <article key={solicitud.id_solicitud} className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
                  <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div className="flex min-w-0 gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e7] text-[var(--color-primary)]"><Building2 size={24} aria-hidden="true" /></span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">Solicitud #{solicitud.id_solicitud}</p>
                        <h2 className="mt-1 break-words text-xl font-bold">{solicitud.nombre_negocio}</h2>
                        <p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-muted)]"><CalendarDays size={16} aria-hidden="true" /> {fecha(solicitud.fecha_solicitud)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <span className={`rounded-full px-3 py-2 text-xs font-bold ${estadoClass[solicitud.estado] || 'bg-[#f4f7f1] text-[#526554]'}`}>{solicitud.estado}</span>
                      <button type="button" aria-expanded={expanded} aria-controls={`solicitud-detalles-${solicitud.id_solicitud}`} onClick={() => { setAbierta(expanded ? null : solicitud.id_solicitud); setVisor(null) }} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-muted)]">
                        {expanded ? 'Ocultar detalles' : 'Ver detalles'} <ArrowRight size={17} className={expanded ? 'rotate-90' : ''} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {expanded && <div id={`solicitud-detalles-${solicitud.id_solicitud}`} className="grid gap-6 border-t border-[var(--color-border)] bg-[#fbfcf9] p-6 sm:grid-cols-2 sm:p-8">
                    <div><h3 className="flex items-center gap-2 font-bold"><FileText size={19} aria-hidden="true" /> Datos del negocio</h3><dl className="mt-4 space-y-3 text-sm"><div><dt className="font-semibold text-[var(--color-text-muted)]">Número RUC</dt><dd className="mt-1 break-words">{solicitud.codigo_ruc}</dd></div><div><dt className="font-semibold text-[var(--color-text-muted)]">Descripción</dt><dd className="mt-1 whitespace-pre-wrap break-words">{solicitud.descripcion || 'No proporcionada'}</dd></div></dl></div>
                    <div><h3 className="flex items-center gap-2 font-bold"><MapPin size={19} aria-hidden="true" /> Ubicación</h3><dl className="mt-4 space-y-3 text-sm"><div><dt className="font-semibold text-[var(--color-text-muted)]">Departamento o región</dt><dd className="mt-1">{solicitud.nombre_departamento}</dd></div><div><dt className="font-semibold text-[var(--color-text-muted)]">Municipio</dt><dd className="mt-1 break-words">{solicitud.municipio}</dd></div><div><dt className="font-semibold text-[var(--color-text-muted)]">Dirección exacta</dt><dd className="mt-1 whitespace-pre-wrap break-words">{solicitud.direccion_exacta}</dd></div></dl></div>
                    <section className="sm:col-span-2" aria-label="Documentos adjuntos">
                      <h3 className="flex items-center gap-2 font-bold"><FileText size={19} aria-hidden="true" /> Documentos adjuntos</h3>
                      {solicitud.documentos?.length ? (
                        <ul className="mt-4 space-y-3">
                          {solicitud.documentos.map(documento => (
                            <li key={documento.id_documento} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                              <span className="min-w-0 text-sm"><strong className="block">{documento.tipo_documento || 'Documento'}</strong><span className="break-all text-[var(--color-text-muted)]">{documento.nombre_archivo || 'Archivo PDF'}</span></span>
                              <button type="button" onClick={() => mostrarDocumento(solicitud, documento)} className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-border)] px-5 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-muted)]">Visualizar PDF</button>
                            </li>
                          ))}
                        </ul>
                      ) : <p className="mt-3 text-sm text-[var(--color-text-muted)]">No se adjuntaron documentos a esta solicitud.</p>}
                      {visor?.key.startsWith(`${solicitud.id_solicitud}:`) && (
                        <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                          {visor.cargando && <p role="status" className="text-sm text-[var(--color-text-muted)]">Preparando documento…</p>}
                          {visor.error && <p role="alert" className="text-sm text-[#9d3e0b]">{visor.error}</p>}
                          {visor.url && <><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><p className="break-all text-sm font-bold">{visor.nombre}</p><a href={visor.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)]">Abrir en otra pestaña <ExternalLink size={16} aria-hidden="true" /></a></div><iframe title={`Vista previa de ${visor.nombre}`} src={visor.url} className="h-[65vh] min-h-96 w-full rounded-lg border border-[var(--color-border)]" /></>}
                        </div>
                      )}
                    </section>
                  </div>}
                </article>
              )
            })}
          </div>
        )}
      </main>
      <Footer homeHref="/" />
    </div>
  )
}
