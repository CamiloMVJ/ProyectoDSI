 const EventCarousel = ({
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
export default EventCarousel;