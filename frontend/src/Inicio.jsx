import './App.css';
import React, { useState } from 'react';
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
  Bus
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
 * Barra de navegación superior de SINATUR
 * ============================================================================ */
export const Navbar = ({ onLoginClick, onPublishClick, onLanguageToggle }) => {
  return (
    <header className="w-full max-w-7xl mx-auto pt-6 pb-4 px-6 sm:px-10">
      <nav className="flex flex-wrap items-center justify-between gap-4">
        {/* Identidad / Logo */}
        <a href="#inicio" className="flex flex-col items-center sm:items-start">
          <span className="text-2xl sm:text-[26px] font-bold tracking-wider text-[#4A4A4A] font-serif leading-none">
            SINATUR
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#8C8C8C] tracking-tight mt-0.5">
            Sistema Nacional de Turismo
          </span>
        </a>

        {/* Enlaces de Navegación */}
        <ul className="flex items-center gap-6 sm:gap-9 text-xs sm:text-sm font-semibold text-[#2B2B2B]">
          <li>
            <a href="#inicio" className="hover:text-[#FF7A2F] transition-colors">
              Inicio
            </a>
          </li>
          <li>
            <a href="#departamentos" className="hover:text-[#FF7A2F] transition-colors">
              Departamentos
            </a>
          </li>
          <li>
            <a href="#contacto" className="hover:text-[#FF7A2F] transition-colors">
              Contacto
            </a>
          </li>
        </ul>

        {/* Acciones de Usuario */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={onLanguageToggle}
            aria-label="Cambiar idioma"
            className="text-[#4A4A4A] hover:text-[#FF7A2F] transition-colors p-1.5 rounded-lg border border-gray-300/80 bg-white/70 cursor-pointer"
          >
            <Languages className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onLoginClick}
            className="flex items-center gap-1.5 text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors text-xs sm:text-sm font-medium cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#8C8C8C]/25 flex items-center justify-center text-[#7A7A7A]">
              <User className="w-4 h-4 fill-current" />
            </div>
            <span>Ingresar</span>
          </button>

          <button
            type="button"
            onClick={onPublishClick}
            className="bg-[#FF7A2F] hover:bg-[#e8661c] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
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
 * Carrusel de próximos eventos
 * ============================================================================ */
export const EventCarousel = ({
  title = 'Próximos eventos',
  events = [],
  onPrev,
  onNext
}) => {
  const currentEvent = events.length > 0 ? events[0] : null;

  return (
    <section className="w-full max-w-7xl mx-auto mt-6 px-6 sm:px-10">
      <h2 className="text-base sm:text-lg font-bold text-[#2D2D2D] mb-3 px-1">
        {title}
      </h2>

      <div className="relative w-full h-[220px] sm:h-[280px] bg-[#E2E2E2] rounded-[24px] flex items-center justify-between px-4 sm:px-6 overflow-hidden shadow-xs">
        {currentEvent && currentEvent.imageUrl && (
          <img
            src={currentEvent.imageUrl}
            alt={currentEvent.title || 'Evento'}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <button
          type="button"
          onClick={onPrev}
          aria-label="Evento anterior"
          className="relative z-10 text-white hover:scale-110 transition-transform p-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-7 h-7 stroke-[1.8]" />
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Siguiente evento"
          className="relative z-10 text-white hover:scale-110 transition-transform p-1.5 cursor-pointer"
        >
          <ChevronRight className="w-7 h-7 stroke-[1.8]" />
        </button>
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
    <div className="w-full max-w-7xl mx-auto mt-10 px-6 sm:px-10 text-center">
      <h2 className="text-base sm:text-lg font-medium text-[#6B6B6B] mb-7">
        {title}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 sm:gap-6 max-w-4xl mx-auto justify-items-center">
        {categories.map(({ id, label, Icon }) => {
          const isSelected = selectedCategory === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(id)}
              className="group flex flex-col items-center focus:outline-none cursor-pointer"
            >
              <div
                className={`w-[100px] h-[100px] sm:w-[112px] sm:h-[112px] rounded-[22px] bg-white flex items-center justify-center border-[2.5px] transition-all duration-200 ${
                  isSelected
                    ? 'border-[#FF7A2F] text-[#FF7A2F] scale-105 shadow-[0_0_16px_rgba(255,122,47,0.45)]'
                    : 'border-[#FF8A47] text-[#FF8A47] shadow-[0_2px_12px_rgba(255,122,47,0.28)] group-hover:scale-105 group-hover:shadow-[0_4px_16px_rgba(255,122,47,0.4)]'
                }`}
              >
                <Icon className="w-11 h-11 stroke-[1.8]" />
              </div>
              <span className="mt-2.5 text-xs sm:text-[13px] font-bold text-[#7A7A7A] group-hover:text-[#FF7A2F] transition-colors">
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
 * Barra de búsqueda redondeada
 * ============================================================================ */
export const SearchBar = ({
  value = '',
  onChange,
  placeholder = '¿Sabes dónde deseas ir?'
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mt-8 px-4">
      <div className="relative flex items-center bg-white rounded-full border border-gray-200/90 shadow-xs px-4 py-2.5 focus-within:border-[#FF7A2F] transition-all">
        <Search className="w-4 h-4 text-[#FF7A2F] mr-3 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs sm:text-sm text-gray-700 placeholder-[#A6A6A6] focus:outline-none"
        />
      </div>
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
        className="text-[#8B9883] shrink-0"
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

      <h3 className="text-[#4A4A4A] text-base md:text-lg font-medium tracking-wide px-1">
        {title}
      </h3>

      {/* Greca Derecha */}
      <svg
        width="70"
        height="22"
        viewBox="0 0 70 22"
        fill="none"
        className="text-[#8B9883] shrink-0"
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
 * Tarjeta verde salvia (#8B9883) reutilizable para mostrar cada categoría
 * ============================================================================ */
export const RecommendationSection = ({
  id,
  sectionTitle,
  nombreNegocio = 'Nombre negocio',
  descripcion = 'Descripción',
  localidad = 'Localidad / Dirección',
  puntuacion = 'Puntuacion',
  imageUrl = null,
  imagePlaceholder = 'Imágenes ilustrativas del negocio',
  onPrevBusiness,
  onNextBusiness,
  onPrevImage,
  onNextImage
}) => {
  return (
    <div id={id} className="w-full">
      {/* Título de la sección con ornamentos ARRIBA de la tarjeta */}
      <SectionHeaderDecoration title={sectionTitle} />

      {/* Contenedor Verde Salvia (#8B9883) */}
      <div className="relative w-full bg-[#8B9883] rounded-[34px] px-10 sm:px-14 py-8 sm:py-10 shadow-sm">
        {/* Flecha Izquierda de navegación de negocios */}
        <button
          type="button"
          onClick={onPrevBusiness}
          aria-label="Negocio anterior"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/85 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <ChevronLeft className="w-7 h-7 stroke-[1.6]" />
        </button>

        {/* Contenido dividido en 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Columna Izquierda: Información del negocio */}
          <div className="md:col-span-5 flex flex-col justify-between h-full min-h-[210px] sm:min-h-[240px] text-white py-2 text-left">
            <div>
              <h4 className="text-lg sm:text-xl font-bold tracking-tight mb-2">
                {nombreNegocio}
              </h4>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed pl-2 sm:pl-4">
                {descripcion}
              </p>
            </div>

            <div className="mt-8 sm:mt-12">
              <h5 className="text-base sm:text-lg font-bold tracking-tight mb-1.5">
                {localidad}
              </h5>
              <p className="text-xs sm:text-sm text-white/95 font-medium pl-2 sm:pl-4">
                {puntuacion}
              </p>
            </div>
          </div>

          {/* Columna Derecha: Recuadro blanco para imágenes */}
          <div className="md:col-span-7">
            <div className="relative bg-white rounded-[24px] h-[230px] sm:h-[270px] w-full flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={nombreNegocio}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#CCCCCC] text-xs sm:text-sm font-medium select-none px-8 text-center">
                  {imagePlaceholder}
                </span>
              )}

              {/* Flecha Izquierda de imagen */}
              <button
                type="button"
                onClick={onPrevImage}
                aria-label="Imagen anterior"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#D0D0D0] hover:text-gray-500 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 stroke-[1.6]" />
              </button>

              {/* Flecha Derecha de imagen */}
              <button
                type="button"
                onClick={onNextImage}
                aria-label="Siguiente imagen"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#D0D0D0] hover:text-gray-500 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 stroke-[1.6]" />
              </button>
            </div>
          </div>
        </div>

        {/* Flecha Derecha de navegación de negocios */}
        <button
          type="button"
          onClick={onNextBusiness}
          aria-label="Siguiente negocio"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/85 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <ChevronRight className="w-7 h-7 stroke-[1.6]" />
        </button>
      </div>
    </div>
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const targetElement = document.getElementById(categoryId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-[#F9F9F9] text-[#2D2D2D] pb-20"
      style={{
        backgroundImage: `
          linear-gradient(to right, #EAEAEA 1px, transparent 1px),
          linear-gradient(to bottom, #EAEAEA 1px, transparent 1px)
        `,
        backgroundSize: '34px 34px'
      }}
    >
      {/* 1. Barra de Navegación */}
      <Navbar />

      {/* 2. Carrusel de Próximos Eventos */}
      <EventCarousel />

      {/* 3. Selector de Categorías y Barra de Búsqueda */}
      <CategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* 4. Sección de Recomendaciones */}
      <section className="w-full max-w-7xl mx-auto mt-14 px-6 sm:px-10">
        <div className="text-center mb-10">
          <h2 className="text-base sm:text-lg font-medium text-[#6B6B6B]">
            ¿Quieres una recomendación?
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#6B6B6B] mt-0.5">
            Echa un vistazo
          </p>
        </div>

        <div className="space-y-12">
          {RECOMMENDATION_SECTIONS.map((section) => (
            <RecommendationSection
              key={section.id}
              id={section.id}
              sectionTitle={section.title}
            />
          ))}
        </div>
      </section>
    </div>
  );
}