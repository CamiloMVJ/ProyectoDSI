import { Link, Navigate } from 'react-router-dom'
import {
    ArrowRight,
    Compass,
    LoaderCircle,
    User,
    CheckCircle,
} from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import PerfilFormulario from '../Components/Cuenta/ProfileForm.jsx'
import { useCuentaUsuario } from '../hooks/useUserAccount.js'

function iniciales(nombre = '') {
    return (
        nombre
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(palabra => palabra[0])
            .join('')
            .toUpperCase() || 'U'
    )
}

export default function UserAccount() {
    const cuenta = useCuentaUsuario()

    if (!cuenta.sesion) {
        return <Navigate to="/ingresar" replace />
    }

    const usuario = cuenta.usuario ?? cuenta.sesion.usuario

    return (
        <div
            id="inicio"
            className="flex min-h-screen flex-col bg-[#f6f8f3] text-[#25382e]"
        >
            <Navbar />

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-10 sm:px-10 sm:pt-14">
                <header className="mb-9 border-b border-[var(--color-border)] pb-8 sm:mb-10">
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-accent)]">
                        Tu espacio en SINATUR
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
                        Mi cuenta
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
                        Administra tu información personal y mantén tus datos actualizados.
                    </p>
                </header>

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
                    <section
                        aria-labelledby="perfil-title"
                        className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-9"
                    >
                        <p
                            className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]"
                        >
                            Información de tu cuenta
                        </p>

                        <h2
                            id="perfil-title"
                            className="mt-2 text-2xl font-bold"
                        >
                            Datos personales
                        </h2>

                        <p className="mb-7 mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                            Puedes actualizar tu nombre, correo electrónico y teléfono.
                        </p>

                        {cuenta.cargando && (
                            <p
                                role="status"
                                className="flex items-center gap-3 py-10
                  text-sm text-[var(--color-text-muted)]"
                            >
                                <LoaderCircle
                                    size={20}
                                    aria-hidden="true"
                                    className="animate-spin motion-reduce:animate-none"
                                />
                                Cargando tus datos…
                            </p>
                        )}

                        {cuenta.error && (
                            <p
                                role="alert"
                                className="mb-5 rounded-xl bg-[#fff0e9]
                  p-4 text-sm text-[#9d3e0b]"
                            >
                                {cuenta.error}
                            </p>
                        )}

                        {cuenta.aviso && (
                            <p
                                role="status"
                                className="mb-5 flex items-center gap-2
                  rounded-xl bg-[#eaf0e7] p-4 text-sm text-[#344e3b]"
                            >
                                <CheckCircle
                                    size={18}
                                    aria-hidden="true"
                                    className="shrink-0"
                                />
                                {cuenta.aviso}
                            </p>
                        )}

                        {!cuenta.cargando && cuenta.usuario && (
                            <PerfilFormulario
                                key={cuenta.usuario.id_usuario}
                                usuario={cuenta.usuario}
                                guardando={cuenta.guardando}
                                onGuardar={cuenta.guardar}
                                onEditar={cuenta.limpiarAviso}
                            />
                        )}

                        {!cuenta.cargando && !cuenta.usuario && (
                            <button
                                type="button"
                                onClick={cuenta.reintentar}
                                className="min-h-11 rounded-full border
                  border-[var(--color-border)] px-5 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-muted)]"
                            >
                                Reintentar
                            </button>
                        )}
                    </section>

                    <aside className="space-y-5" aria-label="Resumen de la cuenta">
                        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7">
                            <div className="mb-5 flex size-16 items-center justify-center rounded-xl bg-[#eaf0e7] text-xl font-bold text-[var(--color-primary)]" aria-hidden="true">
                                {iniciales(usuario.nombre_completo)}
                            </div>
                            <h2 className="break-words text-lg font-bold">
                                {usuario.nombre_completo}
                            </h2>
                            <p className="mt-1 break-all text-sm text-[var(--color-text-muted)]">
                                {usuario.email}
                            </p>
                            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f6eee5] px-3 py-2 text-xs font-semibold text-[#9d3e0b]">
                                <User size={14} aria-hidden="true" />
                                Cuenta personal
                            </span>
                        </div>

                        <div className="rounded-2xl border border-[var(--color-border)] bg-[#eaf0e7] p-6 sm:p-7">
                            <Compass size={26} aria-hidden="true" className="text-[var(--color-text-muted)]" />
                            <h2 className="mt-4 text-lg font-bold">Tu próxima escapada</h2>
                            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                                Descubre destinos, sabores y experiencias cerca de ti.
                            </p>
                            <Link to="/" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)]">
                                Explorar Nicaragua
                                <ArrowRight size={17} aria-hidden="true" />
                            </Link>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer homeHref="/" />
        </div>
    )
}
