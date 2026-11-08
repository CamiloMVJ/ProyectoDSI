import './App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Languages,
  Utensils,
  Martini,
  Disc,
  Coffee,
  Bus,
  Star,
  Heart,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

/* ============================================================================
 * ARCHIVO: src/components/Icons.jsx
 * Icono personalizado de Hospedaje (Cama con techo según el diseño de Figma)
 * ============================================================================ */
export const HospedajeIcon = ({ className = 'w-11 h-11' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 20L24 9L42 20" />
    <path d="M10 23V37" />
    <path d="M38 28V37" />
    <path d="M10 33H38" />
    <path d="M14 29H21V26C21 24.8954 20.1046 24 19 24H16C14.8954 24 14 24.8954 14 26V29Z" />
    <path d="M21 29H36C37.1046 29 38 29.8954 38 31V33H10V29H14" />
  </svg>
);

/* ============================================================================
 * ARCHIVO: src/components/Navbar.jsx
 * Barra de navegación superior con efecto Glassmorphism (fija al hacer scroll)
 * ============================================================================ */
export const Navbar = ({ onLoginClick, onPublishClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-gray-200/60 transition-all">
      <nav className="max-w-7xl mx-auto py-4 px-6 sm:px-10 flex flex-wrap items-center justify-between gap-4">
        {/* Identidad / Logo */}
        <a href="#inicio" className="flex items-center gap-2.5 group">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-[26px] font-bold tracking-wider text-[#3A3A3A] font-serif leading-none">
              SINATUR
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#8C8C8C] tracking-tight mt-0.5">
              Sistema Nacional de Turismo
            </span>
          </div>
        </a>

        {/* Enlaces de Navegación */}
        <ul className="flex items-center gap-6 sm:gap-9 text-xs sm:text-sm font-semibold text-[#3A3A3A]">
          <li>
            <a
              href="#inicio"
              className="hover:text-[#C45111] transition-colors relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#C45111] after:transition-all hover:after:w-full"
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              href="#explorar"
              className="hover:text-[#C45111] transition-colors relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#C45111] after:transition-all hover:after:w-full"
            >
              Explorar
            </a>
          </li>
          <li>
            <a
              href="#contacto"
              className="hover:text-[#C45111] transition-colors relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#C45111] after:transition-all hover:after:w-full"
            >
              Contacto
            </a>
          </li>
        </ul>

        {/* Acciones de Usuario */}
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#526554]" lang="es">
            <Languages aria-hidden="true" className="w-4 h-4" /> Español
          </span>

          <button
            type="button"
            onClick={onLoginClick}
            className="flex min-h-11 items-center gap-2 text-[#344e3b] hover:text-[#C45111] transition-colors text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-gray-100/80 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[#6A6A6A]">
              <User className="w-4 h-4 fill-current" />
            </div>
            <span>Ingresar</span>
          </button>

          <button
            type="button"
            onClick={onPublishClick}
            className="min-h-11 bg-[#C45111] hover:bg-[#9d3e0b] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 rounded-full shadow-md shadow-[#C45111]/25 hover:shadow-lg hover:shadow-[#C45111]/35 transition-all cursor-pointer"
          >
            Publícate con nosotros
          </button>
        </div>
      </nav>
    </header>
  );
};

/* ============================================================================
 * ARCHIVO: src/components/EventCarousel.jsx
 * Carrusel de próximos eventos con badges, overlay e indicadores inferiores
 * ============================================================================ */
export const EventCarousel = ({
  title = 'Próximos eventos',
  events = [],
  activeIndex = 0,
  onPrev,
  onNext,
  onSelectDot
}) => {
  const currentEvent = events.length > 0 ? events[activeIndex] : null;
  const totalDots = events.length > 0 ? events.length : 3;

  return (
    <section id="eventos" className="w-full max-w-7xl mx-auto mt-8 px-6 sm:px-10 scroll-mt-28">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#C45111]" />
          <h2 className="text-base sm:text-lg font-bold text-[#2D2D2D]">
            {title}
          </h2>
        </div>
        <span className="text-xs font-medium text-[#526554] bg-[#526554]/15 px-3 py-1 rounded-full">
          Agenda Nacional
        </span>
      </div>

      <div className="relative w-full h-[240px] sm:h-[320px] bg-[#E2E2E2] rounded-[28px] flex items-center justify-between px-4 sm:px-6 overflow-hidden shadow-inner border border-gray-300/60 group">
        {/* Imagen dinámica si existe */}
        {currentEvent && currentEvent.imageUrl && (
          <img
            src={currentEvent.imageUrl}
            alt={currentEvent.titulo || 'Evento'}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Degradado inferior para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

        {/* Información del evento (conectada a tabla eventos_nacionales) */}
        <div className="absolute bottom-6 left-8 right-8 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[#C45111] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                {currentEvent?.tipo_evento || 'Categoría del evento'}
              </span>
              <span className="bg-white/25 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {currentEvent?.departamento || 'Departamento / Municipio'}
              </span>
              {currentEvent?.es_gratuito !== undefined && (
                <span className="bg-[#526554] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                  {currentEvent.es_gratuito ? 'Entrada Gratis' : `C$ ${currentEvent.costo_entrada}`}
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-2xl font-bold tracking-tight drop-shadow-xs">
              {currentEvent?.titulo || 'Título del próximo evento nacional'}
            </h3>
            <p className="text-xs sm:text-sm text-white/85 line-clamp-1 mt-0.5">
              {currentEvent?.descripcion || 'Descripción breve, fecha y hora del evento programado'}
            </p>
          </div>
        </div>

        {/* Botón Anterior */}
        <button
          type="button"
          onClick={onPrev}
          aria-label="Evento anterior"
          className="relative z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2]" />
        </button>

        {/* Botón Siguiente */}
        <button
          type="button"
          onClick={onNext}
          aria-label="Siguiente evento"
          className="relative z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 stroke-[2]" />
        </button>

        {/* Indicadores inferiores (Dots) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelectDot && onSelectDot(index)}
              aria-label={`Ir al evento ${index + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeIndex === index
                  ? 'w-6 bg-[#C45111]'
                  : 'w-2 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
 * ARCHIVO: src/components/CategorySelector.jsx
 * Selector de categorías con tarjetas cuadradas de borde naranja
 * ============================================================================ */
const DEFAULT_CATEGORIES = [
  { id: 'hospedajes', label: 'Hospedajes', Icon: HospedajeIcon },
  { id: 'restaurantes', label: 'Restaurantes', Icon: Utensils },
  { id: 'bares', label: 'Bares', Icon: Martini },
  { id: 'discotecas', label: 'Discotecas', Icon: Disc },
  { id: 'cafeterias', label: 'Cafeterías', Icon: Coffee },
  { id: 'transporte', label: 'Transporte', Icon: Bus }
];

export const CategorySelector = ({
  title = '¿A dónde deseas ir hoy?',
  categories = DEFAULT_CATEGORIES,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div id="explorar" className="w-full max-w-7xl mx-auto mt-12 px-6 sm:px-10 text-center scroll-mt-28">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#344e3b] mb-7">
        {title}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 sm:gap-6 max-w-4xl mx-auto justify-items-center">
        {categories.map(({ id, label, Icon }) => {
          const isSelected = selectedCategory === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(id)}
              className="group flex flex-col items-center focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#C45111] cursor-pointer"
              aria-pressed={isSelected}
            >
              <div
                className={`w-[100px] h-[100px] sm:w-[112px] sm:h-[112px] rounded-[24px] flex items-center justify-center border-[2.5px] transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#C45111] border-[#C45111] text-white scale-105 shadow-[0_8px_20px_rgba(255,122,47,0.4)]'
                    : 'bg-white border-[#C45111] text-[#C45111] shadow-[0_4px_14px_rgba(255,122,47,0.18)] group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(255,122,47,0.3)]'
                }`}
              >
                <Icon className="w-11 h-11 stroke-[1.8]" />
              </div>
              <span
                className={`mt-2.5 text-xs sm:text-[13px] font-bold transition-colors ${
                  isSelected
                    ? 'text-[#C45111]'
                    : 'text-[#6B6B6B] group-hover:text-[#C45111]'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
 * ARCHIVO: src/components/SearchBar.jsx
 * Barra de búsqueda mejorada con filtro de departamento y botón de acción
 * ============================================================================ */
export const SearchBar = ({
  value = '',
  selectedDepartment = '',
  departments = [],
  onChange,
  onDepartmentChange,
  onSearchSubmit,
  placeholder = '¿Sabes dónde deseas ir?'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit({ query: value, department: selectedDepartment });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-9 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-full border border-gray-200 shadow-md hover:shadow-lg focus-within:border-[#C45111] focus-within:ring-4 focus-within:ring-[#C45111]/10 pl-5 pr-2 py-2 transition-all"
      >
        <Search className="w-5 h-5 text-[#C45111] mr-3 shrink-0" />
        <input
          type="text"
          aria-label="Buscar destinos o negocios"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs sm:text-sm text-gray-700 placeholder-[#9E9E9E] focus:outline-none"
        />

        {/* Filtro rápido por Departamento (se llena dinámicamente o muestra opción base) */}
        <div className="hidden sm:flex items-center border-l border-gray-200 pl-3 mr-2">
          <MapPin className="w-4 h-4 text-[#526554] mr-1.5 shrink-0" />
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange && onDepartmentChange(e.target.value)}
            aria-label="Filtrar por departamento"
            className="bg-transparent text-xs font-medium text-[#5A5A5A] focus:outline-none cursor-pointer pr-2"
          >
            <option value="">Todo el país</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-[#C45111] hover:bg-[#9d3e0b] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0 cursor-pointer shadow-xs"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};

/* ============================================================================
 * ARCHIVO: src/components/SectionHeaderDecoration.jsx
 * Encabezado con grecas ornamentales a ambos lados del título de categoría
 * ============================================================================ */
export const SectionHeaderDecoration = ({ title }) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      {/* Greca Izquierda */}
      <svg
        width="70"
        height="22"
        viewBox="0 0 70 22"
        fill="none"
        className="text-[#526554] shrink-0"
      >
        <line
          x1="2"
          y1="19"
          x2="64"
          y2="19"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M44 19V6L52 12V19M56 19V3L66 10V19"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <rect x="60" y="13" width="4" height="6" stroke="currentColor" strokeWidth="1.2" />
      </svg>

      <h3 className="text-[#3A3A3A] text-base md:text-xl font-semibold tracking-wide px-2">
        {title}
      </h3>

      {/* Greca Derecha */}
      <svg
        width="70"
        height="22"
        viewBox="0 0 70 22"
        fill="none"
        className="text-[#526554] shrink-0"
      >
        <line
          x1="6"
          y1="19"
          x2="68"
          y2="19"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M26 19V6L18 12V19M14 19V3L4 10V19"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <rect x="6" y="13" width="4" height="6" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
};

/* ============================================================================
 * ARCHIVO: src/components/RecommendationSection.jsx
 * Tarjeta verde salvia (#526554) enriquecida con Favoritos, Reseñas, Horario y Maps
 * ============================================================================ */
export const RecommendationSection = ({
  id,
  sectionTitle,
  nombreNegocio = 'Nombre negocio',
  descripcion = 'Descripción',
  localidad = 'Localidad / Dirección',
  puntuacion = 'Puntuacion',
  horario = 'Horario de atención',
  mapsLink = null,
  esDestacado = false,
  esFavorito = false,
  imageUrl = null,
  imagePlaceholder = 'Imágenes ilustrativas del negocio',
  onToggleFavorite,
  onViewDetails,
  onPrevBusiness,
  onNextBusiness,
  onPrevImage,
  onNextImage
}) => {
  return (
    <div id={id} className="w-full scroll-mt-24">
      {/* Título de la sección con ornamentos */}
      <SectionHeaderDecoration title={sectionTitle} />

      {/* Contenedor Verde Salvia (#526554) */}
      <div className="relative w-full bg-[#526554] rounded-[34px] px-10 sm:px-14 py-8 sm:py-10 shadow-md hover:shadow-lg transition-shadow">
        {/* Flecha Izquierda de navegación de negocios */}
        <button
          type="button"
          onClick={onPrevBusiness}
          aria-label="Negocio anterior"
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2]" />
        </button>

        {/* Contenido dividido en 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Columna Izquierda: Información del negocio */}
          <div className="md:col-span-5 flex flex-col justify-between h-full min-h-[230px] sm:min-h-[260px] text-white py-1 text-left">
            <div>
              {/* Badges superiores (Horario y Destacado por campaña publicitaria) */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  {horario}
                </span>

                {esDestacado && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#C45111] text-white px-3 py-1 rounded-full shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    Destacado
                  </span>
                )}
              </div>

              <h4 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                {nombreNegocio}
              </h4>
              <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed pl-2 border-l-2 border-white/40">
                {descripcion}
              </p>
            </div>

            {/* Ubicación, Estrellas de Calificación y Botones de Acción */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm sm:text-base font-bold tracking-tight leading-snug">
                    {localidad}
                  </h5>
                  {mapsLink && (
                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-white/80 hover:text-white underline mt-0.5"
                    >
                      Ver en Google Maps
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Calificación (conectada a tabla resenas) */}
              <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
                <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-full">
                  <div className="flex items-center text-amber-300">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white ml-1">
                    {puntuacion}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onViewDetails}
                  className="bg-white text-[#5F6B58] hover:bg-[#C45111] hover:text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-xs cursor-pointer"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Recuadro blanco para galería de imágenes */}
          <div className="md:col-span-7">
            <div className="relative bg-white rounded-[26px] h-[240px] sm:h-[280px] w-full flex items-center justify-center overflow-hidden shadow-inner group">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={nombreNegocio}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#BDBDBD] text-xs sm:text-sm font-medium select-none px-8 text-center">
                  {imagePlaceholder}
                </span>
              )}

              {/* Botón de Guardar en Favoritos (conectado a tabla favoritos) */}
              <button
                type="button"
                onClick={onToggleFavorite}
                aria-label="Guardar en favoritos"
                className={`absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer ${
                  esFavorito
                    ? 'bg-red-50 text-red-500 scale-105'
                    : 'bg-gray-100/90 hover:bg-white text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${esFavorito ? 'fill-current' : ''}`} />
              </button>

              {/* Flecha Izquierda de imagen */}
              <button
                type="button"
                onClick={onPrevImage}
                aria-label="Imagen anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100/80 hover:bg-white text-gray-500 hover:text-gray-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* Flecha Derecha de imagen */}
              <button
                type="button"
                onClick={onNextImage}
                aria-label="Siguiente imagen"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100/80 hover:bg-white text-gray-500 hover:text-gray-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>
          </div>
        </div>

        {/* Flecha Derecha de navegación de negocios */}
        <button
          type="button"
          onClick={onNextBusiness}
          aria-label="Siguiente negocio"
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
 * ARCHIVO: src/components/Footer.jsx
 * Pie de página institucional para cerrar el diseño visualmente
 * ============================================================================ */
export const Footer = () => {
  return (
    <footer id="contacto" className="w-full bg-[#2F362C] text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-xl font-bold tracking-wider font-serif">
            SINATUR
          </span>
          <span className="text-xs text-white/70 mt-1">
            Sistema Nacional de Turismo · Descubre y conecta con cada destino
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-white/80">
          <a href="#inicio" className="hover:text-[#C45111] transition-colors">
            Inicio
          </a>
          <a href="#explorar" className="hover:text-[#C45111] transition-colors">
            Explorar
          </a>
          <a href="#contacto" className="hover:text-[#C45111] transition-colors">
            Publicidad
          </a>
        </div>

        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} SINATUR. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

/* ============================================================================
 * ARCHIVO: src/App.jsx (Vista Principal HomePage)
 * ============================================================================ */
const RECOMMENDATION_SECTIONS = [
  { id: 'hospedajes', title: 'Hospedajes' },
  { id: 'restaurantes', title: 'Restaurantes' },
  { id: 'bares', title: 'Bares' },
  { id: 'discotecas', title: 'Discotecas' },
  { id: 'cafeterias', title: 'Cafetería' }
];

export default function App() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [favorites, setFavorites] = useState({});

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const targetElement = document.getElementById(categoryId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFavorite = (sectionId) => {
    setFavorites((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div id="inicio" className="w-full min-h-screen bg-[#f6f8f3] text-[#2D2D2D] flex flex-col justify-between">
      <div>
        {/* 1. Barra de Navegación Fija (Glassmorphism) */}
        <Navbar
          onLoginClick={() => navigate('/ingresar')}
          onPublishClick={() => navigate('/registro-negocio')}
        />

        {/* Explorar primero, luego descubrir eventos y recomendaciones. */}
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        <SearchBar
          value={searchQuery}
          selectedDepartment={selectedDepartment}
          onChange={setSearchQuery}
          onDepartmentChange={setSelectedDepartment}
        />

        <EventCarousel />

        {/* 4. Sección de Recomendaciones */}
        <section className="w-full max-w-7xl mx-auto mt-16 px-6 sm:px-10">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C45111] bg-[#C45111]/10 px-3.5 py-1.5 rounded-full">
              Explora Destinos
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#3A3A3A] mt-3">
              ¿Quieres una recomendación?
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#7A7A7A] mt-1">
              Echa un vistazo a los lugares mejor valorados por categoría
            </p>
          </div>

          <div className="space-y-14">
            {RECOMMENDATION_SECTIONS.map((section) => (
              <RecommendationSection
                key={section.id}
                id={section.id}
                sectionTitle={section.title}
                esFavorito={!!favorites[section.id]}
                onToggleFavorite={() => toggleFavorite(section.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* 5. Pie de Página (Footer) */}
      <Footer />
    </div>
  );
}
