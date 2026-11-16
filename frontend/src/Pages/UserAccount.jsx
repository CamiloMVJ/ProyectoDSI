import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
    ArrowRight,
    Compass,
    LoaderCircle,
    User,
    CheckCircle,
    ClipboardList,
} from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import PerfilFormulario from '../Components/Cuenta/ProfileForm.jsx'
import { useCuentaUsuario } from '../hooks/useUserAccount.js'
import { getMyBusinessRequests } from '../services/businessRequests.api.js'
import { getManagedEstablishments } from '../services/establishments.api.js'

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
    const [tieneSolicitudes, setTieneSolicitudes] = useState(false)
    const [tieneEstablecimientos, setTieneEstablecimientos] = useState(false)
    const [actividadCargada, setActividadCargada] = useState(false)

    useEffect(() => {
        if (!cuenta.sesion?.token || !['Usuario', 'Propietario'].includes(cuenta.sesion.usuario.rol)) return
        const controller = new AbortController()
        Promise.allSettled([
            getMyBusinessRequests(cuenta.sesion.token, controller.signal),
            getManagedEstablishments(cuenta.sesion.token, controller.signal),
        ]).then(([solicitudes, locales]) => {
            if (controller.signal.aborted) return
            if (solicitudes.status === 'fulfilled') setTieneSolicitudes(solicitudes.value.length > 0)
            if (locales.status === 'fulfilled') setTieneEstablecimientos(locales.value.length > 0)
            setActividadCargada(solicitudes.status === 'fulfilled' && locales.status === 'fulfilled')
        })
        return () => controller.abort()
    }, [cuenta.sesion])

    if (!cuenta.sesion) {
        return <Navigate to="/ingresar" replace />
    }

    const usuario = cuenta.usuario ?? cuenta.sesion.usuario
    const rol = cuenta.usuario?.rol ?? cuenta.sesion.usuario.rol
    const nombreRol = rol === 'Usuario'
        ? 'Cuenta personal'
        : rol === 'Propietario'
            ? 'Dueño de negocio'
            : rol

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
                    <div className="min-w-0 space-y-6">
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
                    {rol !== 'Administrador' && (tieneSolicitudes || tieneEstablecimientos) && (
                        <section aria-labelledby="actividad-title" className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-9">
                            <div className="mb-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">Negocios</p>
                                <h2 id="actividad-title" className="mt-1 text-xl font-bold">Tu actividad</h2>
                            </div>
                            <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                                {tieneSolicitudes && <Link to="/mis-solicitudes" className="group flex min-h-20 items-center gap-4 py-4 text-[var(--color-text)] hover:text-[var(--color-primary)] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e7] text-[var(--color-primary)]"><ClipboardList size={21} aria-hidden="true" /></span>
                                    <span className="min-w-0 flex-1"><strong className="block text-sm font-bold sm:text-base">Solicitudes de negocio</strong><span className="mt-1 block text-sm leading-5 text-[var(--color-text-muted)]">Consulta su estado y documentos.</span></span>
                                    <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                </Link>}
                                {tieneEstablecimientos && <Link to="/gestion-establecimientos" className="group flex min-h-20 items-center gap-4 py-4 text-[var(--color-text)] hover:text-[var(--color-primary)] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e7] text-[var(--color-primary)]"><Compass size={21} aria-hidden="true" /></span>
                                    <span className="min-w-0 flex-1"><strong className="block text-sm font-bold sm:text-base">Mis establecimientos</strong><span className="mt-1 block text-sm leading-5 text-[var(--color-text-muted)]">Edita información, servicios y publicación.</span></span>
                                    <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                </Link>}
                            </div>
                            {tieneEstablecimientos && <Link to="/registro-negocio" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)]">Registrar otro establecimiento <ArrowRight size={16} aria-hidden="true" /></Link>}
                        </section>
                    )}
                    {rol === 'Administrador' && (
                    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-9">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-[#eaf0e7] text-[var(--color-primary)]"><ClipboardList size={25} aria-hidden="true" /></div>
                        <h2 className="mt-4 text-lg font-bold">Revisión de solicitudes</h2>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">Consulta los datos y documentos de los negocios que esperan aprobación.</p>
                        <Link to="/admin/solicitudes" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--color-primary-deep)]">Revisar solicitudes <ArrowRight size={17} aria-hidden="true" /></Link>
                        <Link to="/gestion-establecimientos" className="ml-0 mt-3 inline-flex min-h-11 items-center gap-2 px-2 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] sm:ml-3">Gestionar establecimientos <ArrowRight size={17} aria-hidden="true" /></Link>
                    </section>
                    )}
                    {rol !== 'Administrador' && actividadCargada && !tieneSolicitudes && !tieneEstablecimientos && (
                        <section className="min-w-0 rounded-2xl border border-[#eadacb] bg-[#fff9f3] p-6 sm:p-9">
                            <div className="flex items-start gap-4">
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f6eee5] text-[var(--color-accent)]"><Compass size={21} aria-hidden="true" /></span>
                                <div className="min-w-0">
                                    <h2 className="text-lg font-bold">¿Tienes un establecimiento?</h2>
                                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">Solicita el registro de tu negocio turístico con esta cuenta.</p>
                                    <Link to="/registro-negocio" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--color-accent)] hover:text-[var(--color-primary)]">Registrar mi negocio <ArrowRight size={17} aria-hidden="true" /></Link>
                                </div>
                            </div>
                        </section>
                    )}
                    </div>

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
                            {nombreRol && (
                                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f6eee5] px-3 py-2 text-xs font-semibold text-[#9d3e0b]">
                                    <User size={14} aria-hidden="true" />
                                    {nombreRol}
                                </span>
                            )}
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
