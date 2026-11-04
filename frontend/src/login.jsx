
import React from 'react';
import {
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
  Eye,
  Globe2,
  Compass,
  MapPin,
  Mountain,
  Palmtree,
  Sparkles
} from 'lucide-react';

export default function LoginSINATUR() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-5 py-16 bg-[#eaf0e7]">

      {/* FONDO VERDE DINÁMICO */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#263f35] via-[#496650] to-[#82977e]" />

      {/* Luces decorativas */}
      <div className="absolute -top-40 -left-32 w-[550px] h-[550px] rounded-full bg-[#a8c49b] opacity-20 blur-[100px]" />

      <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full bg-[#ff7a18] opacity-20 blur-[120px]" />

      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-[#d4e4bd] opacity-10 blur-[90px]" />

      {/* Cuadrícula decorativa */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Círculos decorativos */}
      <div className="absolute top-20 right-[10%] w-40 h-40 border border-white/10 rounded-full" />
      <div className="absolute top-28 right-[12%] w-28 h-28 border border-white/10 rounded-full" />
      <div className="absolute bottom-16 left-[8%] w-52 h-52 border border-white/10 rounded-full" />

      {/* CONTENIDO PRINCIPAL */}
      <main className="relative z-10 w-full max-w-[1100px] bg-white rounded-[35px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.30)] flex flex-col md:flex-row min-h-[650px]">

        {/* PANEL IZQUIERDO */}
        <section className="relative md:w-[48%] min-h-[330px] md:min-h-full overflow-hidden bg-gradient-to-br from-[#314c3c] via-[#526f56] to-[#8b9d83] p-9 md:p-12 flex flex-col justify-between">

          {/* Decoración */}
          <div className="absolute -right-24 top-20 w-72 h-72 border border-white/10 rounded-full" />
          <div className="absolute -right-12 top-32 w-52 h-52 border border-white/10 rounded-full" />
          <div className="absolute -left-20 -bottom-24 w-72 h-72 bg-white/5 rounded-full" />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <Compass size={27} className="text-[#ff9a4c]" />
              </div>

              <div>
                <h1 className="text-3xl font-serif font-bold tracking-widest text-white">
                  SINATUR
                </h1>
                <p className="text-[10px] tracking-[3px] text-white/70">
                  SISTEMA NACIONAL DE TURISMO
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje central */}
          <div className="relative z-10 my-10">

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs mb-7 backdrop-blur-md">
              <Sparkles size={14} className="text-[#ffae68]" />
              Descubre la belleza de Nicaragua
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Explora,
              <br />
              descubre y
              <br />
              <span className="text-[#ffad70]">enamórate.</span>
            </h2>

            <p className="text-white/75 text-sm md:text-base leading-7 max-w-sm">
              Conoce los destinos, experiencias y maravillas que hacen de Nicaragua un lugar extraordinario.
            </p>

            {/* Iconos turísticos */}
            <div className="flex gap-4 mt-9">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                <Mountain className="text-white" size={23} />
              </div>

              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                <Palmtree className="text-white" size={23} />
              </div>

              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                <Globe2 className="text-white" size={23} />
              </div>
            </div>
          </div>

          {/* Pie del panel */}
          <div className="relative z-10 flex items-center gap-2 text-white/65 text-xs">
            <MapPin size={15} className="text-[#ffad70]" />
            Nicaragua, tierra de lagos y volcanes.
          </div>

        </section>

        {/* PANEL DERECHO - LOGIN */}
        <section className="md:w-[52%] bg-[#fffefa] px-8 py-12 md:px-16 md:py-16 flex flex-col justify-center">

          {/* Idioma */}
          <div className="flex justify-end mb-8">
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f3ec] text-[#60765f] text-xs font-semibold">
              <Globe2 size={15} />
              Español
            </span>
          </div>

          {/* Encabezado */}
          <div className="mb-9">

            <div className="w-16 h-16 rounded-2xl bg-[#eef3e9] flex items-center justify-center mb-6 border border-[#dce6d7]">
              <UserRound size={34} className="text-[#637e60]" strokeWidth={1.7} />
            </div>

            <p className="text-[#ff7a18] text-xs font-bold tracking-[3px] uppercase mb-3">
              Bienvenido de nuevo
            </p>

            <h2 className="text-4xl font-bold text-[#35483a] mb-3">
              Iniciar sesión
            </h2>

            <p className="text-sm text-[#92998f] leading-6">
              Ingresa tus datos para acceder a tu cuenta y disfrutar de todo lo que SINATUR tiene para ofrecerte.
            </p>

          </div>

          {/* FORMULARIO */}
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >

            {/* Correo */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="correo"
                className="text-sm font-semibold text-[#455548]"
              >
                Correo electrónico
              </label>

              <div className="relative group">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#899c85] group-focus-within:text-[#ff7a18] transition"
                />

                <input
                  type="email"
                  id="correo"
                  placeholder="ejemplo@correo.com"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#f7f8f4] border border-[#e4e9df] text-sm text-[#35483a] outline-none transition duration-300 focus:border-[#ff7a18] focus:bg-white focus:ring-4 focus:ring-[#ff7a18]/10"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contrasena"
                className="text-sm font-semibold text-[#455548]"
              >
                Contraseña
              </label>

              <div className="relative group">
                <LockKeyhole
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#899c85] group-focus-within:text-[#ff7a18] transition"
                />

                <input
                  type="password"
                  id="contrasena"
                  placeholder="Ingresa tu contraseña"
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#f7f8f4] border border-[#e4e9df] text-sm text-[#35483a] outline-none transition duration-300 focus:border-[#ff7a18] focus:bg-white focus:ring-4 focus:ring-[#ff7a18]/10"
                />

                <Eye
                  size={19}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#899c85] cursor-pointer"
                />
              </div>
            </div>

            {/* Recuperar contraseña */}
            <div className="flex justify-end -mt-2">
              <a
                href="#recuperar"
                className="text-xs font-semibold text-[#758c70] hover:text-[#ff7a18] transition"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="group w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff7a18] to-[#f59a48] text-white font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-orange-200/60 hover:shadow-xl hover:shadow-orange-300/50 hover:-translate-y-1 transition-all duration-300"
            >
              Iniciar sesión

              <ArrowRight
                size={19}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            {/* Registro */}
            <div className="text-center mt-2">
              <p className="text-sm text-[#92998f]">
                ¿Aún no tienes una cuenta?
              </p>

              <a
                href="#registro"
                className="inline-block mt-2 text-sm font-bold text-[#e87924] hover:text-[#c65c0d] transition"
              >
                Crear una cuenta
              </a>
            </div>

          </form>

          {/* Separador y pie */}
          <div className="mt-10 pt-6 border-t border-[#edf0e9] text-center">
            <p className="text-[11px] text-[#a0a69b]">
              © 2026 SINATUR · Sistema Nacional de Turismo
            </p>
          </div>

        </section>

      </main>

      {/* Decoración inferior */}
      <div className="absolute bottom-5 right-7 text-white/50 text-xs hidden md:block">
        Descubre Nicaragua ♡
      </div>

    </div>
  );
}
