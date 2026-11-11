import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el ID del lugar desde la URL
import { MapPin, Phone, Mail, Clock, DollarSign, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';

// Importación de tus componentes de diseño general
import  Navbar  from '../Components/Navbar';
import Footer from '../Components/Footer'; // Asegúrate de que coincida con cómo exportaste tu Footer

const PerfilLugar = () => {
  const { id } = useParams(); // Extrae el ID de la URL (ej: /perfil/5)
  const [lugar, setLugar] = useState(null);
  const [imagenActiva, setImagenActiva] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Efecto real para llamar a tu API de Node.js conectada a PostgreSQL
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

  // --- RENDERIZADO PRINCIPAL CON DATOS DE LA BASE DE DATOS ---
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
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

        {/* Galería Multimedia */}
        <section className="mb-12">
          <div className="w-full h-[300px] sm:h-[500px] rounded-2xl overflow-hidden shadow-md mb-4 bg-gray-200 flex items-center justify-center">
            {imagenActiva ? (
              <img 
                src={imagenActiva} 
                alt={lugar.nombre} 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            ) : (
              <ImageIcon className="w-16 h-16 text-gray-400" />
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

            {lugar.servicios && lugar.servicios.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#3A3A3A] mb-4 border-b border-gray-200/60 pb-2">Servicios Disponibles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lugar.servicios.map((servicio, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-[#3A3A3A]">
                      <CheckCircle2 className="w-5 h-5 text-[#526554]" />
                      <span className="font-medium text-[#6A6A6A]">{servicio}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Columna Derecha (Tarjetas de Información) */}
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
                  <li className="text-[#6A6A6A] text-sm">Consultar directamente.</li>
                )}
              </ul>
            </div>

            {/* Tarjeta de Horarios */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-[#C45111]" />
                <h3 className="text-xl font-bold text-[#3A3A3A]">Horarios</h3>
              </div>
              <ul className="space-y-3">
                {lugar.horarios && lugar.horarios.length > 0 ? (
                  lugar.horarios.map((horario, idx) => (
                    <li key={idx} className="flex flex-col border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <span className="text-[#3A3A3A] font-semibold text-sm">{horario.dia}</span>
                      <span className="text-[#6A6A6A] text-sm">{horario.horas}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#6A6A6A] text-sm">Horarios no especificados.</li>
                )}
              </ul>
            </div>

            {/* Tarjeta de Contacto */}
            <div className="bg-[#3A3A3A] rounded-2xl p-6 shadow-md text-white">
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
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