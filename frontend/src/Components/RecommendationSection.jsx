import SectionHeaderDecoration from './SectionHeaderDecoration';
import { ChevronLeft, Clock, MapPin, Star, Heart, ChevronRight, Sparkles, ExternalLink } from "lucide-react";
const RecommendationSection = ({
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
                className={`absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer ${esFavorito
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
export default RecommendationSection;
