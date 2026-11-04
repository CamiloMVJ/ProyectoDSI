import React from 'react';
import { User } from 'lucide-react';

export default function LoginSINATUR() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-5 bg-white bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:20px_20px]">
      
      {/* Encabezado / Logo */}
      <header className="absolute top-5 left-10">
        <h1 className="m-0 text-2xl font-bold tracking-wide text-black">SINATUR</h1>
        <p className="mt-0.5 text-xs text-neutral-600">Sistema Nacional de Turismo</p>
      </header>

      {/* Tarjeta principal con borde y sombra naranja brillante */}
      <div className="w-full max-w-sm bg-white px-8 py-10 rounded-[20px] border-[3px] border-[#ff7a18] shadow-[0_0_15px_rgba(255,122,24,0.5),inset_0_0_15px_rgba(255,122,24,0.2)] flex flex-col items-center">
        
        {/* Icono de usuario */}
        <div className="mb-6">
          <User className="w-[70px] h-[70px] text-[#ff7a18]" />
        </div>

        <form className="w-full flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="correo" className="text-[13px] font-bold text-black">Correo</label>
            <input 
              type="email" 
              id="correo" 
              className="px-3 py-2.5 rounded-[20px] border-2 border-[#ff7a18] outline-none text-sm shadow-[inset_0_0_5px_rgba(255,122,24,0.3)]" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contrasena" className="text-[13px] font-bold text-black">Contraseña</label>
            <input 
              type="password" 
              id="contrasena" 
              className="px-3 py-2.5 rounded-[20px] border-2 border-[#ff7a18] outline-none text-sm shadow-[inset_0_0_5px_rgba(255,122,24,0.3)]" 
            />
          </div>

          <div className="flex flex-col items-center gap-2 my-2">
            <a href="#recuperar" className="text-xs text-black no-underline hover:underline">No recuerdo mi contraseña</a>
            <a href="#registro" className="text-[13px] font-bold text-black no-underline hover:underline">¿No tienes cuenta? Regístrate</a>
          </div>

          <div className="flex justify-end gap-4 mt-2">
            <button type="button" className="bg-transparent border-none text-sm font-bold cursor-pointer text-black hover:opacity-70">
              Cancelar
            </button>
            <button type="submit" className="bg-transparent border-none text-sm font-bold cursor-pointer text-black hover:opacity-70">
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}