import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User, LogOut, Heart } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { isAnimatedPage, shouldTransitionPage } from '../services/pageTransitions.js'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { sesion, signOut } = useAuth()

  function handleLogout() {
    signOut()
    navigate('/ingresar', { replace: true })
  }

  const linkClass = `
    text-sm font-semibold text-[#3A3A3A]
    transition-colors hover:text-[#C45111]
  `

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white/85 backdrop-blur-md ${isAnimatedPage(pathname) ? 'home-explore-navbar' : ''}`}
    >
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-7xl flex-wrap items-center
          justify-between gap-4 px-6 py-4 sm:px-10"
      >
        <Link
          to="/"
          viewTransition={shouldTransitionPage(pathname, '/')}
          className="flex flex-col"
          aria-label="SINATUR, ir al inicio"
        >
          <span
            className="font-serif text-2xl font-bold
              tracking-wider text-[#3A3A3A]"
          >
            SINATUR
          </span>

          <span className="text-[11px] text-[#6A6A6A]">
            Sistema Nacional de Turismo
          </span>
        </Link>

        <ul className="flex items-center gap-6">
          <li>
            <Link to="/" viewTransition={shouldTransitionPage(pathname, '/')} className={linkClass}>
              Inicio
            </Link>
          </li>

          <li><Link to="/calendario" viewTransition={shouldTransitionPage(pathname, '/calendario')} className={linkClass}>Eventos</Link></li>
          <li>
            <Link to="/buscar" viewTransition={shouldTransitionPage(pathname, '/buscar')} className={linkClass}>
              Explorar
            </Link>
          </li>

        </ul>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className="hidden items-center gap-1
              text-xs text-[#526554] sm:inline-flex"
            lang="es"
          >
            
          </span>

          {sesion ? (
            <>
              <Link to="/favoritos" viewTransition={shouldTransitionPage(pathname, '/favoritos')} aria-current={pathname === '/favoritos' ? 'page' : undefined} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#344e3b] hover:bg-[#eaf0e7]"><Heart size={18} aria-hidden="true" /> Favoritos</Link>
              <Link
                to="/account"
                viewTransition={shouldTransitionPage(pathname, '/account')}
                aria-current={
                  pathname === '/account' ? 'page' : undefined
                }
                className="inline-flex min-h-11 items-center gap-2
                  rounded-full bg-[#eaf0e7] px-4 text-sm
                  font-semibold text-[#344e3b]"
              >
                <User size={18} aria-hidden="true" />
                Mi cuenta
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-11 items-center gap-2
                  rounded-full border border-[#d8e1d5] px-4
                  text-sm font-semibold text-[#344e3b]
                  hover:bg-gray-100"
              >
                <LogOut size={17} aria-hidden="true" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/ingresar"
                className="inline-flex min-h-11 items-center gap-2
                  rounded-full px-4 text-sm font-semibold
                  text-[#344e3b] hover:bg-gray-100"
              >
                <User size={18} aria-hidden="true" />
                Ingresar
              </Link>

              <Link
                to="/registro-negocio"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#C45111]
                  px-5 text-sm font-semibold text-white hover:bg-[#9d3e0b]"
              >
                Publícate con nosotros
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
