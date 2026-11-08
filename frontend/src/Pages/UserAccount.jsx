import { Link, Navigate } from 'react-router-dom'
import {
    ArrowLeft,
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

export default function CuentaUsuario() {
    const cuenta = useCuentaUsuario()

    if (!cuenta.sesion) {
        return <Navigate to="/ingresar" replace />
    }

    const usuario = cuenta.usuario ?? cuenta.sesion.usuario

    return (
        <div
            id="inicio"
            className="min-h-screen bg-[#f6f8f3] text-[#25382e]"
        >
            <Navbar
                usuario={usuario}
                onLogout={cuenta.cerrarSesion}
            />

            <main>
                <section className="bg-[#263f32] text-white">
                    <div
                        className="mx-auto max-w-7xl px-6 py-10
              sm:px-10 sm:py-14"
                    >
                        <Link
                            to="/"
                            className="mb-7 inline-flex min-h-11 items-center
                gap-2 text-sm text-white/85 hover:text-white"
                        >
                            <ArrowLeft size={17} aria-hidden="true" />
                            Volver a explorar
                        </Link>

                        <p
                            className="text-xs font-bold uppercase
                tracking-[.2em] text-[#ffbb86]"
                        >
                            Tu espacio en SINATUR
                        </p>

                        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
                            Mi cuenta
                        </h1>

                        <p
                            className="mt-4 max-w-xl text-sm leading-7
                text-white/80 sm:text-base"
                        >
                            Cada viaje comienza contigo. Mantén tus datos al día
                            para seguir descubriendo Nicaragua.
                        </p>
                    </div>
                </section>

                <div
                    className="mx-auto grid max-w-7xl gap-7 px-6 py-9
            sm:px-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-12"
                >
                    <aside
                        className="space-y-5"
                        aria-label="Resumen de la cuenta"
                    >
                        <div
                            className="rounded-3xl border border-[#d8e1d5]
                bg-white p-7"
                        >
                            <div
                                aria-hidden="true"
                                className="mb-5 flex size-16 items-center
                  justify-center rounded-2xl bg-[#eaf0e7]
                  text-xl font-bold text-[#344e3b]"
                            >
                                {iniciales(usuario.nombre_completo)}
                            </div>

                            <h2 className="break-words text-lg font-bold">
                                {usuario.nombre_completo}
                            </h2>

                            <p className="mt-1 break-all text-sm text-[#526554]">
                                {usuario.email}
                            </p>

                            <span
                                className="mt-5 inline-flex items-center gap-2
                  rounded-full bg-[#f6eee5] px-3 py-2
                  text-xs font-semibold text-[#9d3e0b]"
                            >
                                <User size={14} aria-hidden="true" />
                                Cuenta personal
                            </span>
                        </div>

                        <div className="rounded-3xl bg-[#eaf0e7] p-7">
                            <Compass
                                size={29}
                                aria-hidden="true"
                                className="text-[#526554]"
                            />

                            <h2 className="mt-4 font-serif text-xl">
                                Tu próxima escapada
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#526554]">
                                Descubre destinos, sabores y experiencias cerca de ti.
                            </p>

                            <Link
                                to="/"
                                className="mt-4 inline-flex min-h-11 items-center
                  gap-2 text-sm font-bold text-[#344e3b]"
                            >
                                Explorar Nicaragua
                                <ArrowRight size={17} aria-hidden="true" />
                            </Link>
                        </div>
                    </aside>

                    <section
                        aria-labelledby="perfil-title"
                        className="min-w-0 self-start rounded-3xl border
              border-[#d8e1d5] bg-white p-6 shadow-sm sm:p-9"
                    >
                        <p
                            className="text-xs font-bold uppercase
                tracking-widest text-[#c45111]"
                        >
                            Información de tu cuenta
                        </p>

                        <h2
                            id="perfil-title"
                            className="mt-2 text-2xl font-bold"
                        >
                            Datos personales
                        </h2>

                        <p className="mb-7 mt-2 text-sm leading-6 text-[#526554]">
                            Puedes actualizar tu nombre, correo electrónico y teléfono.
                        </p>

                        {cuenta.cargando && (
                            <p
                                role="status"
                                className="flex items-center gap-3 py-10
                  text-sm text-[#526554]"
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
                  border-[#d8e1d5] px-5 text-sm font-semibold"
                            >
                                Reintentar
                            </button>
                        )}
                    </section>
                </div>
            </main>

            <Footer homeHref="/" />
        </div>
    )
}