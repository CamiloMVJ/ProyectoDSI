import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, DollarSign, CheckCircle2, Image as ImageIcon, UtensilsCrossed } from 'lucide-react';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import ReadOnlyMenus from '../Components/ReadOnlyMenus.jsx';
import ProfileImageGallery from '../Components/ProfileImageGallery.jsx';
import ProfileReviews from '../Components/ProfileReviews.jsx';
import ProfileSkeleton from '../Components/ProfileSkeleton.jsx';
import { getPerfilLugar } from '../services/PerfilLugar.api.js';
import '../css/gestion-establecimientos.css';
import '../css/perfil-lugar.css';

const PerfilLugar = () => {
  const { id } = useParams();
  const [lugar, setLugar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const cargarDatosLugar = async () => {
      try {
        setCargando(true);
        setError(null);
        setLugar(null);
        const data = await getPerfilLugar(id, controller.signal);
        if (controller.signal.aborted) return;
        setLugar(data);
      } catch (err) {
        if (!controller.signal.aborted) setError(err.message);
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    cargarDatosLugar();
    return () => controller.abort();
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
        <Navbar />
        <ProfileSkeleton />
        <Footer />
      </div>
    );
  }

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

        <ProfileImageGallery key={id} images={lugar.galeria} name={lugar.nombre} />

        {/* Cuadrícula de Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Columna Izquierda (Descripción y Servicios) */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-[#3A3A3A] mb-4 border-b border-gray-200/60 pb-2">Acerca del lugar</h2>
              <p className="text-[#6A6A6A] leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                {lugar.descripcion || 'Descripción no disponible.'}
              </p>
              {lugar.tipo_acceso && <p className="mt-4 text-[#6A6A6A]">Acceso: {lugar.tipo_acceso}</p>}
              {lugar.entidad_encargada && <p className="mt-2 text-[#6A6A6A]">Entidad encargada: {lugar.entidad_encargada}</p>}
              {lugar.normativa_visitantes && <p className="mt-4 text-[#6A6A6A] whitespace-pre-wrap">{lugar.normativa_visitantes}</p>}
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

            {lugar.es_comercial && <section className="perfil-menu" aria-labelledby="perfil-menu-title">
              <h2 id="perfil-menu-title" className="flex items-center gap-2 text-2xl font-bold text-[#3A3A3A] mb-4 border-b border-gray-200/60 pb-2"><UtensilsCrossed size={24} className="text-[#C45111]" aria-hidden="true" /> Menú</h2>
              <p className="mb-4 text-sm text-[#526554]">Explora los platillos y bebidas disponibles por categoría.</p>
              {lugar.menus.length ? <ReadOnlyMenus menus={lugar.menus} grouped /> : <div className="rounded-2xl border border-[#d8e1d5] bg-white p-6 text-[#526554]">Este local aún no tiene un menú disponible.</div>}
            </section>}

            <ProfileReviews key={id} id={id} isCommercial={lugar.es_comercial} />
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
              </ul>
              {lugar.maps_link && (
                <a href={lugar.maps_link} target="_blank" rel="noopener noreferrer" className="block w-full mt-6 bg-[#C45111] hover:bg-[#FF7A2F] text-center text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg">
                  Ver ubicación en el mapa
                </a>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PerfilLugar;
