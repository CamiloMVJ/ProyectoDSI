import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Compass, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, MapPin } from 'lucide-react'
import { useAuth } from './hooks/useAuth.js'

export default function LoginSINATUR() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [credenciales, setCredenciales] = useState({
    email: '',
    password: '',
  })

  async function handleSubmit(event) {
    event.preventDefault()

    if (enviando) return

    setMessage('')
    setEnviando(true)

    try {
      await signIn({
        email: credenciales.email.trim(),
        password: credenciales.password,
      })

      navigate('/account', { replace: true })
    } catch (error) {
      setMessage(
        error instanceof TypeError
          ? 'No se pudo conectar con el servidor.'
          : error.message
      )
    } finally {
      setEnviando(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setCredenciales(actual => ({
      ...actual,
      [name]: value,
    }))

    setMessage('')
  }
  return (
    <div className="auth-page">
      <main className="auth-card auth-card-login">
        <section className="auth-intro" aria-labelledby="welcome-title">
          <Link className="auth-brand" to="/" aria-label="SINATUR, volver al inicio">
            <span className="auth-brand-icon"><Compass aria-hidden="true" size={25} /></span>
            <span><strong>SINATUR</strong><small>Sistema Nacional de Turismo</small></span>
          </Link>
          <div className="auth-intro-content">
            <span className="auth-eyebrow">Descubre Nicaragua</span>
            <h1 id="welcome-title">Tu próxima experiencia comienza aquí.</h1>
            <p>Explora destinos y conecta con los negocios turísticos de todo el país.</p>
            <span className="auth-location"><MapPin aria-hidden="true" size={18} /> Nicaragua, tierra de lagos y volcanes</span>
          </div>
        </section>

        <section className="auth-form-panel" aria-labelledby="login-title">
          <Link className="auth-back" to="/"><ArrowLeft aria-hidden="true" size={18} /> Volver al inicio</Link>
          <div className="auth-heading">
            <span className="auth-eyebrow">Bienvenido de nuevo</span>
            <h2 id="login-title">Iniciar sesión</h2>
            <p>Ingresa tus datos para acceder a tu cuenta de SINATUR.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Correo electrónico</label>
              <div className="auth-input-wrap"><Mail aria-hidden="true" size={19} />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={credenciales.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="ejemplo@correo.com"
                  disabled={enviando}
                  required
                />
              </div>
            </div>
            <div className="auth-field">
              <label htmlFor="login-password">Contraseña</label>
              <div className="auth-input-wrap"><LockKeyhole aria-hidden="true" size={19} />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credenciales.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  disabled={enviando}
                  required
                />
                <button type="button" className="auth-icon-button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword}>
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>
            {message && <p className="auth-notice" role="status">{message}</p>}
            <button type="submit" className="auth-primary" disabled={enviando} aria-busy={enviando}>
              {enviando ? (
                <>
                  <LoaderCircle aria-hidden="true" size={19} className="animate-spin motion-reduce:animate-none" />
                  Iniciando sesión…
                </>
              ) : (
                <>Iniciar sesión <ArrowRight aria-hidden="true" size={19} /></>
              )}
            </button>
          </form>
          <p className="auth-switch">¿Tienes un negocio turístico? <Link to="/registro-negocio">Solicita una cuenta</Link></p>
        </section>
      </main>
    </div>
  )
}
