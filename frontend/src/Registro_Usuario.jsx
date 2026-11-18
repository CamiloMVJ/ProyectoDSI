import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Compass, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, MapPin, Phone, UserRound } from 'lucide-react'
import { useAuth } from './hooks/useAuth.js'
import { registerAccount } from './services/userAccount.api.js'

const initialValues = {
  nombre_completo: '',
  email: '',
  telefono: '',
  password: '',
  confirmar_password: '',
}

export default function RegistroUsuarioSINATUR() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [values, setValues] = useState(initialValues)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(false)
  const [enviando, setEnviando] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues(current => ({ ...current, [name]: value }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (enviando || created) return

    if (values.password !== values.confirmar_password) {
      setError('Las contraseñas no coinciden.')
      document.getElementById('register-confirm-password')?.focus()
      return
    }

    setError('')
    setEnviando(true)
    const email = values.email.trim()

    try {
      await registerAccount({
        nombre_completo: values.nombre_completo.trim(),
        email,
        telefono: values.telefono.trim(),
        password: values.password,
      })
      setCreated(true)

      try {
        await signIn({ email, password: values.password })
        navigate('/account', { replace: true })
      } catch {
        setValues(current => ({ ...current, password: '', confirmar_password: '' }))
      }
    } catch (requestError) {
      setError(requestError instanceof TypeError
        ? 'No se pudo conectar con el servidor.'
        : requestError.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-page">
      <main className="auth-card auth-card-login auth-card-user-register">
        <section className="auth-intro" aria-labelledby="register-welcome-title">
          <Link className="auth-brand" to="/" aria-label="SINATUR, volver al inicio">
            <span className="auth-brand-icon"><Compass aria-hidden="true" size={25} /></span>
            <span><strong>SINATUR</strong><small>Sistema Nacional de Turismo</small></span>
          </Link>
          <div className="auth-intro-content">
            <span className="auth-eyebrow">Descubre Nicaragua</span>
            <h1 id="register-welcome-title">Tu próxima experiencia comienza aquí.</h1>
            <p>Crea tu cuenta y explora destinos y negocios turísticos de todo el país.</p>
            <span className="auth-location"><MapPin aria-hidden="true" size={18} /> Nicaragua, tierra de lagos y volcanes</span>
          </div>
        </section>

        <section className="auth-form-panel" aria-labelledby="register-title">
          <Link className="auth-back" to="/ingresar"><ArrowLeft aria-hidden="true" size={18} /> Volver a iniciar sesión</Link>
          <div className="auth-heading">
            <span className="auth-eyebrow">Forma parte de SINATUR</span>
            <h2 id="register-title">Crear cuenta</h2>
            <p>Completa tus datos para empezar a descubrir Nicaragua.</p>
          </div>

          {created ? (
            <div className="auth-form" role="status">
              <p className="auth-notice">Tu cuenta se creó correctamente. Ingresa con tu correo y contraseña para continuar.</p>
              <Link className="auth-primary auth-primary-link" to="/ingresar">Iniciar sesión <ArrowRight aria-hidden="true" size={19} /></Link>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="register-name">Nombre completo</label>
                <div className="auth-input-wrap"><UserRound aria-hidden="true" size={19} />
                  <input id="register-name" name="nombre_completo" type="text" autoComplete="name" placeholder="Tu nombre completo" minLength={3} maxLength={150} value={values.nombre_completo} onChange={handleChange} disabled={enviando} required />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="register-email">Correo electrónico</label>
                <div className="auth-input-wrap"><Mail aria-hidden="true" size={19} />
                  <input id="register-email" name="email" type="email" autoComplete="email" placeholder="ejemplo@correo.com" maxLength={150} value={values.email} onChange={handleChange} disabled={enviando} required />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="register-phone">Número de teléfono <span className="auth-optional">(opcional)</span></label>
                <div className="auth-input-wrap"><Phone aria-hidden="true" size={19} />
                  <input id="register-phone" name="telefono" type="tel" autoComplete="tel" placeholder="Tu número de teléfono" maxLength={30} value={values.telefono} onChange={handleChange} disabled={enviando} />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="register-password">Contraseña</label>
                <div className="auth-input-wrap"><LockKeyhole aria-hidden="true" size={19} />
                  <input id="register-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Mínimo 8 caracteres" minLength={8} maxLength={255} value={values.password} onChange={handleChange} disabled={enviando} required />
                  <button type="button" className="auth-icon-button" onClick={() => setShowPassword(current => !current)} aria-label={showPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'} aria-pressed={showPassword}>
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="register-confirm-password">Confirmar contraseña</label>
                <div className="auth-input-wrap"><LockKeyhole aria-hidden="true" size={19} />
                  <input id="register-confirm-password" name="confirmar_password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Repite tu contraseña" minLength={8} maxLength={255} value={values.confirmar_password} onChange={handleChange} disabled={enviando} required />
                </div>
              </div>
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button type="submit" className="auth-primary" disabled={enviando} aria-busy={enviando}>
                {enviando ? <><LoaderCircle aria-hidden="true" size={19} className="animate-spin motion-reduce:animate-none" /> Creando cuenta…</> : <>Crear cuenta <ArrowRight aria-hidden="true" size={19} /></>}
              </button>
            </form>
          )}
          <p className="auth-switch">¿Ya tienes cuenta? <Link to="/ingresar">Inicia sesión</Link></p>
          <p className="auth-switch auth-switch-secondary">¿Tienes un negocio turístico? <Link to="/registro-negocio">Solicita una cuenta</Link></p>
        </section>
      </main>
    </div>
  )
}
