import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store, Search, Plus, Eye, Pencil, Trash2, X, ChevronLeft, ChevronRight,
  MapPin, Mail, Phone, UserRound, FileText, Tag, Save, ArrowLeft, AlertTriangle
} from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import '../css/gestion-establecimientos.css'

// Demostración visual: no se conecta al backend ni guarda contraseñas.
const STORAGE_KEY = 'sinatur.establecimientos.visual.v2'
const vacio = () => ({ nombre: '', propietario: '', ruc: '', direccion: '', correo: '', telefono: '', usuario: '', estado: 'Activo', servicios: [] })
const copiar = (obj) => JSON.parse(JSON.stringify(obj))
const moneda = (n) => `C$ ${Number(n || 0).toLocaleString('es-NI')}`

export default function GestionEstablecimientosVista() {
  const navigate = useNavigate()
  const [negocios, setNegocios] = useState(() => {
    try { const guardados = JSON.parse(localStorage.getItem(STORAGE_KEY)); return Array.isArray(guardados) ? guardados : [] }
    catch { return [] }
  })
  const [buscar, setBuscar] = useState('')
  const [pagina, setPagina] = useState(1)
  const [modal, setModal] = useState(null) // { tipo: 'ver'|'editar'|'borrar', id? }
  const [form, setForm] = useState(vacio)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const tamPagina = 5

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(negocios)) }, [negocios])
  useEffect(() => { document.body.style.overflow = modal ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [modal])
  const filtrados = useMemo(() => negocios.filter(n => [n.nombre, n.propietario, n.ruc].join(' ').toLowerCase().includes(buscar.trim().toLowerCase())), [negocios, buscar])
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / tamPagina))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice((paginaActual - 1) * tamPagina, paginaActual * tamPagina)

  function abrir(tipo, negocio) {
    setForm(negocio ? copiar(negocio) : vacio())
    setModal({ tipo, id: negocio?.id })
    setError('')
    setMensaje('')
  }
  function cerrar() { setModal(null); setError('') }
  function actualizar(campo, valor) { setForm(prev => ({ ...prev, [campo]: valor })) }
  function actualizarServicio(index, campo, valor) {
    setForm(prev => ({ ...prev, servicios: prev.servicios.map((servicio, i) => i === index ? { ...servicio, [campo]: valor } : servicio) }))
  }
  function guardar(event) {
    event.preventDefault()
    const campos = ['nombre', 'propietario', 'ruc', 'direccion', 'correo', 'telefono']
    if (campos.some(c => !String(form[c]).trim())) { setError('Completa todos los campos obligatorios.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) { setError('Ingresa un correo electrónico válido.'); return }
    if (negocios.some(n => n.ruc.trim().toLowerCase() === form.ruc.trim().toLowerCase() && n.id !== modal.id)) { setError('Ya existe un establecimiento con ese RUC.'); return }
    if (form.servicios.some(s => !s.nombre.trim() || s.precio === '' || Number(s.precio) < 0 || !Number.isFinite(Number(s.precio)))) { setError('Revisa los nombres y precios de los servicios.'); return }
    const limpio = { ...form, nombre: form.nombre.trim(), propietario: form.propietario.trim(), ruc: form.ruc.trim(), correo: form.correo.trim(), servicios: form.servicios.map(s => ({ ...s, precio: Number(s.precio) })) }
    setNegocios(prev => prev.map(n => n.id === modal.id ? limpio : n))
    setPagina(1)
    setMensaje('Cambios guardados en la demostración.')
    cerrar()
  }
  function eliminar() {
    setNegocios(prev => prev.filter(n => n.id !== modal.id))
    setMensaje('Establecimiento eliminado de la demostración.')
    cerrar()
  }
  const soloLectura = modal?.tipo === 'ver'
  const etiqueta = modal?.tipo === 'editar' ? 'Editar establecimiento' : modal?.tipo === 'ver' ? 'Detalles del establecimiento' : 'Eliminar establecimiento'

  return (
    <div id="inicio" className="ge-page">
      <Navbar onPublishClick={() => navigate('/gestion-establecimientos')} />
      <main className="ge-main">
        <header className="ge-intro">
          <p className="ge-kicker">GESTIÓN DE ESTABLECIMIENTOS</p>
          <h1>Registra y administra tu negocio</h1>
        </header>
        <section className="ge-panel" aria-label="Gestión de establecimientos">
          <div className="ge-panel-heading"><span className="ge-main-icon"><Store size={30} /></span><div><h2>Gestión de establecimientos</h2><p>Administra las cuentas de propietarios y la información de sus establecimientos turísticos.</p></div></div>
          <div className="ge-table-card">
            <div className="ge-list-head"><h3><Store size={24} /> Listado de establecimientos</h3><button className="ge-button ge-primary" onClick={() => navigate('/registro-negocio')}><Plus size={18}/> Nuevo establecimiento</button></div>
            <label className="ge-search"><Search size={20}/><input value={buscar} onChange={e => { setBuscar(e.target.value); setPagina(1) }} placeholder="Buscar establecimiento, RUC o propietario..." aria-label="Buscar establecimiento" /></label>
            {mensaje && <div className="ge-notice" role="status">{mensaje}</div>}
            <div className="ge-table-wrap"><table className="ge-table"><thead><tr><th>Nombre del negocio</th><th>Propietario</th><th>RUC</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
              {visibles.map(n => <tr key={n.id}><td><span className="ge-business"><Store size={18}/><strong>{n.nombre}</strong></span></td><td>{n.propietario}</td><td>{n.ruc}</td><td><span className={`ge-status ${n.estado === 'Activo' ? 'ge-active' : 'ge-inactive'}`}>{n.estado}</span></td><td><div className="ge-actions"><button title="Consultar" aria-label={`Consultar ${n.nombre}`} onClick={() => abrir('ver', n)}><Eye size={18}/></button><button title="Editar" aria-label={`Editar ${n.nombre}`} onClick={() => abrir('editar', n)}><Pencil size={18}/></button><button className="ge-delete-icon" title="Eliminar" aria-label={`Eliminar ${n.nombre}`} onClick={() => abrir('borrar', n)}><Trash2 size={18}/></button></div></td></tr>)}
              {!visibles.length && <tr><td colSpan="5" className="ge-empty">{buscar.trim() ? 'No hay establecimientos que coincidan con tu búsqueda.' : 'Todavía no hay establecimientos registrados. Usa «Nuevo establecimiento» para agregar el primero.'}</td></tr>}
            </tbody></table></div>
            <div className="ge-table-bottom"><span>Mostrando {filtrados.length ? (paginaActual - 1) * tamPagina + 1 : 0}–{Math.min(paginaActual * tamPagina, filtrados.length)} de {filtrados.length} establecimientos</span><nav className="ge-pages" aria-label="Paginación"><button disabled={paginaActual === 1} onClick={() => setPagina(p => p - 1)} aria-label="Página anterior"><ChevronLeft size={18}/></button>{Array.from({ length: totalPaginas }, (_, i) => <button key={i} aria-current={paginaActual === i + 1 ? 'page' : undefined} className={paginaActual === i + 1 ? 'ge-page-current' : ''} onClick={() => setPagina(i + 1)}>{i + 1}</button>)}<button disabled={paginaActual === totalPaginas} onClick={() => setPagina(p => p + 1)} aria-label="Página siguiente"><ChevronRight size={18}/></button></nav></div>
          </div>
        </section>
      </main>
      <Footer />
      {modal && <div className="ge-overlay" onMouseDown={e => { if (e.target === e.currentTarget) cerrar() }}><section className="ge-dialog" role="dialog" aria-modal="true" aria-labelledby="ge-dialog-title"><div className="ge-dialog-header"><h2 id="ge-dialog-title">{modal.tipo === 'borrar' ? <AlertTriangle size={25}/> : <Store size={25}/>} {etiqueta}</h2><button className="ge-close" onClick={cerrar} aria-label="Cerrar"><X size={21}/></button></div>
        {modal.tipo === 'borrar' ? <div className="ge-confirm"><p>¿Deseas eliminar <strong>{form.nombre}</strong> del listado?</p><p>Esta acción se aplica solamente a los datos de demostración guardados en este navegador.</p><div className="ge-dialog-actions"><button className="ge-button ge-outline" onClick={cerrar}>Cancelar</button><button className="ge-button ge-danger" onClick={eliminar}><Trash2 size={18}/> Confirmar eliminación</button></div></div> :
          <form onSubmit={guardar} className="ge-form"><div className="ge-form-grid">
            {[[ 'propietario','Nombre del propietario', UserRound ],['correo','Correo electrónico',Mail],['nombre','Nombre del negocio',Store],['ruc','Número RUC',FileText],['direccion','Dirección',MapPin],['telefono','Teléfono',Phone],['usuario','Usuario',UserRound]].map(([campo, titulo, Icon]) => <label key={campo} className="ge-field"><span>{titulo} {campo !== 'usuario' && <b>*</b>}</span><span className="ge-input-shell"><Icon size={17}/><input value={form[campo]} disabled={soloLectura} required={campo !== 'usuario'} type={campo === 'correo' ? 'email' : 'text'} onChange={e => actualizar(campo, e.target.value)} maxLength={120}/></span></label>)}
            <label className="ge-field"><span>Estado *</span><select value={form.estado} disabled={soloLectura} onChange={e => actualizar('estado', e.target.value)}><option>Activo</option><option>Inactivo</option></select></label>
          </div><div className="ge-services-header"><h3>Servicios y precios</h3>{!soloLectura && <button type="button" className="ge-button ge-add-service" onClick={() => actualizar('servicios', [...form.servicios, { id: Date.now() + Math.random(), nombre: '', precio: '' }])}><Plus size={16}/> Agregar servicio</button>}</div>
          <div className="ge-services">{form.servicios.length === 0 && <p className="ge-no-services">No hay servicios registrados.</p>}{form.servicios.map((s, i) => <div className="ge-service-row" key={s.id}><Tag size={18}/>{soloLectura ? <><span>{s.nombre}</span><strong>{moneda(s.precio)}</strong></> : <><input aria-label={`Nombre del servicio ${i + 1}`} placeholder="Nombre del servicio" value={s.nombre} onChange={e => actualizarServicio(i,'nombre',e.target.value)} /><input aria-label={`Precio del servicio ${i + 1}`} type="number" min="0" step="0.01" placeholder="Precio C$" value={s.precio} onChange={e => actualizarServicio(i,'precio',e.target.value)} /><button type="button" className="ge-remove-service" aria-label="Quitar servicio" onClick={() => actualizar('servicios', form.servicios.filter((_, j) => j !== i))}><Trash2 size={18}/></button></>}</div>)}</div>
          {error && <div className="ge-error" role="alert">{error}</div>}
          <div className="ge-dialog-actions"><button type="button" className="ge-button ge-outline" onClick={cerrar}><ArrowLeft size={17}/> Volver al listado</button>{soloLectura ? <button type="button" className="ge-button ge-primary" onClick={() => { setModal({tipo:'editar',id:modal.id}); setError('') }}><Pencil size={17}/> Editar datos</button> : <button type="submit" className="ge-button ge-orange"><Save size={17}/> Guardar cambios</button>}</div></form>}
      </section></div>}
    </div>
  )
}
