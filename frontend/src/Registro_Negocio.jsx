import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, Compass, FileText, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react'

const ownerFields = [
  { id: 'owner-name', label: 'Nombre completo', name: 'nombre_completo', type: 'text', autoComplete: 'name', Icon: UserRound },
  { id: 'owner-email', label: 'Correo electrónico', name: 'email', type: 'email', autoComplete: 'email', Icon: Mail },
  { id: 'owner-email-confirm', label: 'Confirmar correo electrónico', name: 'confirmar_email', type: 'email', autoComplete: 'off', Icon: Mail },
  { id: 'owner-phone', label: 'Número de teléfono', name: 'telefono', type: 'tel', autoComplete: 'tel', Icon: Phone },
  { id: 'owner-password', label: 'Contraseña', name: 'password', type: 'password', autoComplete: 'new-password', Icon: LockKeyhole },
  { id: 'owner-password-confirm', label: 'Confirmar contraseña', name: 'confirmar_password', type: 'password', autoComplete: 'new-password', Icon: LockKeyhole },
]

export default function RegistroNegocioSINATUR() {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (data.get('email') !== data.get('confirmar_email')) {
      setError('Los correos electrónicos no coinciden.')
      setMessage('')
      document.getElementById('owner-email-confirm')?.focus()
      return
    }
    if (data.get('password') !== data.get('confirmar_password')) {
      setError('Las contraseñas no coinciden.')
      setMessage('')
      document.getElementById('owner-password-confirm')?.focus()
      return
    }
    setError('')
    setMessage('El envío de solicitudes estará disponible cuando se conecte el servicio de cuentas.')
  }

  return (
    <div className="auth-page auth-page-register">
      <main className="auth-card auth-card-register">
        <header className="auth-register-header">
          <Link className="auth-brand" to="/" aria-label="SINATUR, volver al inicio"><span className="auth-brand-icon"><Compass aria-hidden="true" size={25} /></span><span><strong>SINATUR</strong><small>Sistema Nacional de Turismo</small></span></Link>
          <Link className="auth-header-link" to="/ingresar">¿Ya tienes cuenta? Ingresar <ArrowRight aria-hidden="true" size={17} /></Link>
        </header>
        <div className="auth-register-body">
          <div className="auth-heading">
            <span className="auth-eyebrow">Forma parte de SINATUR</span>
            <h1>Registra tu negocio</h1>
            <p>Completa los datos del propietario y del negocio para solicitar una cuenta.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit} onReset={() => { setError(''); setMessage('') }}>
            <div className="auth-columns">
              <section className="auth-form-section" aria-labelledby="owner-title">
                <div className="auth-section-heading"><span className="auth-section-icon"><UserRound aria-hidden="true" size={22} /></span><div><h2 id="owner-title">Datos del propietario</h2><p>Información de contacto del titular</p></div></div>
                {ownerFields.map(({ id, label, name, type, autoComplete, Icon }) => (
                  <div className="auth-field" key={id}><label htmlFor={id}>{label}</label><div className="auth-input-wrap"><Icon aria-hidden="true" size={19} /><input id={id} name={name} type={type} autoComplete={autoComplete} required /></div></div>
                ))}
              </section>
              <section className="auth-form-section" aria-labelledby="business-title">
                <div className="auth-section-heading"><span className="auth-section-icon"><Building2 aria-hidden="true" size={22} /></span><div><h2 id="business-title">Datos del negocio</h2><p>Información comercial</p></div></div>
                <div className="auth-field"><label htmlFor="business-name">Nombre del negocio</label><div className="auth-input-wrap"><Building2 aria-hidden="true" size={19} /><input id="business-name" name="nombre_negocio" type="text" autoComplete="organization" required /></div></div>
                <div className="auth-field"><label htmlFor="business-ruc">Número RUC</label><div className="auth-input-wrap"><FileText aria-hidden="true" size={19} /><input id="business-ruc" name="codigo_ruc" type="text" required /></div></div>
                <aside className="auth-info"><ShieldCheck aria-hidden="true" size={24} /><div><h3>Validación de solicitud</h3><p>La cuenta requiere una revisión de la información proporcionada. Cuando este servicio esté disponible, recibirás el estado de tu solicitud por correo electrónico.</p></div></aside>
              </section>
            </div>
            {error && <p className="auth-error" role="alert">{error}</p>}
            {message && <p className="auth-notice" role="status">{message}</p>}
            <div className="auth-form-actions"><Link className="auth-back" to="/ingresar"><ArrowLeft aria-hidden="true" size={18} /> Volver a iniciar sesión</Link><div><button className="auth-secondary" type="reset">Limpiar</button><button className="auth-primary" type="submit">Solicitar cuenta <ArrowRight aria-hidden="true" size={19} /></button></div></div>
          </form>
        </div>
      </main>
    </div>
  )
}
