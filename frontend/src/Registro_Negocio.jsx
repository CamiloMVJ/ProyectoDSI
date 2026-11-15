import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, Compass, FileText, MapPin, ShieldCheck, Upload } from 'lucide-react'
import { useAuth } from './hooks/useAuth.js'
import DepartmentDropdown from './Components/DepartmentDropdown.jsx'
import { createBusinessRequest, getDepartments } from './services/businessRequests.api.js'
import { uploadStorageFile } from './services/uploads.api.js'

const initialValues = {
  nombre_negocio: '', codigo_ruc: '', descripcion: '',
  municipio: '', direccion_exacta: '', id_departamento: '',
}

export default function RegistroNegocioSINATUR() {
  const { sesion } = useAuth()
  const [values, setValues] = useState(initialValues)
  const [departamentos, setDepartamentos] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [documentos, setDocumentos] = useState({ ruc: null, permiso: null })
  const [subidos, setSubidos] = useState({ ruc: false, permiso: false })
  const [solicitudCreada, setSolicitudCreada] = useState(null)
  const [progreso, setProgreso] = useState('')

  useEffect(() => {
    if (!sesion) return
    const controller = new AbortController()
    getDepartments(controller.signal)
      .then(setDepartamentos)
      .catch(() => { if (!controller.signal.aborted) setError('No se pudieron cargar los departamentos. Actualiza la página e inténtalo de nuevo.') })
    return () => controller.abort()
  }, [sesion])

  if (!sesion) return <Navigate to="/ingresar" replace state={{ from: '/registro-negocio' }} />

  function change(event) {
    setValues(current => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (enviando) return
    if (!values.id_departamento) {
      setError('Selecciona el departamento o región del negocio.')
      document.getElementById('business-department')?.focus()
      return
    }
    const form = event.currentTarget
    setError('')
    setMessage('')
    setEnviando(true)
    let currentSolicitud = solicitudCreada
    try {
      for (const file of Object.values(documentos)) {
        if (file && (file.type !== 'application/pdf' || file.size === 0 || file.size > 10485760)) {
          throw new Error('Los documentos deben ser PDF de hasta 10 MB.')
        }
      }
      const data = {
        ...values,
        nombre_negocio: values.nombre_negocio.trim(),
        codigo_ruc: values.codigo_ruc.trim(),
        descripcion: values.descripcion.trim(),
        municipio: values.municipio.trim(),
        direccion_exacta: values.direccion_exacta.trim(),
        id_departamento: Number(values.id_departamento),
      }
      const solicitud = currentSolicitud || await createBusinessRequest(sesion.token, data)
      if (!currentSolicitud) {
        currentSolicitud = solicitud
        setSolicitudCreada(solicitud)
      }
      for (const [key, tipo] of [['ruc', 'RUC'], ['permiso', 'Permiso']]) {
        const file = documentos[key]
        if (!file || subidos[key]) continue
        setProgreso(`Subiendo ${tipo}…`)
        await uploadStorageFile(file, sesion.token, {
          context: {
            type: 'business-request',
            requestId: solicitud.id_solicitud,
            documentType: tipo,
            fileName: file.name,
          },
          onStatus: status => {
            if (status === 'confirming') setProgreso(`Validando ${tipo}…`)
          },
        })
        setSubidos(current => ({ ...current, [key]: true }))
      }
      setMessage(`Solicitud #${solicitud.id_solicitud} recibida. Estado: ${solicitud.estado}. Los documentos seleccionados quedaron adjuntos.`)
      setValues(initialValues)
      setDocumentos({ ruc: null, permiso: null })
      setSubidos({ ruc: false, permiso: false })
      setSolicitudCreada(null)
      form.reset()
    } catch (submitError) {
      setError(currentSolicitud
        ? `La solicitud #${currentSolicitud.id_solicitud} ya existe. ${submitError.message} Puedes reintentar los documentos sin crear otra solicitud.`
        : submitError.message)
    } finally {
      setProgreso('')
      setEnviando(false)
    }
  }

  return (
    <div className="auth-page auth-page-register">
      <main className="auth-card auth-card-register">
        <header className="auth-register-header">
          <Link className="auth-brand" to="/" aria-label="SINATUR, volver al inicio"><span className="auth-brand-icon"><Compass aria-hidden="true" size={25} /></span><span><strong>SINATUR</strong><small>Sistema Nacional de Turismo</small></span></Link>
          <Link className="auth-header-link" to="/account">Mi cuenta <ArrowRight aria-hidden="true" size={17} /></Link>
        </header>
        <div className="auth-register-body">
          <div className="auth-heading">
            <span className="auth-eyebrow">Forma parte de SINATUR</span>
            <h1>Solicita publicar tu negocio</h1>
            <p>Revisaremos la información de tu establecimiento. La solicitud se vincula a tu cuenta actual.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-columns">
              <section className="auth-form-section" aria-labelledby="business-title">
                <div className="auth-section-heading"><span className="auth-section-icon"><Building2 aria-hidden="true" size={22} /></span><div><h2 id="business-title">Datos del negocio</h2><p>Información para evaluar tu solicitud</p></div></div>
                <div className="auth-field"><label htmlFor="business-name">Nombre del negocio</label><div className="auth-input-wrap"><Building2 aria-hidden="true" size={19} /><input id="business-name" name="nombre_negocio" value={values.nombre_negocio} onChange={change} maxLength={150} autoComplete="organization" required disabled={Boolean(solicitudCreada)} /></div></div>
                <div className="auth-field"><label htmlFor="business-ruc">Número RUC</label><div className="auth-input-wrap"><FileText aria-hidden="true" size={19} /><input id="business-ruc" name="codigo_ruc" value={values.codigo_ruc} onChange={change} maxLength={50} required disabled={Boolean(solicitudCreada)} /></div></div>
                <div className="auth-field"><label htmlFor="business-description">Descripción del negocio <span className="auth-optional">(opcional)</span></label><textarea className="sinatur-textarea" id="business-description" name="descripcion" value={values.descripcion} onChange={change} rows={4} placeholder="Qué ofrece tu establecimiento" disabled={Boolean(solicitudCreada)} /></div>
                <aside className="auth-info"><ShieldCheck aria-hidden="true" size={24} /><div><h3>Revisión de solicitud</h3><p>Tu solicitud quedará pendiente de revisión administrativa. Los documentos PDF seleccionados se guardarán de forma privada y se vincularán a ella.</p></div></aside>
              </section>
              <section className="auth-form-section" aria-labelledby="location-title">
                <div className="auth-section-heading"><span className="auth-section-icon"><MapPin aria-hidden="true" size={22} /></span><div><h2 id="location-title">Ubicación y documentos</h2><p>Dirección del establecimiento</p></div></div>
                <div className="auth-field"><label htmlFor="business-department">Departamento o región</label><DepartmentDropdown id="business-department" value={values.id_departamento} departments={departamentos} onChange={value => { setValues(current => ({ ...current, id_departamento: value })); setError('') }} placeholder="Selecciona una opción" variant="form" required disabled={Boolean(solicitudCreada)} /></div>
                <div className="auth-field"><label htmlFor="business-municipality">Municipio</label><div className="auth-input-wrap"><MapPin aria-hidden="true" size={19} /><input id="business-municipality" name="municipio" value={values.municipio} onChange={change} maxLength={100} required disabled={Boolean(solicitudCreada)} /></div></div>
                <div className="auth-field"><label htmlFor="business-address">Dirección exacta</label><div className="auth-input-wrap"><MapPin aria-hidden="true" size={19} /><input id="business-address" name="direccion_exacta" value={values.direccion_exacta} onChange={change} autoComplete="street-address" placeholder="Barrio, calle, número y referencia" required disabled={Boolean(solicitudCreada)} /></div></div>
                <div className="auth-field"><label htmlFor="document-ruc">Documento RUC <span className="auth-optional">(PDF, hasta 10 MB)</span></label><input className="auth-file-input" id="document-ruc" type="file" accept=".pdf,application/pdf" disabled={enviando || subidos.ruc} onChange={event => setDocumentos(current => ({ ...current, ruc: event.target.files?.[0] || null }))} /><label className="auth-upload" htmlFor="document-ruc"><Upload aria-hidden="true" size={18} /> {subidos.ruc ? 'RUC adjuntado' : documentos.ruc?.name || 'Seleccionar PDF'}</label></div>
                <div className="auth-field"><label htmlFor="document-permit">Permiso o constancia del negocio <span className="auth-optional">(PDF, hasta 10 MB)</span></label><input className="auth-file-input" id="document-permit" type="file" accept=".pdf,application/pdf" disabled={enviando || subidos.permiso} onChange={event => setDocumentos(current => ({ ...current, permiso: event.target.files?.[0] || null }))} /><label className="auth-upload" htmlFor="document-permit"><Upload aria-hidden="true" size={18} /> {subidos.permiso ? 'Permiso adjuntado' : documentos.permiso?.name || 'Seleccionar PDF'}</label></div>
                <p className="sinatur-form-help">Los documentos son opcionales. Se subirán al enviar la solicitud y quedarán asociados a ella.</p>
              </section>
            </div>
            {error && <p className="auth-error" role="alert">{error}</p>}
            {progreso && <p className="auth-notice" role="status">{progreso}</p>}
            {message && <p className="auth-notice" role="status">{message}</p>}
            <div className="auth-form-actions"><Link className="auth-back" to="/account"><ArrowLeft aria-hidden="true" size={18} /> Volver a mi cuenta</Link><div><button className="auth-primary" type="submit" disabled={enviando || departamentos.length === 0}>{enviando ? 'Enviando…' : solicitudCreada ? 'Reintentar documentos' : 'Enviar solicitud'} <ArrowRight aria-hidden="true" size={19} /></button></div></div>
          </form>
        </div>
      </main>
    </div>
  )
}
