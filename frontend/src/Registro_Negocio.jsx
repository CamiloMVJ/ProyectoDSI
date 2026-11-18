import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, ArrowRight, Building2, CheckCircle2, Compass, FileBadge2, FileText, Globe2, IdCard, LoaderCircle, Mail, MapPin, Phone, ShieldCheck, Tags, Upload, X } from 'lucide-react'
import { useAuth } from './hooks/useAuth.js'
import DepartmentDropdown from './Components/DepartmentDropdown.jsx'
import { createBusinessRequest, getBusinessCategories, getDepartments, getTouristComplexes } from './services/businessRequests.api.js'
import { uploadStorageFile } from './services/uploads.api.js'
import './css/registro-negocio-campos.css'

const initialValues = {
  tipo_persona: '', numero_cedula_solicitante: '', codigo_ruc: '', razon_social: '',
  nombre_negocio: '', categorias: [], descripcion: '', telefono_contacto: '',
  correo_contacto: '', sitio_web: '', es_independiente: true, id_complejo_padre: '',
  municipio: '', direccion_exacta: '', id_departamento: '', maps_link: '',
}

const documentTypes = [
  { key: 'cedula', label: 'Cédula de identidad del solicitante', type: 'Cédula de Identidad' },
  { key: 'ruc', label: 'Documento RUC', type: 'Constancia RUC' },
  { key: 'permiso', label: 'Permiso o constancia del negocio', type: 'Permiso o Constancia' },
]
const emptyDocuments = () => ({ cedula: null, ruc: null, permiso: null })
const emptyUploads = () => ({ cedula: false, ruc: false, permiso: false })

function TextField({ id, name, label, value, onChange, icon: Icon, type = 'text', optional = false, required = false, disabled = false, maxLength, placeholder, autoComplete }) {
  return <div className="auth-field">
    <label htmlFor={id}>{label} {optional && <span className="auth-optional">(opcional)</span>}</label>
    <div className="auth-input-wrap"><Icon aria-hidden="true" size={19} /><input id={id} name={name} type={type} value={value} onChange={onChange} required={required} disabled={disabled} maxLength={maxLength} placeholder={placeholder} autoComplete={autoComplete} /></div>
  </div>
}

export default function RegistroNegocioSINATUR() {
  const { sesion } = useAuth()
  const [values, setValues] = useState(initialValues)
  const [departamentos, setDepartamentos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [complejos, setComplejos] = useState([])
  const [catalogNotice, setCatalogNotice] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [documentos, setDocumentos] = useState(emptyDocuments)
  const [subidos, setSubidos] = useState(emptyUploads)
  const [fileVersion, setFileVersion] = useState({ cedula: 0, ruc: 0, permiso: 0 })
  const [solicitudCreada, setSolicitudCreada] = useState(null)
  const [feedback, setFeedback] = useState({ phase: 'idle', detail: '' })

  useEffect(() => {
    if (!sesion) return
    const controller = new AbortController()
    Promise.allSettled([getDepartments(controller.signal), getBusinessCategories(controller.signal), getTouristComplexes(controller.signal)])
      .then(([departments, categories, complexes]) => {
        if (controller.signal.aborted) return
        if (departments.status === 'fulfilled') setDepartamentos(departments.value)
        else setError('No se pudieron cargar los departamentos. Actualiza la página e inténtalo de nuevo.')
        if (categories.status === 'fulfilled') setCategorias(categories.value)
        if (complexes.status === 'fulfilled') setComplejos(complexes.value)
        if (categories.status === 'rejected' || complexes.status === 'rejected') setCatalogNotice('Algunas opciones del catálogo no están disponibles. Actualiza la página para volver a cargarlas.')
      })
    return () => controller.abort()
  }, [sesion])

  if (!sesion) return <Navigate to="/ingresar" replace state={{ from: '/registro-negocio' }} />

  function change(event) {
    setValues(current => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
    setFeedback({ phase: 'idle', detail: '' })
  }

  function toggleCategory(id) {
    setValues(current => ({
      ...current, categorias: current.categorias.includes(id)
        ? current.categorias.filter(value => value !== id)
        : [...current.categorias, id]
    }))
  }

  function removeDocument(key) {
    setDocumentos(current => ({ ...current, [key]: null }))
    setFileVersion(current => ({ ...current, [key]: current[key] + 1 }))
    setError('')
    setFeedback({ phase: 'idle', detail: '' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (enviando) return
    if (!values.id_departamento) {
      setError('Selecciona el departamento o región del negocio.')
      setFeedback({ phase: 'error', detail: '' })
      document.getElementById('business-department')?.focus()
      return
    }
    const form = event.currentTarget
    setError('')
    setMessage('')
    setEnviando(true)
    let currentSolicitud = solicitudCreada
    const pendingDocuments = documentTypes.filter(({ key }) => documentos[key] && !subidos[key])
    setFeedback({ phase: currentSolicitud ? 'uploading' : 'creating', detail: currentSolicitud ? 'Preparando los documentos pendientes…' : 'Guardando los datos del negocio…' })
    try {
      for (const file of Object.values(documentos)) {
        if (file && (file.type !== 'application/pdf' || file.size === 0 || file.size > 10485760)) {
          throw new Error('Los documentos deben ser PDF de hasta 10 MB.')
        }
      }
      const data = {
        ...values,
        nombre_negocio: values.nombre_negocio.trim(),
        razon_social: values.razon_social.trim() || null,
        codigo_ruc: values.codigo_ruc.trim(),
        numero_cedula_solicitante: values.numero_cedula_solicitante.trim() || null,
        tipo_persona: values.tipo_persona || null,
        descripcion: values.descripcion.trim(),
        id_complejo_padre: values.es_independiente ? null : Number(values.id_complejo_padre) || null,
        municipio: values.municipio.trim(),
        direccion_exacta: values.direccion_exacta.trim(),
        maps_link: values.maps_link.trim() || null,
        telefono_contacto: values.telefono_contacto.trim() || null,
        correo_contacto: values.correo_contacto.trim() || null,
        sitio_web: values.sitio_web.trim() || null,
        id_departamento: Number(values.id_departamento),
      }
      const solicitud = currentSolicitud || await createBusinessRequest(sesion.token, data)
      if (!currentSolicitud) {
        currentSolicitud = solicitud
        setSolicitudCreada(solicitud)
      }
      for (const [index, { key, type: tipo }] of pendingDocuments.entries()) {
        const file = documentos[key]
        setFeedback({ phase: 'uploading', detail: `Documento ${index + 1} de ${pendingDocuments.length}: ${tipo}` })
        await uploadStorageFile(file, sesion.token, {
          context: {
            type: 'business-request',
            requestId: solicitud.id_solicitud,
            documentType: tipo,
            fileName: file.name,
          },
          onStatus: status => {
            if (status === 'confirming') setFeedback({ phase: 'validating', detail: `Verificando ${tipo} (${index + 1} de ${pendingDocuments.length})…` })
          },
        })
        setSubidos(current => ({ ...current, [key]: true }))
      }
      setMessage(`Tu solicitud #${solicitud.id_solicitud} fue recibida y está ${(solicitud.estado || 'Pendiente').toLowerCase()}. ${pendingDocuments.length ? 'Los documentos seleccionados quedaron adjuntos.' : 'Puedes consultar su estado en Mis solicitudes.'}`)
      setFeedback({ phase: 'success', detail: '' })
      setValues(initialValues)
      setDocumentos(emptyDocuments())
      setSubidos(emptyUploads())
      setFileVersion(current => Object.fromEntries(Object.entries(current).map(([key, value]) => [key, value + 1])))
      setSolicitudCreada(null)
      form.reset()
    } catch (submitError) {
      setFeedback({ phase: 'error', detail: '' })
      setError(currentSolicitud
        ? `La solicitud #${currentSolicitud.id_solicitud} ya existe. ${submitError.message} Puedes reintentar los documentos sin crear otra solicitud.`
        : submitError.message)
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
            <div className="auth-columns business-form-top">
              <section className="auth-form-section" aria-labelledby="legal-title">
                <div className="auth-section-heading"><span className="auth-section-icon"><IdCard aria-hidden="true" size={22} /></span><div><h2 id="legal-title">Identidad legal y del titular</h2><p>Datos de quien solicita el registro</p></div></div>
                <fieldset className="business-choice-field"><legend>Tipo de persona</legend><div className="business-choice-grid">{['Persona Natural', 'Persona Jurídica'].map(tipo => <label key={tipo} className={`business-choice ${values.tipo_persona === tipo ? 'business-choice-selected' : ''}`}><input type="radio" name="tipo_persona" value={tipo} checked={values.tipo_persona === tipo} disabled={Boolean(solicitudCreada)} onChange={change} /><span>{tipo}</span></label>)}</div></fieldset>
                <TextField id="business-id" name="numero_cedula_solicitante" label="Número de cédula del solicitante" value={values.numero_cedula_solicitante} onChange={change} icon={IdCard} maxLength={30} disabled={Boolean(solicitudCreada)} />
                <TextField id="business-ruc" name="codigo_ruc" label="Número RUC" value={values.codigo_ruc} onChange={change} icon={FileBadge2} maxLength={50} required disabled={Boolean(solicitudCreada)} />
                <TextField id="business-legal-name" name="razon_social" label="Razón social (según constancia DGI)" value={values.razon_social} onChange={change} icon={FileText} maxLength={150} optional disabled={Boolean(solicitudCreada)} />
              </section>
              <section className="auth-form-section" aria-labelledby="profile-title">
                <div className="auth-section-heading"><span className="auth-section-icon"><Building2 aria-hidden="true" size={22} /></span><div><h2 id="profile-title">Perfil y contacto del negocio</h2><p>Cómo encontrar y conocer tu establecimiento</p></div></div>
                <TextField id="business-name" name="nombre_negocio" label="Nombre comercial del negocio" value={values.nombre_negocio} onChange={change} icon={Building2} maxLength={150} autoComplete="organization" required disabled={Boolean(solicitudCreada)} />
                <fieldset className="business-choice-field"><legend>Rubros del negocio <span className="auth-optional">(puedes elegir varios)</span></legend><div className="business-chip-list">{categorias.map(categoria => <label key={categoria.id_categoria} className={`business-chip ${values.categorias.includes(categoria.id_categoria) ? 'business-chip-selected' : ''}`}><input type="checkbox" checked={values.categorias.includes(categoria.id_categoria)} onChange={() => toggleCategory(categoria.id_categoria)} disabled={Boolean(solicitudCreada)} /><Tags size={15} aria-hidden="true" /><span>{categoria.nombre}</span></label>)}</div>{categorias.length === 0 && <p className="sinatur-form-help">No hay rubros disponibles por ahora.</p>}</fieldset>
                <div className="auth-field"><label htmlFor="business-description">Descripción del negocio <span className="auth-optional">(opcional)</span></label><textarea className="sinatur-textarea" id="business-description" name="descripcion" value={values.descripcion} onChange={change} rows={3} placeholder="Qué ofrece tu establecimiento" disabled={Boolean(solicitudCreada)} /></div>
                <TextField id="business-phone" name="telefono_contacto" label="Teléfono o WhatsApp del local" value={values.telefono_contacto} onChange={change} icon={Phone} type="tel" maxLength={30} optional disabled={Boolean(solicitudCreada)} />
                <TextField id="business-email" name="correo_contacto" label="Correo electrónico del local" value={values.correo_contacto} onChange={change} icon={Mail} type="email" maxLength={150} optional disabled={Boolean(solicitudCreada)} />
                <TextField id="business-site" name="sitio_web" label="Sitio web o red social (Instagram / Facebook)" value={values.sitio_web} onChange={change} icon={Globe2} type="url" maxLength={255} placeholder="https://" optional disabled={Boolean(solicitudCreada)} />
              </section>
            </div>
            <section className="auth-form-section business-location-section" aria-labelledby="location-title">
              <div className="auth-section-heading"><span className="auth-section-icon"><MapPin aria-hidden="true" size={22} /></span><div><h2 id="location-title">Ubicación y documentación de respaldo</h2><p>Dirección y archivos de apoyo de la solicitud</p></div></div>
              <div className="business-location-grid">
                <div className="business-subsection">
                  <fieldset className="business-choice-field"><legend>Modalidad de ubicación</legend><div className="business-choice-grid"><label className={`business-choice ${values.es_independiente ? 'business-choice-selected' : ''}`}><input type="radio" name="modalidad" checked={values.es_independiente} disabled={Boolean(solicitudCreada)} onChange={() => setValues(current => ({ ...current, es_independiente: true, id_complejo_padre: '' }))} /><span>Local independiente</span></label><label className={`business-choice ${!values.es_independiente ? 'business-choice-selected' : ''}`}><input type="radio" name="modalidad" checked={!values.es_independiente} disabled={Boolean(solicitudCreada)} onChange={() => setValues(current => ({ ...current, es_independiente: false }))} /><span>Dentro de un complejo turístico</span></label></div></fieldset>
                  {!values.es_independiente && <div className="auth-field business-reveal"><label htmlFor="business-complex">Complejo turístico</label><select className="sinatur-select-outside" id="business-complex" name="id_complejo_padre" value={values.id_complejo_padre} onChange={change} disabled={Boolean(solicitudCreada)}><option value="">Selecciona un complejo</option>{complejos.map(complejo => <option key={complejo.id_lugar} value={complejo.id_lugar}>{complejo.nombre}</option>)}</select>{complejos.length === 0 && <p className="sinatur-form-help">No hay complejos disponibles por ahora.</p>}</div>}
                  <div className="auth-field"><label htmlFor="business-department">Departamento o región</label><DepartmentDropdown id="business-department" value={values.id_departamento} departments={departamentos} onChange={value => { setValues(current => ({ ...current, id_departamento: value })); setError(''); setFeedback({ phase: 'idle', detail: '' }) }} placeholder="Selecciona una opción" variant="form" required disabled={Boolean(solicitudCreada)} /></div>
                  <TextField id="business-municipality" name="municipio" label="Municipio" value={values.municipio} onChange={change} icon={MapPin} maxLength={100} required disabled={Boolean(solicitudCreada)} />
                  <TextField id="business-address" name="direccion_exacta" label="Dirección exacta" value={values.direccion_exacta} onChange={change} icon={MapPin} autoComplete="street-address" placeholder="Barrio, calle, número y referencia" required disabled={Boolean(solicitudCreada)} />
                  <TextField id="business-map" name="maps_link" label="Enlace de Google Maps" value={values.maps_link} onChange={change} icon={MapPin} type="url" maxLength={255} optional disabled={Boolean(solicitudCreada)} />
                </div>
                <div className="business-subsection business-documents"><h3>Documentos PDF</h3><p className="sinatur-form-help">Puedes adjuntar archivos de hasta 10 MB. Se guardarán de forma privada.</p>
                  {documentTypes.map(({ key, label }) => <div className="auth-field business-document-field" key={key}><label htmlFor={`document-${key}`}>{label} <span className="auth-optional">(PDF, hasta 10 MB)</span></label><input key={`${key}-${fileVersion[key]}`} className="auth-file-input" id={`document-${key}`} type="file" accept=".pdf,application/pdf" disabled={enviando || subidos[key]} onChange={event => { setDocumentos(current => ({ ...current, [key]: event.target.files?.[0] || null })); setError(''); setFeedback({ phase: 'idle', detail: '' }) }} /><div className="business-file-row"><label className="auth-upload" htmlFor={`document-${key}`}><Upload aria-hidden="true" size={18} />{subidos[key] ? 'Documento adjuntado' : documentos[key]?.name || 'Seleccionar PDF'}</label>{documentos[key] && !subidos[key] && !enviando && <button type="button" className="business-remove-file" onClick={() => removeDocument(key)} aria-label={`Quitar ${label}`}><X size={17} aria-hidden="true" /> Quitar</button>}</div></div>)}
                </div>
              </div>
              <aside className="auth-info"><ShieldCheck aria-hidden="true" size={24} /><div><h3>Revisión de solicitud</h3><p>Tu solicitud quedará pendiente de revisión administrativa. Los PDF seleccionados se vincularán a ella y se guardarán de forma privada.</p></div></aside>
            </section>
            {catalogNotice && <p className="auth-notice" role="status">{catalogNotice}</p>}
            {feedback.phase === 'idle' && error && <p className="auth-error" role="alert">{error}</p>}
            {feedback.phase !== 'idle' && (feedback.phase !== 'error' || error) && <div className={`business-submit-feedback business-submit-${feedback.phase}`} role={feedback.phase === 'error' ? 'alert' : 'status'} aria-live={feedback.phase === 'error' ? 'assertive' : 'polite'}>
              <span className="business-submit-icon" aria-hidden="true">{feedback.phase === 'success' ? <CheckCircle2 size={24} /> : feedback.phase === 'error' ? <AlertCircle size={24} /> : <LoaderCircle size={24} className="business-submit-spinner" />}</span>
              <div className="business-submit-content">
                <strong>{feedback.phase === 'creating' ? 'Estamos registrando tu solicitud' : feedback.phase === 'uploading' ? 'Estamos adjuntando tus documentos' : feedback.phase === 'validating' ? 'Estamos comprobando el documento' : feedback.phase === 'success' ? '¡Solicitud enviada con éxito!' : solicitudCreada ? 'Tu solicitud se guardó, pero falta un paso' : 'No pudimos enviar tu solicitud'}</strong>
                <p>{feedback.phase === 'success' ? message : feedback.phase === 'error' ? error : feedback.detail}</p>
                {feedback.phase === 'success' && <Link className="business-submit-link" to="/mis-solicitudes">Ver mis solicitudes <ArrowRight aria-hidden="true" size={17} /></Link>}
              </div>
            </div>}
            <div className="auth-form-actions"><Link className="auth-back" to="/account"><ArrowLeft aria-hidden="true" size={18} /> Volver a mi cuenta</Link><div><button className="auth-primary" type="submit" disabled={enviando || departamentos.length === 0} aria-busy={enviando}>{enviando ? (feedback.phase === 'creating' ? 'Registrando solicitud…' : feedback.phase === 'validating' ? 'Verificando documento…' : 'Adjuntando documentos…') : solicitudCreada ? 'Reintentar documentos' : 'Enviar solicitud'} {enviando ? <LoaderCircle className="business-submit-spinner" aria-hidden="true" size={19} /> : <ArrowRight aria-hidden="true" size={19} />}</button></div></div>
          </form>
        </div>
      </main>
    </div>
  )
}
