import React from 'react';

export default function RegistroNegocioSINATUR() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-5 bg-white bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:20px_20px]">
      
      {/* Encabezado / Logo */}
      <header className="absolute top-5 left-10">
        <h1 className="m-0 text-2xl font-bold tracking-wide text-black">SINATUR</h1>
        <p className="mt-0.5 text-xs text-neutral-600">Sistema Nacional de Turismo</p>
      </header>

      {/* Tarjeta principal */}
      <div className="w-full max-w-[850px] bg-white px-10 py-8 rounded-[20px] border-[3px] border-[#ff7a18] shadow-[0_0_15px_rgba(255,122,24,0.5),inset_0_0_15px_rgba(255,122,24,0.2)] flex flex-col">
        
        <h2 className="text-center text-base font-bold mb-6 text-black mt-0">
          Solicitud para creación de cuenta "Propietario de negocio"
        </h2>

        <form className="w-full flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Columna Izquierda */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="nombres" className="text-[13px] font-bold text-black">Nombres</label>
                <input type="text" id="nombres" className="px-3 py-2 rounded-[20px] border-2 border-[#ff7a18] outline-none text-sm shadow-[inset_0_0_5px_rgba(255,122,24,0.3)]" />
                <span className="text-[10px] text-neutral-700 -mt-0.5">(Titular del negocio)</span>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="apellidos" className="text-[13px] font-bold text-black">Apellidos</label>
                <input type="text" id="apellidos" className="px-3 py-2 rounded-[20px] border-2 border-[#ff7a18] outline-none text-sm shadow-[inset_0_0_5px_rgba(255,122,24,0.3)]" />
                <span className="text-[10px] text-neutral-700 -mt-0.5">(Titular del negocio)</span>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="correo" className="text-[13px] font-bold text-black">Correo</label>
                <input type="email" id="correo" className="px-3 py-2 rounded-[20px] border-2 border-[#ff7a18] outline-none text-sm shadow-[inset_0_0_5px_rgba(255,122,24,0.3)]" />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="confirmar-correo" className="text-[13px] font-bold text-black">Confirmación de correo</label>
                <input type="email" id="confirmar-correo" className="px-3 py-2 rounded-[20px] border-2 border-[#ff7a18] outline-none text-sm shadow-[inset_0_0_5px_rgba(255,122,24,0.3)]" />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="contrasena" className="text-[13px] font-bold text-black">Contraseña</label>
                <input type="password" id="contrasena" className="px-3 py-2 rounded-[20px] border-2 border-[#ff7a18] outline-none text-sm shadow-[inset_0_0_5px_rgba(255,122,24,0.3)]" />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="confirmar-contrasena" className="text-[13px] font-bold text-black">Confirmación de contraseña</label>
                <input type="password" id="confirmar-contrasena" className="px-3 py-2 rounded-[20px] border-2 border-[#ff7a18] outline-none text-sm shadow-[inset_0_0_5px_rgba(255,122,24,0.3)]" />
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="nombre-negocio" className="text-[13px] font-bold text-black">Nombre del negocio</label>
                <input type="text" id="nombre-negocio" className="px-3 py-2 rounded-[20px] border-2 border-[#ff7a18] outline-none text-sm shadow-[inset_0_0_5px_rgba(255,122,24,0.3)]" />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="ruc" className="text-[13px] font-bold text-black">RUC</label>
                <input type="text" id="ruc" className="px-3 py-2 rounded-[20px] border-2 border-[#ff7a18] outline-none text-sm shadow-[inset_0_0_5px_rgba(255,122,24,0.3)]" />
              </div>

              <div className="mt-2 text-xs text-black leading-relaxed">
                <p>
                  *La creación de la cuenta requiere un plazo de activación de xx días para la validación de la información ingresada, se le notificará por correo cualquier actualización del estado de su cuenta
                </p>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-6 mt-8">
            <button type="button" className="bg-transparent border-none text-sm font-bold cursor-pointer text-black hover:opacity-70">
              Cancelar
            </button>
            <button type="submit" className="bg-transparent border-none text-sm font-bold cursor-pointer text-black hover:opacity-70">
              Solicitar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}