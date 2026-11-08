import { Link, useLocation } from 'react-router-dom'
import { User, Languages, LogOut } from 'lucide-react'

export default function Navbar({
  usuario = null,
  onLogout,
  onLoginClick,
  onPublishClick,
}) {
  const { pathname } = useLocation()

  const linkClass = `
    text-sm font-semibold text-[#3A3A3A]
    transition-colors hover:text-[#C45111]
  `

  return (
    <header
      className="sticky top-0 z-50 w-full border-b
        border-gray-200/60 bg-white/85 backdrop-blur-md"
    >
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-7xl flex-wrap items-center
          justify-between gap-4 px-6 py-4 sm:px-10"
      >
        <Link
          to="/"
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
            <Link to="/" className={linkClass}>
              Inicio
            </Link>
          </li>

          <li>
            {pathname === '/' ? (
              <a href="#explorar" className={linkClass}>
                Explorar
              </a>
            ) : (
              <Link to="/" className={linkClass}>
                Explorar
              </Link>
            )}
          </li>

          <li>
            <a href="#contacto" className={linkClass}>
              Contacto
            </a>
          </li>
        </ul>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className="hidden items-center gap-1
              text-xs text-[#526554] sm:inline-flex"
            lang="es"
          >
            <Languages size={16} aria-hidden="true" />
            Español
          </span>

          {usuario ? (
            <>
              <Link
                to="/mi-cuenta"
                aria-current={
                  pathname === '/mi-cuenta' ? 'page' : undefined
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
                onClick={onLogout}
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
              <button
                type="button"
                onClick={onLoginClick}
                className="inline-flex min-h-11 items-center gap-2
                  rounded-full px-4 text-sm font-semibold
                  text-[#344e3b] hover:bg-gray-100"
              >
                <User size={18} aria-hidden="true" />
                Ingresar
              </button>

              {onPublishClick && (
                <button
                  type="button"
                  onClick={onPublishClick}
                  className="min-h-11 rounded-full bg-[#C45111]
                    px-5 text-sm font-semibold text-white
                    hover:bg-[#9d3e0b]"
                >
                  Publícate con nosotros
                </button>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  )
}