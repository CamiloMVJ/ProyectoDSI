import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, ArrowRight, Building2, CalendarDays, CheckCircle2, ClipboardList, ExternalLink, FileText, IdCard, LoaderCircle, MapPin, Tags, XCircle } from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { decideBusinessRequest, getAdminBusinessDocumentUrl, getAdminBusinessRequests } from '../services/businessRequests.api.js'

const estados = ['Pendiente', 'Aprobada', 'Rechazada']
const badgeClass = {
  Pendiente: 'bg-[#fff2df] text-[#87500c]',
  Aprobada: 'bg-[#eaf0e7] text-[#344e3b]',
  Rechazada: 'bg-[#fff0e9] text-[#9d3e0b]',
}

function fecha(valor) {
  if (!valor) return 'Fecha no disponible'
  const date = new Date(valor)
  return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : new Intl.DateTimeFormat('es-NI', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function Field({ label, value }) {
  return <div><dt className="font-semibold text-[var(--color-text-muted)]">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words">{value || 'No proporcionado'}</dd></div>
}

function WebLink({ value }) {
  if (!value) return 'No proporcionado'
  let href
  try {
    const url = new URL(value)
    if (['http:', 'https:'].includes(url.protocol)) href = url.href
  } catch { /* Conservar el texto si el enlace no es válido. */ }
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 break-all font-semibold text-[var(--color-primary)] underline underline-offset-2 hover:text-[var(--color-accent)]">{value}<ExternalLink size={15} className="shrink-0" aria-hidden="true" /></a> : value
}

function RequestDetails({ solicitud, token }) {
  const [visor, setVisor] = useState(null)

  async function mostrarDocumento(documento) {
    const key = documento.id_documento
    setVisor({ key, nombre: documento.nombre_archivo || documento.tipo_documento || 'Documento', cargando: true })
    try {
      const result = await getAdminBusinessDocumentUrl(token, solicitud.id_solicitud, key)
      setVisor(current => current?.key === key ? { ...current, cargando: false, url: result.url } : current)
    } catch {
      setVisor(current => current?.key === key ? { ...current, cargando: false, error: 'No se pudo abrir el PDF. Inténtalo de nuevo.' } : current)
    }
  }

  return <div id={`admin-solicitud-detalles-${solicitud.id_solicitud}`} className="grid gap-7 border-t border-[var(--color-border)] bg-[#fbfcf9] p-6 md:grid-cols-2 sm:p-8">
    <section><h3 className="flex items-center gap-2 font-bold"><IdCard size={19} aria-hidden="true" /> Identidad legal y del titular</h3><dl className="mt-4 space-y-3 text-sm"><Field label="Solicitante" value={solicitud.nombre_solicitante} /><Field label="Correo de la cuenta" value={solicitud.correo_solicitante} /><Field label="Tipo de persona" value={solicitud.tipo_persona} /><Field label="Cédula del solicitante" value={solicitud.numero_cedula_solicitante} /><Field label="Número RUC" value={solicitud.codigo_ruc} /><Field label="Razón social" value={solicitud.razon_social} /></dl></section>
    <section><h3 className="flex items-center gap-2 font-bold"><Building2 size={19} aria-hidden="true" /> Perfil y contacto</h3><dl className="mt-4 space-y-3 text-sm"><Field label="Nombre comercial" value={solicitud.nombre_negocio} /><div><dt className="font-semibold text-[var(--color-text-muted)]">Rubros</dt><dd className="mt-2 flex flex-wrap gap-2">{solicitud.categorias?.length ? solicitud.categorias.map(categoria => <span key={categoria.id_categoria} className="inline-flex items-center gap-1 rounded-full bg-[#eaf0e7] px-3 py-1 text-xs font-semibold text-[var(--color-primary-deep)]"><Tags size={13} aria-hidden="true" />{categoria.nombre}</span>) : 'No proporcionados'}</dd></div><Field label="Descripción" value={solicitud.descripcion} /><Field label="Teléfono o WhatsApp" value={solicitud.telefono_contacto} /><Field label="Correo del negocio" value={solicitud.correo_contacto} /><Field label="Sitio web o red social" value={<WebLink value={solicitud.sitio_web} />} /></dl></section>
    <section className="border-t border-[var(--color-border)] pt-6 md:col-span-2"><h3 className="flex items-center gap-2 font-bold"><MapPin size={19} aria-hidden="true" /> Ubicación</h3><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><Field label="Modalidad" value={solicitud.es_independiente === true ? 'Local independiente' : solicitud.es_independiente === false ? 'Dentro de un complejo turístico' : null} />{solicitud.es_independiente === false && <Field label="Complejo turístico" value={solicitud.nombre_complejo || (solicitud.id_complejo_padre ? `Complejo #${solicitud.id_complejo_padre}` : null)} />}<Field label="Departamento o región" value={solicitud.nombre_departamento} /><Field label="Municipio" value={solicitud.municipio} /><Field label="Dirección exacta" value={solicitud.direccion_exacta} /><Field label="Google Maps" value={<WebLink value={solicitud.maps_link} />} /></dl></section>
    <section className="border-t border-[var(--color-border)] pt-6 md:col-span-2" aria-label="Documentos adjuntos"><h3 className="flex items-center gap-2 font-bold"><FileText size={19} aria-hidden="true" /> Documentos adjuntos</h3>
      {solicitud.documentos?.length ? <ul className="mt-4 space-y-3">{solicitud.documentos.map(documento => <li key={documento.id_documento} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-white p-4"><span className="min-w-0 text-sm"><strong className="block">{documento.tipo_documento || 'Documento'}</strong><span className="break-all text-[var(--color-text-muted)]">{documento.nombre_archivo || 'Archivo PDF'}</span></span><button type="button" onClick={() => mostrarDocumento(documento)} className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-border)] px-5 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-muted)]">Visualizar PDF</button></li>)}</ul> : <p className="mt-3 text-sm text-[var(--color-text-muted)]">No se adjuntaron documentos a esta solicitud.</p>}
      {visor && <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-white p-4">{visor.cargando && <p role="status" className="text-sm text-[var(--color-text-muted)]">Preparando documento…</p>}{visor.error && <p role="alert" className="text-sm text-[#9d3e0b]">{visor.error}</p>}{visor.url && <><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><p className="break-all text-sm font-bold">{visor.nombre}</p><a href={visor.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)]">Abrir en otra pestaña <ExternalLink size={16} aria-hidden="true" /></a></div><iframe title={`Vista previa de ${visor.nombre}`} src={visor.url} className="h-[65vh] min-h-96 w-full rounded-lg border border-[var(--color-border)]" /></>}</div>}
    </section>
  </div>
}

export default function AdminBusinessRequests() {
  const { sesion } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [filtro, setFiltro] = useState('Pendiente')
  const [abierta, setAbierta] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const [guardando, setGuardando] = useState(null)

  useEffect(() => {
    if (!sesion?.token || sesion.usuario.rol !== 'Administrador') return
    const controller = new AbortController()
    getAdminBusinessRequests(sesion.token, controller.signal)
      .then(data => { setSolicitudes(data); setError('') })
      .catch(() => { if (!controller.signal.aborted) setError('No pudimos cargar las solicitudes. Actualiza la página para reintentar.') })
      .finally(() => { if (!controller.signal.aborted) setCargando(false) })
    return () => controller.abort()
  }, [sesion])

  if (!sesion) return <Navigate to="/ingresar" replace state={{ from: '/admin/solicitudes' }} />
  if (sesion.usuario.rol !== 'Administrador') return <Navigate to="/account" replace />

  async function decidir(solicitud) {
    if (!confirmacion || guardando || solicitud.estado !== 'Pendiente') return
    const estado = confirmacion.estado
    setGuardando(solicitud.id_solicitud)
    setError('')
    setAviso('')
    try {
      await decideBusinessRequest(sesion.token, solicitud.id_solicitud, estado)
      setSolicitudes(current => current.map(item => item.id_solicitud === solicitud.id_solicitud ? { ...item, estado } : item))
      setAviso(estado === 'Aprobada' ? `La solicitud #${solicitud.id_solicitud} fue aprobada. El establecimiento se creó sin publicar.` : `La solicitud #${solicitud.id_solicitud} fue rechazada.`)
      setConfirmacion(null)
    } catch (decisionError) {
      setError(decisionError.message || 'No se pudo guardar la decisión.')
      if (decisionError.status === 409) {
        setConfirmacion(null)
        try {
          const actualizadas = await getAdminBusinessRequests(sesion.token)
          setSolicitudes(actualizadas)
        } catch { /* El aviso anterior indica que se debe actualizar la página. */ }
      }
    } finally {
      setGuardando(null)
    }
  }

  const visibles = solicitudes.filter(solicitud => solicitud.estado === filtro)

  return <div id="inicio" className="flex min-h-screen flex-col bg-[#f6f8f3] text-[#25382e]">
    <Navbar />
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-10 sm:px-10 sm:pt-14">
      <Link to="/account" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)]"><ArrowLeft size={18} aria-hidden="true" /> Volver a mi cuenta</Link>
      <header className="mb-8 mt-4 border-b border-[var(--color-border)] pb-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-accent)]">Administración SINATUR</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Solicitudes de negocio</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">Revisa los datos y documentos enviados antes de aprobar o rechazar cada solicitud.</p></header>
      {cargando && <p role="status" className="flex items-center gap-3 py-10 text-sm text-[var(--color-text-muted)]"><LoaderCircle size={20} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> Cargando solicitudes…</p>}
      {error && <p role="alert" className="mb-5 flex items-start gap-2 rounded-xl bg-[#fff0e9] p-4 text-sm text-[#9d3e0b]"><AlertCircle size={18} className="shrink-0" aria-hidden="true" />{error}</p>}
      {aviso && <p role="status" className="mb-5 flex items-start gap-2 rounded-xl bg-[#eaf0e7] p-4 text-sm text-[#344e3b]"><CheckCircle2 size={18} className="shrink-0" aria-hidden="true" />{aviso}</p>}
      <Link to="/gestion-establecimientos" className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)]">Gestionar establecimientos <ArrowRight size={17} aria-hidden="true" /></Link>
      {!cargando && solicitudes.length > 0 && <><div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar solicitudes por estado">{estados.map(estado => <button key={estado} type="button" aria-pressed={filtro === estado} onClick={() => { setFiltro(estado); setConfirmacion(null) }} className={`min-h-11 rounded-full border px-4 text-sm font-bold transition-colors ${filtro === estado ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-[var(--color-border)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-muted)]'}`}>{estado} <span className="ml-1 opacity-80">{solicitudes.filter(item => item.estado === estado).length}</span></button>)}</div>
        {visibles.length === 0 ? <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center text-sm text-[var(--color-text-muted)]">No hay solicitudes {filtro.toLowerCase()}s.</div> : <div className="space-y-4">{visibles.map(solicitud => {
          const expanded = abierta === solicitud.id_solicitud
          const pending = solicitud.estado === 'Pendiente'
          const confirming = confirmacion?.id === solicitud.id_solicitud
          return <article key={solicitud.id_solicitud} className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div className="flex min-w-0 gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e7] text-[var(--color-primary)]"><Building2 size={24} aria-hidden="true" /></span><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">Solicitud #{solicitud.id_solicitud}</p><h2 className="mt-1 break-words text-xl font-bold">{solicitud.nombre_negocio}</h2><p className="mt-1 break-words text-sm text-[var(--color-text-muted)]">{solicitud.nombre_solicitante || 'Solicitante'}</p><p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-muted)]"><CalendarDays size={16} aria-hidden="true" />{fecha(solicitud.fecha_solicitud)}</p></div></div><div className="flex flex-wrap items-center gap-3 sm:justify-end"><span className={`rounded-full px-3 py-2 text-xs font-bold ${badgeClass[solicitud.estado] || 'bg-[#f4f7f1] text-[#526554]'}`}>{solicitud.estado}</span><button type="button" aria-expanded={expanded} aria-controls={`admin-solicitud-detalles-${solicitud.id_solicitud}`} onClick={() => setAbierta(expanded ? null : solicitud.id_solicitud)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-muted)]">{expanded ? 'Ocultar detalles' : 'Ver detalles'}<ArrowRight size={17} className={expanded ? 'rotate-90' : ''} aria-hidden="true" /></button></div></div>
            {expanded && <RequestDetails solicitud={solicitud} token={sesion.token} />}
            {pending && <div className="border-t border-[var(--color-border)] px-6 py-5 sm:px-8">{confirming ? <div className="rounded-xl border border-[#e8d8c0] bg-[#fff9ef] p-4"><p className="font-bold">¿{confirmacion.estado === 'Aprobada' ? 'Aprobar' : 'Rechazar'} esta solicitud?</p><p className="mt-1 text-sm text-[var(--color-text-muted)]">Revisa los detalles y documentos antes de confirmar. Esta decisión no se puede cambiar desde aquí.</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={Boolean(guardando)} onClick={() => decidir(solicitud)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 text-sm font-bold text-white hover:bg-[var(--color-primary-deep)] disabled:opacity-60">{guardando === solicitud.id_solicitud ? <LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <CheckCircle2 size={17} aria-hidden="true" />}Confirmar {confirmacion.estado === 'Aprobada' ? 'aprobación' : 'rechazo'}</button><button type="button" disabled={Boolean(guardando)} onClick={() => setConfirmacion(null)} className="min-h-11 rounded-full border border-[var(--color-border)] px-5 text-sm font-bold text-[var(--color-primary)] hover:bg-white disabled:opacity-60">Cancelar</button></div></div> : <div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setAbierta(solicitud.id_solicitud); setConfirmacion({ id: solicitud.id_solicitud, estado: 'Aprobada' }); setError('') }} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 text-sm font-bold text-white hover:bg-[var(--color-primary-deep)]"><CheckCircle2 size={18} aria-hidden="true" />Aprobar</button><button type="button" onClick={() => { setAbierta(solicitud.id_solicitud); setConfirmacion({ id: solicitud.id_solicitud, estado: 'Rechazada' }); setError('') }} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#e5bda9] px-5 text-sm font-bold text-[#9d3e0b] hover:bg-[#fff0e9]"><XCircle size={18} aria-hidden="true" />Rechazar</button></div>}</div>}
          </article>
        })}</div>}</>}
      {!cargando && !error && solicitudes.length === 0 && <section className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm"><ClipboardList size={36} className="mx-auto text-[var(--color-primary)]" aria-hidden="true" /><h2 className="mt-4 text-xl font-bold">Aún no hay solicitudes</h2><p className="mt-2 text-sm text-[var(--color-text-muted)]">Las solicitudes de registro aparecerán aquí cuando se envíen.</p></section>}
    </main>
    <Footer homeHref="/" />
  </div>
}
