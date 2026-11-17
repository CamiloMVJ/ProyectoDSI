import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  Store, Search, Eye, Pencil, EyeOff, X, ChevronLeft, ChevronRight,
  MapPin, Mail, Phone, UserRound, FileText, Tag, Save, ArrowLeft, AlertTriangle, LoaderCircle, ClipboardList, UtensilsCrossed, Plus, Trash2, Clock3
} from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getDepartments, getTouristComplexes } from '../services/businessRequests.api.js'
import { getManagedEstablishments, getMenuCategories, saveManagedEstablishment } from '../services/establishments.api.js'
import '../css/gestion-establecimientos.css'

const moneda = (valor, codigo = 'NIO') => new Intl.NumberFormat('es-NI', { style: 'currency', currency: codigo }).format(Number(valor || 0))
const texto = valor => valor ?? ''
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function toForm(negocio) {
  return {
    nombre: negocio.nombre || '', codigo_ruc: negocio.codigo_ruc || '',
    razon_social: negocio.razon_social || '', descripcion: negocio.descripcion || '',
    id_departamento: String(negocio.id_departamento || ''), municipio: negocio.municipio || '',
    direccion_exacta: negocio.direccion_exacta || '', maps_link: negocio.maps_link || '',
    telefono_contacto: negocio.telefono_contacto || '', correo_contacto: negocio.correo_contacto || '',
    sitio_web: negocio.sitio_web || '', es_independiente: negocio.es_independiente !== false,
    id_complejo_padre: String(negocio.id_complejo_padre || ''),
    esta_publicado: Boolean(negocio.esta_publicado),
    servicios: (negocio.servicios || []).map(servicio => ({
      id_servicio: servicio.id_servicio,
      nombre_servicio: servicio.nombre_servicio,
      precio: String(servicio.precio),
      moneda: servicio.moneda || 'NIO',
    })),
    horarios: (negocio.horarios || []).map(horario => ({
      id_horario: horario.id_horario,
      dia_semana: horario.dia_semana,
      hora_apertura: horario.hora_apertura?.slice(0, 5) || '',
      hora_cierre: horario.hora_cierre?.slice(0, 5) || '',
      es_feriado: Boolean(horario.es_feriado),
    })),
    menus: (negocio.menus || []).map(menu => ({
      id_menu: menu.id_menu, titulo_menu: menu.titulo_menu || '',
      descripcion: menu.descripcion || '', esta_activo: menu.esta_activo !== false,
      items: (menu.items || []).map(item => ({
        id_item: item.id_item, nombre_platillo: item.nombre_platillo || '',
        descripcion: item.descripcion || '', precio: String(item.precio),
        moneda: item.moneda || 'NIO', url_foto: item.url_foto || '', id_categoria_menu: String(item.id_categoria_menu || ''),
        es_vegetariano: Boolean(item.es_vegetariano), esta_disponible: item.esta_disponible !== false,
      })),
    })),
  }
}

function toPayload(form) {
  return {
    nombre: form.nombre.trim(), codigo_ruc: form.codigo_ruc.trim(),
    razon_social: form.razon_social.trim() || null, descripcion: form.descripcion.trim() || null,
    id_departamento: Number(form.id_departamento), municipio: form.municipio.trim(),
    direccion_exacta: form.direccion_exacta.trim(), maps_link: form.maps_link.trim() || null,
    telefono_contacto: form.telefono_contacto.trim() || null,
    correo_contacto: form.correo_contacto.trim() || null, sitio_web: form.sitio_web.trim() || null,
    es_independiente: form.es_independiente,
    id_complejo_padre: form.es_independiente ? null : Number(form.id_complejo_padre),
    esta_publicado: form.esta_publicado,
    servicios: form.servicios.map(servicio => ({
      ...(servicio.id_servicio ? { id_servicio: servicio.id_servicio } : {}),
      nombre_servicio: servicio.nombre_servicio.trim(),
      precio: Number(servicio.precio),
      moneda: servicio.moneda,
    })),
    horarios: form.horarios.map(horario => ({
      ...(horario.id_horario ? { id_horario: horario.id_horario } : {}),
      dia_semana: horario.dia_semana,
      hora_apertura: horario.hora_apertura,
      hora_cierre: horario.hora_cierre,
      es_feriado: horario.es_feriado,
    })),
    menus: form.menus.map(menu => ({
      ...(menu.id_menu ? { id_menu: menu.id_menu } : {}),
      titulo_menu: menu.titulo_menu.trim(), descripcion: menu.descripcion.trim() || null,
      esta_activo: menu.esta_activo,
      items: menu.items.map(item => ({
        ...(item.id_item ? { id_item: item.id_item } : {}),
        nombre_platillo: item.nombre_platillo.trim(), descripcion: item.descripcion.trim() || null,
        precio: Number(item.precio), moneda: item.moneda, url_foto: item.url_foto.trim() || null,
        id_categoria_menu: item.id_categoria_menu ? Number(item.id_categoria_menu) : null,
        es_vegetariano: item.es_vegetariano, esta_disponible: item.esta_disponible,
      })),
    })),
  }
}

function TextField({ label, icon: Icon, value, onChange, disabled, required = false, type = 'text', maxLength = 255 }) {
  return <label className="ge-field"><span>{label} {required && <b>*</b>}</span><span className="ge-input-shell"><Icon size={17} aria-hidden="true" /><input value={value} onChange={event => onChange(event.target.value)} disabled={disabled} required={required} type={type} maxLength={maxLength} /></span></label>
}

export default function GestionEstablecimientosVista() {
  const { sesion } = useAuth()
  const esAdministrador = sesion?.usuario.rol === 'Administrador'
  const [negocios, setNegocios] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [complejos, setComplejos] = useState([])
  const [categoriasMenu, setCategoriasMenu] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [buscar, setBuscar] = useState('')
  const [pagina, setPagina] = useState(1)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [pageError, setPageError] = useState('')
  const [catalogNotice, setCatalogNotice] = useState('')
  const [modalError, setModalError] = useState('')
  const tamPagina = 5

  useEffect(() => {
    if (!sesion?.token || !['Administrador', 'Propietario', 'Usuario'].includes(sesion.usuario.rol)) return
    const controller = new AbortController()
    Promise.allSettled([
      getManagedEstablishments(sesion.token, controller.signal),
      getDepartments(controller.signal),
      getTouristComplexes(controller.signal),
      getMenuCategories(controller.signal),
    ]).then(([locales, regiones, lugares, categorias]) => {
      if (controller.signal.aborted) return
      if (locales.status === 'fulfilled') { setNegocios(locales.value); setPageError('') }
      else setPageError('No se pudieron cargar los establecimientos. Actualiza la página para reintentar.')
      if (regiones.status === 'fulfilled') setDepartamentos(regiones.value)
      if (lugares.status === 'fulfilled') setComplejos(lugares.value)
      if (categorias.status === 'fulfilled') setCategoriasMenu(categorias.value)
      if (regiones.status === 'rejected' || lugares.status === 'rejected' || categorias.status === 'rejected') setCatalogNotice('Algunas opciones del catálogo no están disponibles. Actualiza la página antes de editar un local.')
    }).finally(() => {
      if (!controller.signal.aborted) setCargando(false)
    })
    return () => controller.abort()
  }, [sesion])

  useEffect(() => {
    if (!modal) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [modal])

  const filtrados = useMemo(() => negocios.filter(negocio =>
    [negocio.nombre, negocio.propietario, negocio.codigo_ruc].join(' ').toLocaleLowerCase('es').includes(buscar.trim().toLocaleLowerCase('es'))
  ), [negocios, buscar])
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / tamPagina))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice((paginaActual - 1) * tamPagina, paginaActual * tamPagina)

  if (!sesion) return <Navigate to="/ingresar" replace state={{ from: '/gestion-establecimientos' }} />
  if (!['Administrador', 'Propietario', 'Usuario'].includes(sesion.usuario.rol)) return <Navigate to="/account" replace />

  function abrir(tipo, negocio) {
    setForm(toForm(negocio))
    setModal({ tipo, negocio })
    setModalError('')
    setMensaje('')
  }

  function cerrar() {
    if (guardando) return
    setModal(null)
    setModalError('')
  }

  function actualizar(campo, valor) { setForm(actual => ({ ...actual, [campo]: valor })) }
  function actualizarServicio(index, campo, valor) {
    setForm(actual => ({ ...actual, servicios: actual.servicios.map((servicio, i) => i === index ? { ...servicio, [campo]: valor } : servicio) }))
  }
  function actualizarHorario(index, campo, valor) {
    setForm(actual => ({ ...actual, horarios: actual.horarios.map((horario, i) => i === index ? { ...horario, [campo]: valor } : horario) }))
  }
  function actualizarMenu(index, campo, valor) {
    setForm(actual => ({ ...actual, menus: actual.menus.map((menu, i) => i === index ? { ...menu, [campo]: valor } : menu) }))
  }
  function actualizarPlatillo(menuIndex, itemIndex, campo, valor) {
    setForm(actual => ({ ...actual, menus: actual.menus.map((menu, i) => i === menuIndex
      ? { ...menu, items: menu.items.map((item, j) => j === itemIndex ? { ...item, [campo]: valor } : item) }
      : menu) }))
  }

  async function guardar(event, retirar = false) {
    event?.preventDefault()
    if (guardando || !modal) return
    if (!form.es_independiente && !form.id_complejo_padre) {
      setModalError('Selecciona el complejo turístico.')
      return
    }
    if (form.servicios.some(servicio => !servicio.nombre_servicio.trim() || servicio.precio === '' || Number(servicio.precio) < 0)) {
      setModalError('Revisa el nombre y el precio de los servicios.')
      return
    }
    if (form.horarios.some(horario => !horario.dia_semana || !horario.hora_apertura || !horario.hora_cierre)) {
      setModalError('Completa el día y las horas de cada horario, o quita la fila incompleta.')
      return
    }
    if (form.menus.some(menu => menu.items.some(item => !item.id_categoria_menu))) {
      setModalError('Selecciona una categoría para cada platillo o bebida. Es necesaria para calcular el presupuesto.')
      return
    }
    if (categoriasMenu.length && form.menus.some(menu => menu.items.some(item =>
      !categoriasMenu.some(categoria => String(categoria.id_categoria_menu) === item.id_categoria_menu)))) {
      setModalError('Hay categorías que ya no están disponibles. Selecciona una categoría vigente para esos ítems.')
      return
    }
    if (form.menus.some(menu => menu.titulo_menu.trim().length < 2 || menu.items.some(item =>
      item.nombre_platillo.trim().length < 2 || item.precio === '' || Number(item.precio) < 0))) {
      setModalError('Revisa los nombres y precios de los menús y platillos.')
      return
    }
    setGuardando(true)
    setModalError('')
    try {
      const actualizado = await saveManagedEstablishment(sesion.token, modal.negocio.id_local, toPayload(retirar ? { ...form, esta_publicado: false } : form))
      setNegocios(actuales => actuales.map(negocio => negocio.id_local === actualizado.id_local ? actualizado : negocio))
      setMensaje(retirar ? 'El establecimiento se retiró de la publicación. Sus datos siguen disponibles para editarlo.' : 'Los cambios se guardaron en la base de datos.')
      setModal(null)
    } catch (saveError) {
      setModalError(saveError.message || 'No se pudieron guardar los cambios.')
    } finally {
      setGuardando(false)
    }
  }

  const soloLectura = modal?.tipo === 'ver'
  const etiqueta = modal?.tipo === 'editar' ? 'Editar establecimiento' : soloLectura ? 'Detalles del establecimiento' : 'Retirar de publicación'

  return <div id="inicio" className="ge-page">
    <Navbar />
    <main className="ge-main">
      <header className="ge-intro"><p className="ge-kicker">GESTIÓN DE ESTABLECIMIENTOS</p><h1>{esAdministrador ? 'Administra los negocios registrados' : 'Administra tus establecimientos'}</h1></header>
      <section className="ge-panel" aria-label="Gestión de establecimientos">
        <div className="ge-panel-heading"><span className="ge-main-icon"><Store size={30} aria-hidden="true" /></span><div><h2>Gestión de establecimientos</h2><p>{esAdministrador ? 'Revisa los locales, actualiza su información y decide cuáles se muestran al público.' : 'Consulta y actualiza la información de tus locales y decide cuáles se muestran al público.'}</p></div></div>
        <div className="ge-table-card">
          <div className="ge-list-head"><h3><Store size={24} aria-hidden="true" /> {esAdministrador ? 'Listado de establecimientos' : 'Mis establecimientos'}</h3>{esAdministrador && <Link className="ge-button ge-primary" to="/admin/solicitudes"><ClipboardList size={18} aria-hidden="true" /> Revisar solicitudes</Link>}</div>
          <label className="ge-search"><Search size={20} aria-hidden="true" /><input value={buscar} onChange={event => { setBuscar(event.target.value); setPagina(1) }} placeholder="Buscar establecimiento, RUC o propietario..." aria-label="Buscar establecimiento" /></label>
          {mensaje && <div className="ge-notice" role="status">{mensaje}</div>}
          {pageError && <div className="ge-error" role="alert">{pageError}</div>}
          {catalogNotice && <div className="ge-error" role="status">{catalogNotice}</div>}
          {cargando ? <p className="ge-loading" role="status"><LoaderCircle className="ge-spinner" size={20} aria-hidden="true" /> Cargando establecimientos…</p> : !pageError && <>
            <div className="ge-table-wrap"><table className="ge-table"><thead><tr><th>Nombre del negocio</th><th>Propietario</th><th>RUC</th><th>Publicación</th><th>Acciones</th></tr></thead><tbody>
              {visibles.map(negocio => <tr key={negocio.id_local}><td><span className="ge-business"><Store size={18} aria-hidden="true" /><strong>{negocio.nombre}</strong></span></td><td>{negocio.propietario}</td><td>{negocio.codigo_ruc}</td><td><span className={`ge-status ${negocio.esta_publicado ? 'ge-active' : 'ge-inactive'}`}>{negocio.esta_publicado ? 'Publicado' : 'Sin publicar'}</span></td><td><div className="ge-actions"><button type="button" title="Consultar" aria-label={`Consultar ${negocio.nombre}`} onClick={() => abrir('ver', negocio)}><Eye size={18} /></button><button type="button" title="Editar" aria-label={`Editar ${negocio.nombre}`} onClick={() => abrir('editar', negocio)}><Pencil size={18} /></button>{negocio.esta_publicado && <button type="button" className="ge-delete-icon" title="Retirar de publicación" aria-label={`Retirar ${negocio.nombre} de publicación`} onClick={() => abrir('retirar', negocio)}><EyeOff size={18} /></button>}</div></td></tr>)}
              {!visibles.length && <tr><td colSpan="5" className="ge-empty">{buscar.trim() ? 'No hay establecimientos que coincidan con tu búsqueda.' : esAdministrador ? 'Todavía no hay establecimientos registrados. Aprueba una solicitud para crear el primero.' : 'Todavía no tienes establecimientos registrados. Consulta el estado de tus solicitudes en Mi cuenta.'}</td></tr>}
            </tbody></table></div>
            <div className="ge-table-bottom"><span>Mostrando {filtrados.length ? (paginaActual - 1) * tamPagina + 1 : 0}–{Math.min(paginaActual * tamPagina, filtrados.length)} de {filtrados.length} establecimientos</span><nav className="ge-pages" aria-label="Paginación"><button type="button" disabled={paginaActual === 1} onClick={() => setPagina(p => p - 1)} aria-label="Página anterior"><ChevronLeft size={18} /></button>{Array.from({ length: totalPaginas }, (_, i) => <button type="button" key={i} aria-current={paginaActual === i + 1 ? 'page' : undefined} className={paginaActual === i + 1 ? 'ge-page-current' : ''} onClick={() => setPagina(i + 1)}>{i + 1}</button>)}<button type="button" disabled={paginaActual === totalPaginas} onClick={() => setPagina(p => p + 1)} aria-label="Página siguiente"><ChevronRight size={18} /></button></nav></div>
          </>}
        </div>
      </section>
    </main>
    <Footer />
    {modal && form && <div className="ge-overlay" onMouseDown={event => { if (event.target === event.currentTarget) cerrar() }}><section className="ge-dialog" role="dialog" aria-modal="true" aria-labelledby="ge-dialog-title"><div className="ge-dialog-header"><h2 id="ge-dialog-title">{modal.tipo === 'retirar' ? <AlertTriangle size={25} aria-hidden="true" /> : <Store size={25} aria-hidden="true" />} {etiqueta}</h2><button type="button" className="ge-close" onClick={cerrar} disabled={guardando} aria-label="Cerrar"><X size={21} /></button></div>
      {modal.tipo === 'retirar' ? <div className="ge-confirm"><p>¿Deseas retirar <strong>{modal.negocio.nombre}</strong> de la búsqueda pública?</p><p>El registro y sus servicios se conservan. Podrás volver a publicarlo desde «Editar».</p>{modalError && <div className="ge-error" role="alert">{modalError}</div>}<div className="ge-dialog-actions"><button type="button" className="ge-button ge-outline" onClick={cerrar} disabled={guardando}>Cancelar</button><button type="button" className="ge-button ge-danger" onClick={() => guardar(null, true)} disabled={guardando}>{guardando ? <LoaderCircle className="ge-spinner" size={18} /> : <EyeOff size={18} />} Retirar de publicación</button></div></div> :
        <form onSubmit={guardar} className="ge-form">
          <p className="ge-form-intro">{soloLectura ? 'Consulta la información de este establecimiento.' : 'Organiza la información que verán tus clientes. Los cambios se aplican al guardar.'}</p>
          <section className="ge-form-section" aria-labelledby="ge-identity-heading">
            <div className="ge-section-heading"><span className="ge-section-icon"><Store size={20} aria-hidden="true" /></span><div><h3 id="ge-identity-heading">Datos del negocio</h3><p>Identidad, responsable y formas de contacto</p></div></div>
            <div className="ge-form-grid">
            <TextField label="Propietario" icon={UserRound} value={texto(modal.negocio.propietario)} disabled />
            <TextField label="Correo de la cuenta" icon={Mail} value={texto(modal.negocio.correo_propietario)} disabled />
            <TextField label="Nombre comercial" icon={Store} value={form.nombre} onChange={valor => actualizar('nombre', valor)} disabled={soloLectura} required maxLength={150} />
            <TextField label="Número RUC" icon={FileText} value={form.codigo_ruc} onChange={valor => actualizar('codigo_ruc', valor)} disabled={soloLectura} required maxLength={50} />
            <TextField label="Razón social" icon={FileText} value={form.razon_social} onChange={valor => actualizar('razon_social', valor)} disabled={soloLectura} maxLength={150} />
            <TextField label="Teléfono o WhatsApp" icon={Phone} value={form.telefono_contacto} onChange={valor => actualizar('telefono_contacto', valor)} disabled={soloLectura} maxLength={30} />
            <TextField label="Correo del local" icon={Mail} value={form.correo_contacto} onChange={valor => actualizar('correo_contacto', valor)} disabled={soloLectura} type="email" maxLength={150} />
            <TextField label="Sitio web o red social" icon={Store} value={form.sitio_web} onChange={valor => actualizar('sitio_web', valor)} disabled={soloLectura} maxLength={255} />
            <label className="ge-field ge-field-wide"><span>Descripción</span><textarea className="ge-textarea" rows={3} value={form.descripcion} onChange={event => actualizar('descripcion', event.target.value)} disabled={soloLectura} placeholder="Cuéntales a los visitantes qué hace especial a tu negocio" /></label>
            </div>
          </section>
          <section className="ge-form-section" aria-labelledby="ge-location-heading">
            <div className="ge-section-heading"><span className="ge-section-icon"><MapPin size={20} aria-hidden="true" /></span><div><h3 id="ge-location-heading">Ubicación y visibilidad</h3><p>Indica dónde está el local y si aparece en la búsqueda pública</p></div></div>
            <div className="ge-form-grid">
            <label className="ge-field"><span>Departamento o región <b>*</b></span><select value={form.id_departamento} onChange={event => actualizar('id_departamento', event.target.value)} disabled={soloLectura} required><option value="">Selecciona una opción</option>{departamentos.map(departamento => <option key={departamento.id_departamento} value={departamento.id_departamento}>{departamento.nombre}</option>)}</select></label>
            <TextField label="Municipio" icon={MapPin} value={form.municipio} onChange={valor => actualizar('municipio', valor)} disabled={soloLectura} required maxLength={100} />
            <TextField label="Dirección exacta" icon={MapPin} value={form.direccion_exacta} onChange={valor => actualizar('direccion_exacta', valor)} disabled={soloLectura} required />
            <TextField label="Enlace de Google Maps" icon={MapPin} value={form.maps_link} onChange={valor => actualizar('maps_link', valor)} disabled={soloLectura} type="url" />
            <label className="ge-field"><span>Ubicación</span><select value={String(form.es_independiente)} onChange={event => setForm(actual => ({ ...actual, es_independiente: event.target.value === 'true', id_complejo_padre: '' }))} disabled={soloLectura}><option value="true">Local independiente</option><option value="false">Dentro de un complejo turístico</option></select></label>
            {!form.es_independiente && <label className="ge-field"><span>Complejo turístico <b>*</b></span><select value={form.id_complejo_padre} onChange={event => actualizar('id_complejo_padre', event.target.value)} disabled={soloLectura} required><option value="">Selecciona un complejo</option>{complejos.map(complejo => <option key={complejo.id_lugar} value={complejo.id_lugar}>{complejo.nombre}</option>)}</select></label>}
            <label className="ge-field"><span>Publicación</span><select value={String(form.esta_publicado)} onChange={event => actualizar('esta_publicado', event.target.value === 'true')} disabled={soloLectura}><option value="false">Sin publicar</option><option value="true">Publicado</option></select></label>
            </div>
          </section>
          <section className="ge-form-section" aria-labelledby="ge-hours-heading">
            <div className="ge-services-header"><div className="ge-section-heading"><span className="ge-section-icon"><Clock3 size={20} aria-hidden="true" /></span><div><h3 id="ge-hours-heading">Horario de atención</h3><p>Define los días y las horas que se mostrarán para este establecimiento. Puedes agregar varios turnos por día.</p></div></div>{!soloLectura && <button type="button" className="ge-button ge-add-service" onClick={() => actualizar('horarios', [...form.horarios, { dia_semana: 'Lunes', hora_apertura: '08:00', hora_cierre: '17:00', es_feriado: false }])}><Plus size={17} /> Agregar horario</button>}</div>
            {!form.horarios.length && <p className="ge-empty-section">No hay horarios configurados. Agrega uno para indicar cuándo atiende el local.</p>}
            <div className="ge-hours-list">{form.horarios.map((horario, index) => <div className="ge-hours-row" key={horario.id_horario || `nuevo-${index}`}>
              <label className="ge-field"><span>Día</span><select aria-label={`Día del horario ${index + 1}`} value={horario.dia_semana} onChange={event => actualizarHorario(index, 'dia_semana', event.target.value)} disabled={soloLectura}>{!diasSemana.includes(horario.dia_semana) && <option value={horario.dia_semana}>{horario.dia_semana}</option>}{diasSemana.map(dia => <option key={dia} value={dia}>{dia}</option>)}</select></label>
              <label className="ge-field"><span>Abre</span><input className="ge-plain-input" aria-label={`Hora de apertura ${index + 1}`} type="time" value={horario.hora_apertura} onChange={event => actualizarHorario(index, 'hora_apertura', event.target.value)} disabled={soloLectura} required /></label>
              <label className="ge-field"><span>Cierra</span><input className="ge-plain-input" aria-label={`Hora de cierre ${index + 1}`} type="time" value={horario.hora_cierre} onChange={event => actualizarHorario(index, 'hora_cierre', event.target.value)} disabled={soloLectura} required /></label>
              <label className="ge-hours-holiday"><input type="checkbox" checked={horario.es_feriado} onChange={event => actualizarHorario(index, 'es_feriado', event.target.checked)} disabled={soloLectura} /> Horario de feriado</label>
              {!soloLectura && <button type="button" className="ge-remove-service ge-hours-remove" aria-label={`Quitar horario ${index + 1}`} onClick={() => actualizar('horarios', form.horarios.filter((_, i) => i !== index))}><Trash2 size={17} /> Quitar</button>}
            </div>)}</div>
          </section>
          <section className="ge-form-section" aria-labelledby="ge-services-heading">
          <div className="ge-services-header"><div className="ge-section-heading"><span className="ge-section-icon"><Tag size={20} aria-hidden="true" /></span><div><h3 id="ge-services-heading">Servicios y precios</h3><p>Actividades o prestaciones adicionales del local</p></div></div>{!soloLectura && <button type="button" className="ge-button ge-add-service" onClick={() => actualizar('servicios', [...form.servicios, { nombre_servicio: '', precio: '', moneda: 'NIO' }])}><Plus size={17} /> Agregar servicio</button>}</div>
          <div className="ge-services">{form.servicios.length === 0 && <p className="ge-no-services">No hay servicios registrados.</p>}{form.servicios.map((servicio, index) => <div className="ge-service-row" key={servicio.id_servicio || `nuevo-${index}`}><Tag size={18} aria-hidden="true" />{soloLectura ? <><span>{servicio.nombre_servicio}</span><strong>{moneda(servicio.precio, servicio.moneda)}</strong></> : <><input aria-label={`Nombre del servicio ${index + 1}`} placeholder="Nombre del servicio" value={servicio.nombre_servicio} onChange={event => actualizarServicio(index, 'nombre_servicio', event.target.value)} minLength={2} maxLength={150} required /><input aria-label={`Precio del servicio ${index + 1}`} type="number" min="0" step="0.01" placeholder="Precio" value={servicio.precio} onChange={event => actualizarServicio(index, 'precio', event.target.value)} required /><select aria-label={`Moneda del servicio ${index + 1}`} value={servicio.moneda} onChange={event => actualizarServicio(index, 'moneda', event.target.value)}><option value="NIO">C$</option><option value="USD">US$</option></select><button type="button" className="ge-remove-service" aria-label={`Quitar servicio ${index + 1}`} onClick={() => actualizar('servicios', form.servicios.filter((_, i) => i !== index))}><EyeOff size={18} /></button></>}</div>)}</div>
          </section>
          <section className="ge-form-section" aria-labelledby="ge-menu-heading">
            <div className="ge-services-header"><div className="ge-section-heading"><span className="ge-section-icon"><UtensilsCrossed size={20} aria-hidden="true" /></span><div><h3 id="ge-menu-heading">Menús y platillos</h3><p>Opcional. Añade cartas, comidas y bebidas con sus precios.</p></div></div>{!soloLectura && <button type="button" className="ge-button ge-add-service" onClick={() => actualizar('menus', [...form.menus, { titulo_menu: '', descripcion: '', esta_activo: true, items: [] }])}><Plus size={17} /> Agregar menú</button>}</div>
            {!form.menus.length && <p className="ge-empty-section">Todavía no hay menús. Puedes agregar uno si este local ofrece comidas o bebidas.</p>}
            <div className="ge-menu-list">{form.menus.map((menu, menuIndex) => <div className="ge-menu-card" key={menu.id_menu || `nuevo-${menuIndex}`}>
              <div className="ge-menu-top"><span className="ge-menu-number">Menú {menuIndex + 1}</span>{!soloLectura && !menu.id_menu && <button type="button" className="ge-remove-service" onClick={() => actualizar('menus', form.menus.filter((_, i) => i !== menuIndex))}><Trash2 size={16} /> Quitar menú</button>}</div>
              <div className="ge-form-grid"><TextField label="Título del menú" icon={UtensilsCrossed} value={menu.titulo_menu} onChange={valor => actualizarMenu(menuIndex, 'titulo_menu', valor)} disabled={soloLectura} required maxLength={150} /><label className="ge-field"><span>Estado del menú</span><select value={String(menu.esta_activo)} onChange={event => actualizarMenu(menuIndex, 'esta_activo', event.target.value === 'true')} disabled={soloLectura}><option value="true">Activo</option><option value="false">Oculto</option></select></label><label className="ge-field ge-field-wide"><span>Descripción del menú</span><textarea className="ge-textarea" rows={2} value={menu.descripcion} onChange={event => actualizarMenu(menuIndex, 'descripcion', event.target.value)} disabled={soloLectura} placeholder="Por ejemplo: almuerzos, cafetería o bebidas" /></label></div>
              <div className="ge-menu-items-heading"><h4>Platillos y bebidas</h4>{!soloLectura && <button type="button" className="ge-button ge-add-service" disabled={!categoriasMenu.length} onClick={() => actualizarMenu(menuIndex, 'items', [...menu.items, { nombre_platillo: '', descripcion: '', precio: '', moneda: 'NIO', url_foto: '', id_categoria_menu: '', es_vegetariano: false, esta_disponible: true }])}><Plus size={16} /> Agregar platillo</button>}</div>
              {!categoriasMenu.length && !soloLectura && <p className="ge-empty-section" role="status">No se pudieron cargar categorías de menú. Actualiza la página antes de agregar platillos.</p>}
              {!menu.items.length && <p className="ge-empty-section">Este menú todavía no tiene platillos.</p>}
              <div className="ge-item-list">{menu.items.map((item, itemIndex) => <div className="ge-item-card" key={item.id_item || `nuevo-${menuIndex}-${itemIndex}`}>
                <div className="ge-menu-top"><span className="ge-menu-number">Platillo {itemIndex + 1}</span>{!soloLectura && !item.id_item && <button type="button" className="ge-remove-service" onClick={() => actualizarMenu(menuIndex, 'items', menu.items.filter((_, i) => i !== itemIndex))}><Trash2 size={16} /> Quitar</button>}</div>
                <div className="ge-form-grid">
                  <TextField label="Nombre" icon={Tag} value={item.nombre_platillo} onChange={valor => actualizarPlatillo(menuIndex, itemIndex, 'nombre_platillo', valor)} disabled={soloLectura} required maxLength={150} />
                  <label className="ge-field"><span>Categoría del ítem <b>*</b></span><select value={item.id_categoria_menu} onChange={event => actualizarPlatillo(menuIndex, itemIndex, 'id_categoria_menu', event.target.value)} disabled={soloLectura} required><option value="">Selecciona una categoría</option>{item.id_categoria_menu && !categoriasMenu.some(categoria => String(categoria.id_categoria_menu) === item.id_categoria_menu) && <option value={item.id_categoria_menu}>Categoría actual (#{item.id_categoria_menu})</option>}{categoriasMenu.map(categoria => <option key={categoria.id_categoria_menu} value={categoria.id_categoria_menu}>{categoria.nombre}</option>)}</select><small className="ge-field-hint">El presupuesto usa «Plato Fuerte» y «Bebida No Alcohólica» en córdobas, de menús activos e ítems disponibles.</small></label>
                  <label className="ge-field ge-field-wide"><span>Descripción</span><textarea className="ge-textarea" rows={2} value={item.descripcion} onChange={event => actualizarPlatillo(menuIndex, itemIndex, 'descripcion', event.target.value)} disabled={soloLectura} /></label>
                  <label className="ge-field"><span>Precio <b>*</b></span><input className="ge-plain-input" type="number" min="0" step="0.01" value={item.precio} onChange={event => actualizarPlatillo(menuIndex, itemIndex, 'precio', event.target.value)} disabled={soloLectura} required /></label>
                  <label className="ge-field"><span>Moneda</span><select value={item.moneda} onChange={event => actualizarPlatillo(menuIndex, itemIndex, 'moneda', event.target.value)} disabled={soloLectura}><option value="NIO">Córdobas (C$)</option><option value="USD">Dólares (US$)</option></select></label>
                  <label className="ge-field ge-field-wide"><span>Foto del platillo (URL opcional)</span><input className="ge-plain-input" type="url" maxLength={255} placeholder="https://" value={item.url_foto} onChange={event => actualizarPlatillo(menuIndex, itemIndex, 'url_foto', event.target.value)} disabled={soloLectura} /></label>
                </div>
                <div className="ge-item-options"><label><input type="checkbox" checked={item.es_vegetariano} onChange={event => actualizarPlatillo(menuIndex, itemIndex, 'es_vegetariano', event.target.checked)} disabled={soloLectura} /> Vegetariano</label><label><input type="checkbox" checked={item.esta_disponible} onChange={event => actualizarPlatillo(menuIndex, itemIndex, 'esta_disponible', event.target.checked)} disabled={soloLectura} /> Disponible</label></div>
              </div>)}</div>
            </div>)}</div>
          </section>
          {modalError && <div className="ge-error" role="alert">{modalError}</div>}
          <div className="ge-dialog-actions"><button type="button" className="ge-button ge-outline" onClick={cerrar} disabled={guardando}><ArrowLeft size={17} /> Volver al listado</button>{soloLectura ? <>{form.esta_publicado && <Link className="ge-button ge-outline" to={`/buscar?tipo=local&q=${encodeURIComponent(form.nombre)}`}>Ver en búsqueda</Link>}<button type="button" className="ge-button ge-primary" onClick={() => { setModal(actual => ({ ...actual, tipo: 'editar' })); setModalError('') }}><Pencil size={17} /> Editar datos</button></> : <button type="submit" className="ge-button ge-orange" disabled={guardando}>{guardando ? <LoaderCircle className="ge-spinner" size={17} /> : <Save size={17} />} Guardar cambios</button>}</div>
        </form>}
    </section></div>}
  </div>
}
