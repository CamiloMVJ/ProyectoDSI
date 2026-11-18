import { Calendar, MapPin, Clock, Ticket, Repeat, Navigation, ChevronLeft, ChevronRight } from "lucide-react";

const MESES_CORTOS = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
];

function parsearFechaLocal(rawDate) {
  if (!rawDate) return null;
  const [year, month, day] = String(rawDate).split('T')[0].split('-').map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

function formatearFechaCorta(rawDate) {
  const f = parsearFechaLocal(rawDate);
  if (!f) return null;
  return `${String(f.day).padStart(2, '0')} ${MESES_CORTOS[f.month - 1]} ${f.year}`;
}

function extraerFechaEvento(evento) {
  const f = parsearFechaLocal(evento?.fecha_inicio);
  if (!f) {
    return { dia: '—', mes: 'AGENDA', anio: '' };
  }

  return {
    dia: String(f.day).padStart(2, '0'),
    mes: MESES_CORTOS[f.month - 1] || 'EVENTO',
    anio: String(f.year),
  };
}

import { Link } from 'react-router-dom';
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
  const { dia, mes, anio } = extraerFechaEvento(currentEvent);

  const fechaInicioTxt = formatearFechaCorta(currentEvent?.fecha_inicio);
  const fechaFinTxt = formatearFechaCorta(currentEvent?.fecha_fin);
  const rangoFechas =
    fechaInicioTxt && fechaFinTxt && fechaInicioTxt !== fechaFinTxt
      ? `Del ${fechaInicioTxt} al ${fechaFinTxt}`
      : fechaInicioTxt || 'Fecha por confirmar';

  const horaInicio = currentEvent?.hora_inicio ? String(currentEvent.hora_inicio).slice(0, 5) : null;
  const horaFin = currentEvent?.hora_fin ? String(currentEvent.hora_fin).slice(0, 5) : null;
  const horarioTexto =
    horaInicio && horaFin
      ? `${horaInicio} - ${horaFin}`
      : horaInicio || 'Horario por confirmar';

  const ubicacion = [currentEvent?.municipio, currentEvent?.departamento]
    .filter(Boolean)
    .join(', ') || 'Departamento / Municipio';

  return (
    <section id="eventos" className="w-full max-w-7xl mx-auto mt-8 px-6 sm:px-10 scroll-mt-28">
      {/* Encabezado superior */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#C45111]" />
          <h2 className="text-base sm:text-lg font-bold text-[#2D2D2D]">
            {title}
          </h2>
        </div>
        <span className="text-xs font-medium text-[#526554] bg-[#526554]/15 px-3 py-1 rounded-full">
          <Link to="/calendario" className="underline underline-offset-2">Ver calendario</Link>
        </span>
      </div>

      {/* Contenedor Principal */}
      <div className="relative w-full bg-white rounded-[28px] px-12 sm:px-16 py-7 sm:py-8 shadow-sm hover:shadow-md transition-shadow border border-gray-200/80">
        {/* Botón Anterior */}
        <button
          type="button"
          onClick={onPrev}
          aria-label="Evento anterior"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-[#C45111] text-gray-700 hover:text-white shadow-xs flex items-center justify-center transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
        </button>

        {/* Contenido Central */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5 sm:gap-7">
          {/* Bloque Izquierdo: Tarjeta de Fecha */}
          <div className="shrink-0 w-full md:w-36 rounded-2xl bg-[#526554] text-white px-5 py-4 flex md:flex-col items-center justify-between md:justify-center text-center shadow-xs">
            <span className="text-xs font-bold tracking-widest uppercase text-white/80">
              {mes}
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold leading-none my-0 md:my-1.5">
              {dia}
            </span>
            {anio && (
              <span className="text-[11px] font-semibold tracking-wider text-white/90 bg-black/15 px-2.5 py-0.5 rounded-full">
                {anio}
              </span>
            )}
          </div>

          {/* Bloque Derecho: Toda la información del Evento */}
          <div className="flex-1 text-left">
            {/* Badges superiores */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="bg-[#C45111] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                {currentEvent?.tipo_evento || 'Categoría del evento'}
              </span>

              <span className="bg-gray-100 text-gray-700 text-[11px] font-medium px-3 py-1 rounded-full inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#526554]" />
                {ubicacion}
              </span>

              {currentEvent?.es_gratuito !== undefined && (
                <span className="bg-[#526554]/15 text-[#526554] text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Ticket className="w-3 h-3" />
                  {currentEvent.es_gratuito ? 'Entrada Gratis' : `C$ ${currentEvent.costo_entrada}`}
                </span>
              )}

              {currentEvent?.es_anual_recurrente && (
                <span className="bg-amber-100/80 text-amber-900 text-[11px] font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Repeat className="w-3 h-3" />
                  Evento anual
                </span>
              )}

              {currentEvent?.estado && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {currentEvent.estado}
                </span>
              )}
            </div>

            {/* Título */}
            <h3 className="text-lg sm:text-2xl font-bold text-[#2D2D2D] tracking-tight">
              {currentEvent?.titulo || 'Título del próximo evento nacional'}
            </h3>

            {/* Descripción completa */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1.5">
              {currentEvent?.descripcion || 'Descripción breve, fecha y hora del evento programado'}
            </p>

            {/* Metadatos detallados (Fechas, Horario y Dirección exacta) */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3.5 pt-3 border-t border-gray-100 text-xs text-gray-600">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#C45111]" />
                {rangoFechas}
              </span>

              <span className="inline-flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#526554]" />
                {horarioTexto}
              </span>

              {currentEvent?.direccion_referencia && (
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Navigation className="w-3.5 h-3.5 text-[#C45111]" />
                  {currentEvent.direccion_referencia}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Botón Siguiente */}
        <button
          type="button"
          disabled={!events.length}
          onClick={onNext}
          aria-label="Siguiente evento"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-[#C45111] text-gray-700 hover:text-white shadow-xs flex items-center justify-center transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
        </button>

        {/* Indicadores inferiores (Dots) */}
        <div className="flex items-center justify-center gap-2 mt-5 pt-3 border-t border-gray-100">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelectDot && onSelectDot(index)}
              aria-label={`Ir al evento ${index + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeIndex === index
                  ? 'w-6 bg-[#C45111]'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCarousel;