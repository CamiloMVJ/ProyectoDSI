
import React from 'react';
import {
  Compass,
  UserRound,
  Mail,
  LockKeyhole,
  Building2,
  FileText,
  ArrowRight,
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Sparkles,
  Globe2,
  Phone
} from 'lucide-react';

export default function RegistroNegocioSINATUR() {

  const inputStyle =
    "w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f8faf6] border border-[#dfe7dc] text-sm text-[#35483a] outline-none transition duration-300 focus:border-[#ff7a18] focus:bg-white focus:ring-4 focus:ring-[#ff7a18]/10 placeholder:text-[#b0b7ac]";

  const labelStyle =
    "text-sm font-semibold text-[#455548] mb-2 block";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eaf0e7] px-4 py-12 md:px-8">

      {/* FONDO VERDE */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#243d31] via-[#496650] to-[#91a28a]" />

      {/* Luces ambientales */}
      <div className="fixed -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-[#b2d09e]/20 blur-[110px]" />

      <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#ff8a36]/20 blur-[120px]" />

      <div className="fixed top-1/3 right-1/4 w-72 h-72 bg-[#dce9c9]/10 rounded-full blur-[100px]" />

      {/* Textura */}
      <div
        className="fixed inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '25px 25px'
        }}
      />

      {/* Círculos decorativos */}
      <div className="fixed top-12 right-10 w-48 h-48 border border-white/10 rounded-full pointer-events-none" />
      <div className="fixed top-20 right-20 w-28 h-28 border border-white/10 rounded-full pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-52 h-52 border border-white/10 rounded-full pointer-events-none" />

      {/* CONTENIDO */}
      <main className="relative z-10 w-full max-w-[1050px] mx-auto">

        {/* ENCABEZADO */}
        <header className="flex items-center justify-between mb-8 px-2">

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center">
              <Compass size={27} className="text-[#ffad70]" />
            </div>

            <div>
              <h1 className="text-3xl font-serif font-bold tracking-widest text-white">
                SINATUR
              </h1>
              <p className="text-[10px] tracking-[2px] text-white/70">
                SISTEMA NACIONAL DE TURISMO
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-white/80 text-xs bg-white/10 border border-white/15 px-4 py-2 rounded-full backdrop-blur-md">
            <Globe2 size={15} />
            Español
          </div>

        </header>

        {/* TARJETA PRINCIPAL */}
        <section className="bg-[#fffefa] rounded-[30px] md:rounded-[36px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.28)]">

          {/* BANNER */}
          <div className="relative bg-gradient-to-r from-[#344e3b] via-[#526f55] to-[#82967b] px-7 py-9 md:px-12 md:py-11 overflow-hidden">

            <div className="absolute -right-10 -top-28 w-72 h-72 border border-white/10 rounded-full" />
            <div className="absolute -right-2 -top-16 w-52 h-52 border border-white/10 rounded-full" />
            <div className="absolute right-32 -bottom-24 w-44 h-44 bg-white/5 rounded-full" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">

              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/90 px-3 py-1.5 rounded-full text-[11px] mb-4">
                  <Sparkles size={14} className="text-[#ffb77d]" />
                  Únete a nuestra comunidad turística
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Registra tu negocio
                </h2>

                <p className="text-sm text-white/75 max-w-lg leading-6">
                  Forma parte de SINATUR y dale visibilidad a tu negocio turístico.
                  Completa la solicitud para crear tu cuenta de propietario.
                </p>
              </div>

              <div className="hidden md:flex w-24 h-24 rounded-[28px] bg-white/10 border border-white/20 backdrop-blur-md items-center justify-center shrink-0">
                <Building2 size={48} className="text-[#ffad70]" strokeWidth={1.3} />
              </div>

            </div>
          </div>

          {/* FORMULARIO */}
          <div className="px-7 py-9 md:px-12 md:py-12">

            <form
              className="flex flex-col"
              onSubmit={(e) => e.preventDefault()}
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">

                {/* COLUMNA IZQUIERDA */}
                <div className="flex flex-col gap-5">

                  {/* ENCABEZADO PROPIETARIO */}
                  <div className="mb-1">
                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-[#edf3e9] flex items-center justify-center">
                        <UserRound size={21} className="text-[#647f60]" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#35483a]">
                          Datos del propietario
                        </h3>
                        <p className="text-xs text-[#9aa196]">
                          Información personal del titular
                        </p>
                      </div>

                    </div>

                    <div className="h-px bg-[#e9eee5] mt-5" />
                  </div>

                  {/* NOMBRE COMPLETO */}
                  <div>
                    <label htmlFor="nombre-completo" className={labelStyle}>
                      Nombre completo
                    </label>

                    <div className="relative">
                      <UserRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9d85]" />

                      <input
                        type="text"
                        id="nombre-completo"
                        name="nombre_completo"
                        placeholder="Ingresa tu nombre completo"
                        required
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  {/* CORREO */}
                  <div>
                    <label htmlFor="correo" className={labelStyle}>
                      Correo electrónico
                    </label>

                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9d85]" />

                      <input
                        type="email"
                        id="correo"
                        name="email"
                        placeholder="ejemplo@correo.com"
                        required
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  {/* CONFIRMAR CORREO */}
                  <div>
                    <label htmlFor="confirmar-correo" className={labelStyle}>
                      Confirmar correo electrónico
                    </label>

                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9d85]" />

                      <input
                        type="email"
                        id="confirmar-correo"
                        placeholder="Repite tu correo electrónico"
                        required
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  {/* TELEFONO */}
                  <div>
                    <label htmlFor="telefono" className={labelStyle}>
                      Número de teléfono
                    </label>

                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9d85]" />

                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        placeholder="Ingresa tu número de teléfono"
                        required
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  {/* CONTRASEÑA */}
                  <div>
                    <label htmlFor="contrasena" className={labelStyle}>
                      Contraseña
                    </label>

                    <div className="relative">
                      <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9d85]" />

                      <input
                        type="password"
                        id="contrasena"
                        name="password"
                        placeholder="Crea una contraseña"
                        required
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  {/* CONFIRMAR CONTRASEÑA */}
                  <div>
                    <label htmlFor="confirmar-contrasena" className={labelStyle}>
                      Confirmar contraseña
                    </label>

                    <div className="relative">
                      <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9d85]" />

                      <input
                        type="password"
                        id="confirmar-contrasena"
                        placeholder="Repite tu contraseña"
                        required
                        className={inputStyle}
                      />
                    </div>
                  </div>

                </div>

                {/* COLUMNA DERECHA */}
                <div className="flex flex-col gap-5">

                  {/* ENCABEZADO NEGOCIO */}
                  <div className="mb-1">
                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-[#fff0e4] flex items-center justify-center">
                        <Building2 size={21} className="text-[#ff7a18]" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#35483a]">
                          Datos del negocio
                        </h3>
                        <p className="text-xs text-[#9aa196]">
                          Información comercial
                        </p>
                      </div>

                    </div>

                    <div className="h-px bg-[#e9eee5] mt-5" />
                  </div>

                  {/* NOMBRE DEL NEGOCIO */}
                  <div>
                    <label htmlFor="nombre-negocio" className={labelStyle}>
                      Nombre del negocio
                    </label>

                    <div className="relative">
                      <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9d85]" />

                      <input
                        type="text"
                        id="nombre-negocio"
                        name="nombre_negocio"
                        placeholder="Ingresa el nombre comercial"
                        required
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  {/* RUC */}
                  <div>
                    <label htmlFor="ruc" className={labelStyle}>
                      Número RUC
                    </label>

                    <div className="relative">
                      <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b9d85]" />

                      <input
                        type="text"
                        id="ruc"
                        name="codigo_ruc"
                        placeholder="Ingresa el número RUC"
                        required
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  {/* INFORMACIÓN DE VALIDACIÓN */}
                  <div className="mt-5 p-6 rounded-2xl bg-[#f0f4ec] border border-[#dfe9d9]">

                    <div className="flex items-center gap-3 mb-4">

                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <ShieldCheck size={23} className="text-[#718b6a]" />
                      </div>

                      <h4 className="font-bold text-sm text-[#435744]">
                        Validación de solicitud
                      </h4>

                    </div>

                    <p className="text-xs text-[#74816f] leading-6">
                      La creación de la cuenta requiere un período de
                      validación de la información proporcionada.
                      Una vez revisada la solicitud, recibirás una
                      notificación por correo electrónico sobre el
                      estado de tu cuenta.
                    </p>

                    <div className="flex items-start gap-2 mt-4 pt-4 border-t border-[#dce6d7]">
                      <Mail size={16} className="text-[#ff7a18] mt-0.5 shrink-0" />

                      <p className="text-[11px] text-[#879282] leading-5">
                        Mantén activo tu correo electrónico para recibir
                        actualizaciones.
                      </p>
                    </div>

                  </div>

                  {/* MENSAJE TURÍSTICO */}
                  <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-[#fff5ec] border border-[#ffe4ce]">

                    <MapPin size={20} className="text-[#ff7a18] shrink-0" />

                    <p className="text-xs text-[#946b4e] leading-5">
                      ¡Haz que tu negocio sea parte de los destinos
                      que conectan a Nicaragua con el mundo!
                    </p>

                  </div>

                </div>

              </div>

              {/* BOTONES */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-[#e9eee5]">

                <a
                  href="#login"
                  className="flex items-center gap-2 text-sm font-semibold text-[#778675] hover:text-[#ff7a18] transition"
                >
                  <ArrowLeft size={17} />
                  Volver al inicio de sesión
                </a>

                <div className="flex w-full sm:w-auto gap-3">

                  <button
                    type="reset"
                    className="flex-1 sm:flex-none px-7 py-3.5 rounded-xl border border-[#dce4d8] text-sm font-semibold text-[#697968] hover:bg-[#f1f4ed] transition"
                  >
                    Limpiar
                  </button>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-9 py-3.5 rounded-xl bg-gradient-to-r from-[#ff7a18] to-[#f59a48] text-white text-sm font-bold flex items-center justify-center gap-3 shadow-lg shadow-orange-200/50 hover:-translate-y-1 hover:shadow-xl transition duration-300"
                  >
                    Solicitar cuenta
                    <ArrowRight size={18} />
                  </button>

                </div>

              </div>

            </form>
          </div>

        </section>

        {/* PIE */}
        <footer className="text-center mt-7 text-white/60 text-xs">
          © 2026 SINATUR · Sistema Nacional de Turismo
        </footer>

      </main>
    </div>
  );
}
