import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, Compass, FileText, MapPin, ShieldCheck, Upload } from 'lucide-react'
import { useAuth } from './hooks/useAuth.js'
import DepartmentDropdown from './Components/DepartmentDropdown.jsx'
import { createBusinessRequest, getDepartments } from './services/businessRequests.api.js'

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
  const [documentos, setDocumentos] = useState({ ruc: '', permiso: '' })

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
    try {
      const data = {
        ...values,
        nombre_negocio: values.nombre_negocio.trim(),
        codigo_ruc: values.codigo_ruc.trim(),
        descripcion: values.descripcion.trim(),
        municipio: values.municipio.trim(),
        direccion_exacta: values.direccion_exacta.trim(),
        id_departamento: Number(values.id_departamento),
      }
      const solicitud = await createBusinessRequest(sesion.token, data)
      setMessage(`Solicitud #${solicitud.id_solicitud} recibida. Estado: ${solicitud.estado}. Los documentos todavía no se envían; te indicaremos cómo adjuntarlos cuando esa función esté disponible.`)
      setValues(initialValues)
      setDocumentos({ ruc: '', permiso: '' })
      form.reset()
    } catch (error) {
      setError(error.message)
    } finally {
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
                <div className="auth-field"><label htmlFor="business-name">Nombre del negocio</label><div className="auth-input-wrap"><Building2 aria-hidden="true" size={19} /><input id="business-name" name="nombre_negocio" value={values.nombre_negocio} onChange={change} maxLength={150} autoComplete="organization" required /></div></div>
                <div className="auth-field"><label htmlFor="business-ruc">Número RUC</label><div className="auth-input-wrap"><FileText aria-hidden="true" size={19} /><input id="business-ruc" name="codigo_ruc" value={values.codigo_ruc} onChange={change} maxLength={50} required /></div></div>
                <div className="auth-field"><label htmlFor="business-description">Descripción del negocio <span className="auth-optional">(opcional)</span></label><textarea className="sinatur-textarea" id="business-description" name="descripcion" value={values.descripcion} onChange={change} rows={4} placeholder="Qué ofrece tu establecimiento" /></div>
                <aside className="auth-info"><ShieldCheck aria-hidden="true" size={24} /><div><h3>Revisión de solicitud</h3><p>Tu solicitud quedará pendiente de revisión administrativa. Sus documentos se registrarán por separado cuando se habilite la carga de archivos.</p></div></aside>
              </section>
              <section className="auth-form-section" aria-labelledby="location-title">
                <div className="auth-section-heading"><span className="auth-section-icon"><MapPin aria-hidden="true" size={22} /></span><div><h2 id="location-title">Ubicación y documentos</h2><p>Dirección del establecimiento</p></div></div>
                <div className="auth-field"><label htmlFor="business-department">Departamento o región</label><DepartmentDropdown id="business-department" value={values.id_departamento} departments={departamentos} onChange={value => { setValues(current => ({ ...current, id_departamento: value })); setError('') }} placeholder="Selecciona una opción" variant="form" required /></div>
                <div className="auth-field"><label htmlFor="business-municipality">Municipio</label><div className="auth-input-wrap"><MapPin aria-hidden="true" size={19} /><input id="business-municipality" name="municipio" value={values.municipio} onChange={change} maxLength={100} required /></div></div>
                <div className="auth-field"><label htmlFor="business-address">Dirección exacta</label><div className="auth-input-wrap"><MapPin aria-hidden="true" size={19} /><input id="business-address" name="direccion_exacta" value={values.direccion_exacta} onChange={change} autoComplete="street-address" placeholder="Barrio, calle, número y referencia" required /></div></div>
                <div className="auth-field"><label htmlFor="document-ruc">Documento RUC </label><input className="auth-file-input" id="document-ruc" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => setDocumentos(current => ({ ...current, ruc: event.target.files?.[0]?.name || '' }))} /><label className="auth-upload" htmlFor="document-ruc"><Upload aria-hidden="true" size={18} /> {documentos.ruc || 'Seleccionar archivo'}</label></div>
                <div className="auth-field"><label htmlFor="document-permit">Permiso o constancia del negocio </label><input className="auth-file-input" id="document-permit" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => setDocumentos(current => ({ ...current, permiso: event.target.files?.[0]?.name || '' }))} /><label className="auth-upload" htmlFor="document-permit"><Upload aria-hidden="true" size={18} /> {documentos.permiso || 'Seleccionar archivo'}</label></div>
                <p className="sinatur-form-help">Puedes seleccionar archivos, pero todavía no se enviarán ni se guardarán con la solicitud.</p>
              </section>
            </div>
            {error && <p className="auth-error" role="alert">{error}</p>}
            {message && <p className="auth-notice" role="status">{message}</p>}
            <div className="auth-form-actions"><Link className="auth-back" to="/account"><ArrowLeft aria-hidden="true" size={18} /> Volver a mi cuenta</Link><div><button className="auth-primary" type="submit" disabled={enviando || departamentos.length === 0}>{enviando ? 'Enviando…' : 'Enviar solicitud'} <ArrowRight aria-hidden="true" size={19} /></button></div></div>
          </form>
        </div>
      </main>
    </div>
  )
}
