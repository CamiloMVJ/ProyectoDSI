import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Compass, Eye, Image as ImageIcon, LoaderCircle, MapPin, Pencil, Plus, Save, Search, Trash2 } from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import LocalImagesGallery from '../Components/LocalImagesGallery.jsx'
import ClosedDaysCalendar from '../Components/ClosedDaysCalendar.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getCategories, getDepartments } from '../services/places.api.js'
import { getManagedPlaces, getManagedPlace, getPlaceAdministrators, saveManagedPlace } from '../services/managedPlaces.api.js'
import '../css/gestion-establecimientos.css'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const typeNames = { complejo: 'Complejo turístico', atractivo: 'Atractivo independiente', otro: 'Lugar turístico' }
const text = value => value ?? ''

function toForm(place) {
  return {
    tipo: place.tipo,
    nombre: place.nombre,
    descripcion: text(place.descripcion),
    id_departamento: String(place.id_departamento),
    municipio: place.municipio,
    direccion_exacta: text(place.direccion_exacta),
    maps_link: text(place.maps_link),
    telefono_contacto: text(place.telefono_contacto),
    correo_contacto: text(place.correo_contacto),
    sitio_web: text(place.sitio_web),
    capacidad_locales: place.capacidad_locales == null ? '' : String(place.capacidad_locales),
    cobro_entrada: Boolean(place.cobro_entrada),
    costo_entrada: place.costo_entrada == null ? '' : String(place.costo_entrada),
    tipo_acceso: text(place.tipo_acceso),
    entidad_encargada: text(place.entidad_encargada),
    normativa_visitantes: text(place.normativa_visitantes),
    id_administrador: place.id_administrador == null ? '' : String(place.id_administrador),
    categorias: (place.categorias || []).map(String),
    horarios: (place.horarios || []).map(horario => ({
      id_horario: horario.id_horario,
      dia_semana: horario.dia_semana,
      hora_apertura: horario.hora_apertura,
      hora_cierre: horario.hora_cierre,
      es_feriado: Boolean(horario.es_feriado),
    })),
  }
}

function toPayload(form) {
  const payload = {
    tipo: form.tipo,
    nombre: form.nombre.trim(), descripcion: form.descripcion.trim() || null,
    id_departamento: Number(form.id_departamento), municipio: form.municipio.trim(),
    direccion_exacta: form.direccion_exacta.trim() || null,
    maps_link: form.maps_link.trim() || null,
    telefono_contacto: form.telefono_contacto.trim() || null,
    correo_contacto: form.correo_contacto.trim() || null,
    sitio_web: form.sitio_web.trim() || null,
    categorias: form.categorias.map(Number),
    horarios: form.horarios,
  }
  if (form.tipo !== 'otro') payload.id_administrador = form.id_administrador ? Number(form.id_administrador) : null
  if (form.tipo === 'complejo') {
    payload.capacidad_locales = form.capacidad_locales === '' ? null : Number(form.capacidad_locales)
    payload.cobro_entrada = form.cobro_entrada
    payload.costo_entrada = form.cobro_entrada && form.costo_entrada !== '' ? Number(form.costo_entrada) : null
  }
  if (form.tipo === 'atractivo') {
    payload.tipo_acceso = form.tipo_acceso.trim() || null
    payload.entidad_encargada = form.entidad_encargada.trim() || null
    payload.normativa_visitantes = form.normativa_visitantes.trim() || null
  }
  return payload
}

function Field({ label, value, onChange, required = false, type = 'text', maxLength = 255, min, max, step }) {
  return <label className="ge-field"><span>{label}{required && <b> *</b>}</span><input className="ge-plain-input" value={value} onChange={event => onChange(event.target.value)} required={required} type={type} maxLength={maxLength} min={min} max={max} step={step} /></label>
}

export default function GestionLugares() {
  const { sesion } = useAuth()
  const { id: editId } = useParams()
  const [places, setPlaces] = useState([])
  const [departments, setDepartments] = useState([])
  const [categories, setCategories] = useState([])
  const [administrators, setAdministrators] = useState([])
  const [form, setForm] = useState(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('todos')
  const [page, setPage] = useState(1)
  const [loadedKey, setLoadedKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const loadKey = `${sesion?.token ?? ''}:${editId ?? ''}`
  const loading = loadedKey !== loadKey

  useEffect(() => {
    if (sesion?.usuario.rol !== 'Administrador') return
    const controller = new AbortController()
    Promise.all([
      getManagedPlaces(sesion.token, controller.signal),
      getDepartments(controller.signal),
      getCategories(controller.signal),
      getPlaceAdministrators(sesion.token, controller.signal),
      editId ? getManagedPlace(sesion.token, editId, controller.signal) : Promise.resolve(null),
    ]).then(([data, regions, tags, admins, place]) => {
      if (controller.signal.aborted) return
      setPlaces(data)
      setDepartments(regions)
      setCategories(tags)
      setAdministrators(admins)
      setForm(place ? toForm(place) : null)
      setError('')
    }).catch(fetchError => {
      if (!controller.signal.aborted) setError(fetchError.message || 'No se pudieron cargar los lugares turísticos.')
    }).finally(() => {
      if (!controller.signal.aborted) setLoadedKey(loadKey)
    })
    return () => controller.abort()
  }, [sesion, editId, loadKey])

  const filtered = useMemo(() => places.filter(place => {
    if (typeFilter !== 'todos' && place.tipo !== typeFilter) return false
    const query = search.trim().toLocaleLowerCase('es')
    return !query || [place.nombre, place.municipio, place.departamento].some(value =>
      String(value ?? '').toLocaleLowerCase('es').includes(query))
  }), [places, search, typeFilter])
  const pageSize = 5
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const firstVisiblePage = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => firstVisiblePage + index)

  if (!sesion) return <Navigate to="/ingresar" replace />
  if (sesion.usuario.rol !== 'Administrador') return <Navigate to="/account" replace />

  function update(field, value) {
    setForm(current => ({ ...current, [field]: value }))
    setNotice('')
  }

  function updateHour(index, field, value) {
    setForm(current => ({ ...current, horarios: current.horarios.map((hour, position) =>
      position === index ? { ...hour, [field]: value } : hour) }))
    setNotice('')
  }

  async function save(event) {
    event.preventDefault()
    if (saving || !form) return
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const saved = await saveManagedPlace(sesion.token, editId, toPayload(form))
      setForm(toForm(saved))
      setPlaces(current => current.map(place => String(place.id_lugar) === editId ? saved : place))
      setNotice('Los cambios del lugar turístico se guardaron correctamente.')
    } catch (saveError) {
      setError(saveError.message || 'No se pudieron guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  return <div id="inicio" className="ge-page"><Navbar /><main className="ge-main">
    <header className="ge-intro"><p className="ge-kicker">ADMINISTRACIÓN DE DESTINOS</p><h1>{editId ? 'Editar lugar turístico' : 'Lugares turísticos'}</h1></header>
    {loading ? <p className="ge-loading" role="status"><LoaderCircle className="ge-spinner" size={20} /> Cargando lugares turísticos…</p> : editId ? <>
      <div className="ge-editor-surface"><div className="ge-editor-card">
        <div className="ge-dialog-header"><h2><Compass size={25} aria-hidden="true" /> {form?.nombre || 'Lugar turístico'}</h2><Link className="ge-button ge-outline" to="/gestion-lugares"><ArrowLeft size={17} /> Volver al listado</Link></div>
        {!form ? <div className="ge-error" role="alert">{error || 'El lugar turístico no existe.'}</div> : <form className="ge-form" onSubmit={save}>
          <p className="ge-form-intro">Edita los datos generales y los de {typeNames[form.tipo].toLocaleLowerCase('es')}. Las imágenes y los días de cierre se guardan al momento.</p>
          <LocalImagesGallery key={editId} idLocal={editId} token={sesion.token} basePath="/gestion-lugares" />
          <section className="ge-form-section" aria-labelledby="place-general"><div className="ge-section-heading"><span className="ge-section-icon"><MapPin size={20} /></span><div><h3 id="place-general">Datos generales</h3><p>Información pública, ubicación y contacto</p></div></div>
            <div className="ge-form-grid">
              <Field label="Nombre" value={form.nombre} onChange={value => update('nombre', value)} required maxLength={150} />
              <label className="ge-field"><span>Departamento *</span><select value={form.id_departamento} onChange={event => update('id_departamento', event.target.value)} required><option value="">Selecciona un departamento</option>{departments.map(department => <option key={department.id_departamento} value={department.id_departamento}>{department.nombre}</option>)}</select></label>
              <Field label="Municipio" value={form.municipio} onChange={value => update('municipio', value)} required maxLength={100} />
              <Field label="Dirección exacta" value={form.direccion_exacta} onChange={value => update('direccion_exacta', value)} />
              <Field label="Enlace de Google Maps" value={form.maps_link} onChange={value => update('maps_link', value)} type="url" />
              <Field label="Teléfono o WhatsApp" value={form.telefono_contacto} onChange={value => update('telefono_contacto', value)} maxLength={30} />
              <Field label="Correo de contacto" value={form.correo_contacto} onChange={value => update('correo_contacto', value)} type="email" maxLength={150} />
              <Field label="Sitio web o red social" value={form.sitio_web} onChange={value => update('sitio_web', value)} />
              <label className="ge-field ge-field-wide"><span>Descripción</span><textarea className="ge-textarea" rows={4} value={form.descripcion} onChange={event => update('descripcion', event.target.value)} /></label>
            </div>
          </section>
          {form.tipo !== 'otro' && <section className="ge-form-section" aria-labelledby="place-specific"><div className="ge-section-heading"><span className="ge-section-icon"><Compass size={20} /></span><div><h3 id="place-specific">{typeNames[form.tipo]}</h3><p>Datos específicos de este tipo de lugar</p></div></div>
            <div className="ge-form-grid">
              <label className="ge-field"><span>Administrador encargado</span><select value={form.id_administrador} onChange={event => update('id_administrador', event.target.value)}><option value="">Sin asignar</option>{administrators.map(admin => <option key={admin.id_administrador} value={admin.id_administrador}>{admin.nombre_completo}</option>)}</select></label>
              {form.tipo === 'complejo' ? <>
                <Field label="Capacidad de locales" value={form.capacidad_locales} onChange={value => update('capacidad_locales', value)} type="number" min="0" max="2147483647" step="1" />
                <label className="ge-field"><span>Cobro de entrada</span><select value={String(form.cobro_entrada)} onChange={event => update('cobro_entrada', event.target.value === 'true')}><option value="false">Entrada gratuita</option><option value="true">Cobra entrada</option></select></label>
                {form.cobro_entrada && <label className="ge-field"><span>Costo de entrada (C$) *</span><input className="ge-plain-input" type="number" min="0" step="0.01" max="99999999.99" value={form.costo_entrada} onChange={event => update('costo_entrada', event.target.value)} required /></label>}
              </> : <>
                <Field label="Tipo de acceso" value={form.tipo_acceso} onChange={value => update('tipo_acceso', value)} maxLength={100} />
                <Field label="Entidad encargada" value={form.entidad_encargada} onChange={value => update('entidad_encargada', value)} maxLength={150} />
                <label className="ge-field ge-field-wide"><span>Normativa para visitantes</span><textarea className="ge-textarea" rows={3} value={form.normativa_visitantes} onChange={event => update('normativa_visitantes', event.target.value)} /></label>
              </>}
            </div>
          </section>}
          <section className="ge-form-section" aria-labelledby="place-categories"><div className="ge-section-heading"><span className="ge-section-icon"><Compass size={20} /></span><div><h3 id="place-categories">Categorías</h3><p>Ayudan a encontrar este destino en la búsqueda</p></div></div>
            <div className="ge-form-grid">{categories.map(category => <label key={category.id_categoria} className="ge-hours-holiday"><input type="checkbox" checked={form.categorias.includes(String(category.id_categoria))} onChange={event => update('categorias', event.target.checked ? [...form.categorias, String(category.id_categoria)] : form.categorias.filter(id => id !== String(category.id_categoria)))} /> {category.nombre}</label>)}</div>
          </section>
          <section className="ge-form-section" aria-labelledby="place-hours"><div className="ge-services-header"><div className="ge-section-heading"><span className="ge-section-icon"><CalendarDays size={20} /></span><div><h3 id="place-hours">Horario de atención</h3><p>Turnos publicados para este lugar</p></div></div><button type="button" className="ge-button ge-add-service" onClick={() => update('horarios', [...form.horarios, { dia_semana: 'Lunes', hora_apertura: '08:00', hora_cierre: '17:00', es_feriado: false }])}><Plus size={17} /> Agregar horario</button></div>
            {!form.horarios.length && <p className="ge-empty-section">No hay horarios configurados.</p>}
            <div className="ge-hours-list">{form.horarios.map((hour, index) => <div className="ge-hours-row" key={hour.id_horario || `new-${index}`}>
              <label className="ge-field"><span>Día</span><select aria-label={`Día del horario ${index + 1}`} value={hour.dia_semana} onChange={event => updateHour(index, 'dia_semana', event.target.value)}>{days.map(day => <option key={day} value={day}>{day}</option>)}</select></label>
              <label className="ge-field"><span>Abre</span><input className="ge-plain-input" type="time" aria-label={`Hora de apertura ${index + 1}`} value={hour.hora_apertura} onChange={event => updateHour(index, 'hora_apertura', event.target.value)} required /></label>
              <label className="ge-field"><span>Cierra</span><input className="ge-plain-input" type="time" aria-label={`Hora de cierre ${index + 1}`} value={hour.hora_cierre} onChange={event => updateHour(index, 'hora_cierre', event.target.value)} required /></label>
              <label className="ge-hours-holiday"><input type="checkbox" checked={hour.es_feriado} onChange={event => updateHour(index, 'es_feriado', event.target.checked)} /> Horario de feriado</label>
              <button type="button" className="ge-remove-service ge-hours-remove" onClick={() => update('horarios', form.horarios.filter((_, position) => position !== index))}><Trash2 size={17} /> Quitar</button>
            </div>)}</div>
          </section>
          <ClosedDaysCalendar key={`closed-${editId}`} idLocal={editId} token={sesion.token} basePath="/gestion-lugares" />
          {notice && <div className="ge-notice" role="status">{notice}</div>}
          {error && <div className="ge-error" role="alert">{error}</div>}
          <div className="ge-dialog-actions"><Link className="ge-button ge-outline" to="/gestion-lugares"><ArrowLeft size={17} /> Volver</Link><button className="ge-button ge-orange" type="submit" disabled={saving}>{saving ? <LoaderCircle className="ge-spinner" size={17} /> : <Save size={17} />} Guardar cambios</button></div>
        </form>}
      </div></div>
    </> : <section className="ge-panel" aria-label="Gestión de lugares turísticos"><div className="ge-panel-heading"><span className="ge-main-icon"><Compass size={30} /></span><div><h2>Gestión de lugares turísticos</h2><p>Consulta y edita complejos turísticos y atractivos independientes.</p></div></div>
      <div className="ge-table-card"><div className="ge-list-head"><h3><Compass size={24} /> Listado de lugares</h3></div>
        {error && <div className="ge-error" role="alert">{error}</div>}
        <div className="ge-place-filters"><label className="ge-search"><Search size={20} aria-hidden="true" /><input value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} placeholder="Buscar lugar, municipio o departamento..." aria-label="Buscar lugares turísticos" /></label><label className="ge-place-type-filter"><span>Tipo</span><select value={typeFilter} onChange={event => { setTypeFilter(event.target.value); setPage(1) }} aria-label="Filtrar por tipo de lugar"><option value="todos">Todos</option><option value="complejo">Complejos turísticos</option><option value="atractivo">Atractivos independientes</option><option value="otro">Otros lugares</option></select></label></div>
        <div className="ge-table-wrap"><table className="ge-table ge-table-places"><thead><tr><th>Nombre del lugar</th><th>Tipo</th><th>Ubicación</th><th>Imágenes</th><th>Acciones</th></tr></thead><tbody>{visible.map(place => <tr key={place.id_lugar}><td><span className="ge-business"><Compass size={18} aria-hidden="true" /><strong title={place.nombre}>{place.nombre}</strong></span></td><td>{typeNames[place.tipo]}</td><td title={`${place.municipio}, ${place.departamento}`}>{place.municipio}, {place.departamento}</td><td><span className="ge-business"><ImageIcon size={17} aria-hidden="true" /> {place.imagenes.length}</span></td><td><div className="ge-actions"><Link to={`/perfil-lugar/${place.id_lugar}`} title="Consultar" aria-label={`Consultar ${place.nombre}`}><Eye size={18} /></Link><Link to={`/gestion-lugares/${place.id_lugar}/editar`} title="Editar" aria-label={`Editar ${place.nombre}`}><Pencil size={18} /></Link></div></td></tr>)}{!visible.length && <tr><td colSpan="5" className="ge-empty">{search.trim() || typeFilter !== 'todos' ? 'No hay lugares que coincidan con la búsqueda.' : 'Todavía no hay lugares turísticos registrados.'}</td></tr>}</tbody></table></div>
        <div className="ge-table-bottom"><span>Mostrando {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filtered.length)} de {filtered.length} lugares</span><nav className="ge-pages" aria-label="Paginación"><button type="button" disabled={currentPage === 1} onClick={() => setPage(value => value - 1)} aria-label="Página anterior"><ChevronLeft size={18} /></button>{pageNumbers.map(number => <button type="button" key={number} aria-current={currentPage === number ? 'page' : undefined} className={currentPage === number ? 'ge-page-current' : ''} onClick={() => setPage(number)}>{number}</button>)}<button type="button" disabled={currentPage === totalPages} onClick={() => setPage(value => value + 1)} aria-label="Página siguiente"><ChevronRight size={18} /></button></nav></div>
      </div>
    </section>}
  </main><Footer /></div>
}
