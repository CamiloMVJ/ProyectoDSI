import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, DollarSign, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { getPerfilLugar } from '../services/PerfilLugar.api.js';

const PerfilLugar = () => {
  const { id } = useParams();
  const [lugar, setLugar] = useState(null);
  const [imagenActiva, setImagenActiva] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, Phone, Clock, DollarSign, CheckCircle2, Image as ImageIcon, Loader2, Star, Info, Map, Utensils, ShieldAlert } from 'lucide-react'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import { getLugarTuristicoById } from '../services/PerfilLugar.api.js' 

export default function PerfilLugar() {
  const { id } = useParams()
  const [lugar, setLugar] = useState(null)
  const [imagenActiva, setImagenActiva] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarDatosLugar = async () => {
      try {
        setCargando(true);
        // AQUÍ REEMPLAZARÁS LA URL CON TU ENDPOINT REAL DE NODE.JS (Ejemplo: http://localhost:3000/api/lugares/${id})
        // const response = await fetch(`URL_DE_TU_BACKEND/${id}`);
        // if (!response.ok) throw new Error('No se pudo cargar la información del lugar');
        // const data = await response.json();
        
        // TODO: Eliminar esto cuando conectes la API real. 
        // Ahorita seteamos null para que veas el estado de carga/espera.
        const data = null; 

        if (data) {
          setLugar(data);
          // Si hay imágenes, setea la primera como activa
          if (data.galeria && data.galeria.length > 0) {
            setImagenActiva(data.galeria[0]);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosLugar();
  }, [id]);

  // Pantalla de Carga (Mientras Node.js y PostgreSQL responden)
  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center text-[#3A3A3A]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[#C45111] animate-spin" />
            <p className="font-semibold">Cargando información del atractivo...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Pantalla de Error (Si falla la BD o no existe el lugar)
  if (error || !lugar) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center text-[#3A3A3A]">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Lugar no encontrado</h2>
            <p className="text-[#6A6A6A]">{error || 'No se encontró la información en la base de datos.'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8f3] text-[#25382e]">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 sm:px-10 py-10 w-full">
        {/* Encabezado */}
        <header className="mb-8">
          <span className="inline-block px-3 py-1 bg-[#C45111]/10 text-[#C45111] text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            {lugar.categoria || 'Categoría General'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#3A3A3A] font-serif leading-tight">
            {lugar.nombre}
          </h1>
        </header>

        {/* GALERÍA MULTIMEDIA */}
        <section className="mb-12">
          <div className="mb-4 flex h-[300px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#eaf0e7] shadow-sm sm:h-[450px]">
            {imagenActiva ? (
              <img 
                src={imagenActiva} 
                alt={lugar.nombre} 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            ) : (
              <ImageIcon size={64} className="text-[#79927c]" />
            )}
          </div>
          
          {lugar.galeria && lugar.galeria.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {lugar.galeria.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setImagenActiva(img)}
                  className={`flex-shrink-0 w-24 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    imagenActiva === img ? 'border-[#C45111] opacity-100 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Cuadrícula de Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Columna Izquierda (Descripción y Servicios) */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-[#3A3A3A] mb-4 border-b border-gray-200/60 pb-2">Acerca del lugar</h2>
              <p className="text-[#6A6A6A] leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                {lugar.descripcion || 'Descripción no disponible.'}
              </p>
            </section>

            {lugar.tipo_local === 'atractivo_independiente' && lugar.normativa_visitantes && (
              <section className="rounded-2xl border border-[#f6eee5] bg-[#fffefa] p-6 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-[#263f32]">
                  <ShieldAlert size={24} className="text-[#c45111]" /> Normativas y Acceso
                </h2>
                <p className="mb-2 text-sm font-bold text-[#9d3e0b]">Acceso: {lugar.tipo_acceso}</p>
                <p className="whitespace-pre-wrap text-sm text-[#526554]">{lugar.normativa_visitantes}</p>
              </section>
            )}

            {lugar.menus && lugar.menus.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 border-b border-[#d8e1d5] pb-2 text-2xl font-bold text-[#263f32]">
                  <Utensils size={24} className="text-[#c45111]" /> Menú
                </h2>
                {lugar.menus.map((menu, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="mb-3 text-lg font-bold text-[#263f32]">{menu.titulo_menu}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {menu.items?.map((item, i) => (
                        <div key={i} className="flex justify-between gap-4 rounded-xl border border-[#d8e1d5] bg-white p-4 shadow-sm">
                          <div>
                            <h4 className="text-sm font-bold text-[#263f32]">{item.nombre_platillo}</h4>
                            <p className="mt-1 text-xs text-[#526554]">{item.descripcion}</p>
                            <span className="mt-2 inline-block rounded-full bg-[#f6f8f3] px-2 py-1 text-[10px] text-[#526554]">{item.categoria}</span>
                          </div>
                          <span className="font-bold text-[#c45111]">C$ {item.precio}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {lugar.servicios && lugar.servicios.length > 0 && (
              <section>
                <h2 className="mb-4 border-b border-[#d8e1d5] pb-2 text-2xl font-bold text-[#263f32]">Servicios y Facilidades</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {lugar.servicios.map((servicio, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-xl border border-[#d8e1d5] bg-white p-4 shadow-sm">
                      <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#79927c]" />
                      <div>
                        <span className="block text-sm font-bold text-[#263f32]">{servicio.nombre_servicio}</span>
                        {servicio.precio > 0 && <span className="text-xs font-bold text-[#c45111]">C$ {servicio.precio}</span>}
                        {servicio.incluye && <p className="mt-1 text-xs text-[#526554]">{servicio.incluye}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {lugar.resenas && lugar.resenas.length > 0 && (
              <section>
                <h2 className="mb-4 border-b border-[#d8e1d5] pb-2 text-2xl font-bold text-[#263f32]">Reseñas de Usuarios</h2>
                <div className="space-y-4">
                  {lugar.resenas.map((resena) => (
                    <div key={resena.id_resena} className="rounded-2xl border border-[#d8e1d5] bg-white p-5 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-bold text-[#263f32]">{resena.usuario}</span>
                        <span className="text-xs text-[#657b65]">{new Date(resena.fecha_publicacion).toLocaleDateString()}</span>
                      </div>
                      <div className="mb-3 flex items-center gap-1">{renderStars(resena.calificacion)}</div>
                      <p className="text-sm text-[#526554]">{resena.comentario}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* COLUMNA DERECHA (Tarjetas Laterales) */}
          <div className="space-y-6">
            
            {/* Tarjeta de Precios */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6 text-[#C45111]" />
                <h3 className="text-xl font-bold text-[#3A3A3A]">Tarifas</h3>
              </div>
              <ul className="space-y-3">
                {lugar.precios && lugar.precios.length > 0 ? (
                  lugar.precios.map((precio, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <span className="text-[#6A6A6A] text-sm">{precio.concepto}</span>
                      <span className="font-bold text-[#3A3A3A]">{precio.costo}</span>
                    </li>
                  ))
                ) : (
                  <p className="font-bold text-[#526554]">C$ {lugar.costo_entrada}</p>
                )}
              </div>
            )}

            {lugar.horarios && lugar.horarios.length > 0 && (
              <div className="rounded-2xl border border-[#d8e1d5] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Clock size={24} className="text-[#c45111]" />
                  <h3 className="text-xl font-bold text-[#263f32]">Horarios</h3>
                </div>
                <ul className="space-y-3">
                  {lugar.horarios.map((h, idx) => (
                    <li key={idx} className="flex flex-col border-b border-[#eaf0e7] pb-2 last:border-0 last:pb-0">
                      <span className="text-sm font-bold text-[#263f32]">{h.dia_semana}</span>
                      <span className="text-sm text-[#526554]">{h.hora_apertura} - {h.hora_cierre}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl bg-[#263f32] p-6 text-white shadow-md">
              <h3 className="mb-4 text-xl font-bold">Ubicación y Contacto</h3>
              <ul className="space-y-4">
                {lugar.contacto?.direccion && (
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#FF7A2F] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{lugar.contacto.direccion}</span>
                  </li>
                )}
                {lugar.contacto?.telefono && (
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#FF7A2F] flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{lugar.contacto.telefono}</span>
                  </li>
                )}
                {lugar.contacto?.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#FF7A2F] flex-shrink-0" />
                    <span className="text-gray-300 text-sm break-all">{lugar.contacto.email}</span>
                  </li>
                )}
              </ul>
              <button className="w-full mt-6 bg-[#C45111] hover:bg-[#FF7A2F] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg">
                Reservar / Consultar
              </button>
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PerfilLugar;