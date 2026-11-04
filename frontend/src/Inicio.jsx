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
  Bus,
  BedDouble,
  Star,
  MapPin,
  Calendar,
  Eye,
  LayoutTemplate,
  X
} from 'lucide-react';

// --- Ornamentos SVG laterales para los títulos de las secciones (estilo greca del Figma) ---
const LeftOrnament = () => (
  <svg width="70" height="22" viewBox="0 0 70 22" fill="none" className="text-[#8B9883] shrink-0">
    <line x1="2" y1="19" x2="64" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M44 19V6L52 12V19M56 19V3L66 10V19"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <rect x="60" y="13" width="4" height="6" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const RightOrnament = () => (
  <svg width="70" height="22" viewBox="0 0 70 22" fill="none" className="text-[#8B9883] shrink-0">
    <line x1="6" y1="19" x2="68" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M26 19V6L18 12V19M14 19V3L4 10V19"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <rect x="6" y="13" width="4" height="6" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

// --- Icono personalizado de Hospedaje (Cama bajo techo como en el Figma) ---
const HospedajeIcon = () => (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Techo */}
    <path d="M6 20L24 9L42 20" />
    {/* Estructura de cama */}
    <path d="M10 23V37" />
    <path d="M38 28V37" />
    <path d="M10 33H38" />
    {/* Almohada y colchón */}
    <path d="M14 29H21V26C21 24.8954 20.1046 24 19 24H16C14.8954 24 14 24.8954 14 26V29Z" />
    <path d="M21 29H36C37.1046 29 38 29.8954 38 31V33H10V29H14" />
  </svg>
);

// --- Datos de ejemplo conectados al modelo de SINATUR ---
const EVENTOS_EJEMPLO = [
  {
    id_evento: 1,
    titulo: 'Festival Gastronómico y Cultural de Granada',
    fecha: '15 - 17 de Noviembre',
    departamento: 'Granada',
    descripcion: 'Disfruta de la mejor gastronomía típica nicaragüense, música marimba en vivo y artesanías frente al Parque Central.',
    imagen: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id_evento: 2,
    titulo: 'Carnaval Acuático de Río San Juan',
    fecha: '22 de Noviembre',
    departamento: 'Río San Juan, San Carlos',
    descripcion: 'Desfile de carrozas acuáticas, comparsas culturales y recorridos turísticos hacia el Archipiélago de Solentiname.',
    imagen: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id_evento: 3,
    titulo: 'Noche de Agüizotes y Tradición en Masaya',
    fecha: '29 de Noviembre',
    departamento: 'Masaya',
    descripcion: 'Recorrido tradicional de mitos y leyendas con música filarmónica por las principales calles de la Ciudad de las Flores.',
    imagen: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
  }
];

const RECOMENDACIONES_DATA = [
  {
    id: 'hospedajes',
    tituloSeccion: 'Hospedajes',
    negocios: [
      {
        nombre: 'Hotel Darío Colonial & Spa',
        descripcion: 'Hospedaje de estilo neoclásico con piscina interior, jardines tropicales y desayuno típico incluido a pasos de la Calzada.',
        localidad: 'Granada, Calle La Calzada 2 cuadras al lago',
        puntuacion: '4.9 / 5.0 (128 reseñas)',
        imagenes: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80'
        ]
      },
      {
        nombre: 'Eco-Lodge Selva Negra',
        descripcion: 'Cabañas ecológicas rodeadas de bosque nuboso y plantaciones de café orgánico con senderos guiados.',
        localidad: 'Matagalpa, Km 140 Carretera Matagalpa - Jinotega',
        puntuacion: '4.8 / 5.0 (215 reseñas)',
        imagenes: [
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80'
        ]
      }
    ]
  },
  {
    id: 'restaurantes',
    tituloSeccion: 'Restaurantes',
    negocios: [
      {
        nombre: 'El Zaguan Asados Nicaragüenses',
        descripcion: 'Especialistas en cortes de carne de exportación a la parrilla, gallo pinto tradicional, tostones con queso y postres caseros.',
        localidad: 'Granada, Detrás de la Catedral 1/2 cuadra al Este',
        puntuacion: '4.8 / 5.0 (310 reseñas)',
        imagenes: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80'
        ]
      },
      {
        nombre: 'Mirador La Catarina Típico',
        descripcion: 'Gastronomía tradicional frente a la laguna de Apoyo con música de marimba en vivo todos los fines de semana.',
        localidad: 'Catarina, Masaya, Mirador Principal',
        puntuacion: '4.7 / 5.0 (184 reseñas)',
        imagenes: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80'
        ]
      }
    ]
  },
  {
    id: 'bares',
    tituloSeccion: 'Bares',
    negocios: [
      {
        nombre: 'La Terraza del Puerto Bar & Lounge',
        descripcion: 'Coctelería artesanal con rones nacionales, cervezas bien frías, boquitas del mar y vista al atardecer frente al lago.',
        localidad: 'Managua, Puerto Salvador Allende Cuarta Etapa',
        puntuacion: '4.7 / 5.0 (95 reseñas)',
        imagenes: [
          'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80'
        ]
      },
      {
        nombre: 'El Patio Colonial Tapas & Drinks',
        descripcion: 'Ambiente bohemio con música acústica, sangrías de la casa y picaderas para compartir entre amigos.',
        localidad: 'León, De la Iglesia La Recolección 1 cuadra al Norte',
        puntuacion: '4.6 / 5.0 (78 reseñas)',
        imagenes: [
          'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=900&q=80'
        ]
      }
    ]
  },
  {
    id: 'discotecas',
    tituloSeccion: 'Discotecas',
    negocios: [
      {
        nombre: 'Club Nocturno Brisas de San Juan',
        descripcion: 'Pista de baile frente a la bahía, DJs invitados cada fin de semana, iluminación LED y área VIP reservada.',
        localidad: 'San Juan del Sur, Rivas, Paseo del Rey',
        puntuacion: '4.6 / 5.0 (142 reseñas)',
        imagenes: [
          'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80'
        ]
      },
      {
        nombre: 'Zona Rosa Beat Club',
        descripcion: 'El mejor ambiente nocturno de la capital con mezclas en vivo, promociones universitarias y seguridad privada.',
        localidad: 'Managua, Zona Hippos 2 cuadras al Sur',
        puntuacion: '4.5 / 5.0 (89 reseñas)',
        imagenes: [
          'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80'
        ]
      }
    ]
  },
  {
    id: 'cafeteria',
    tituloSeccion: 'Cafetería',
    negocios: [
      {
        nombre: 'Café Las Flores de Altura',
        descripcion: 'Café de especialidad 100% arábica cultivado en las montañas del norte, repostería recién horneada y Wi-Fi de alta velocidad.',
        localidad: 'Estelí, Avenida Central frente al Parque 16 de Julio',
        puntuacion: '4.9 / 5.0 (260 reseñas)',
        imagenes: [
          'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80'
        ]
      },
      {
        nombre: 'Casa del Café Jinotegano',
        descripcion: 'Métodos de extracción artesanal (V60, Chemex, Espresso), güirilas con cuajada y ambiente acogedor de montaña.',
        localidad: 'Jinotega, Costado Sur de la Catedral San Juan',
        puntuacion: '4.8 / 5.0 (150 reseñas)',
        imagenes: [
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80'
        ]
      }
    ]
  }
];

const CATEGORIAS_BOTONES = [
  { id: 'hospedajes', nombre: 'Hospedajes', icon: HospedajeIcon },
  { id: 'restaurantes', nombre: 'Restaurantes', icon: Utensils },
  { id: 'bares', nombre: 'Bares', icon: Martini },
  { id: 'discotecas', nombre: 'Discotecas', icon: Disc },
  { id: 'cafeterias', nombre: 'Cafeterías', icon: Coffee },
  { id: 'transporte', nombre: 'Transporte', icon: Bus }
];

// --- Componente para cada Bloque de Recomendación (Tarjeta Verde #8B9883) ---
const BloqueRecomendacion = ({ seccion, modoWireframe }) => {
  const [negocioIndex, setNegocioIndex] = useState(0);
  const [fotoIndex, setFotoIndex] = useState(0);

  const negocioActual = seccion.negocios[negocioIndex];

  const prevNegocio = () => {
    setNegocioIndex((prev) => (prev === 0 ? seccion.negocios.length - 1 : prev - 1));
    setFotoIndex(0);
  };

  const nextNegocio = () => {
    setNegocioIndex((prev) => (prev === seccion.negocios.length - 1 ? 0 : prev + 1));
    setFotoIndex(0);
  };

  const prevFoto = (e) => {
    e.stopPropagation();
    setFotoIndex((prev) => (prev === 0 ? negocioActual.imagenes.length - 1 : prev - 1));
  };

  const nextFoto = (e) => {
    e.stopPropagation();
    setFotoIndex((prev) => (prev === negocioActual.imagenes.length - 1 ? 0 : prev + 1));
  };

  return (
    <div id={seccion.id} className="w-full max-w-[960px] mx-auto mb-12 scroll-mt-24">
      {/* Encabezado con grecas ornamentales a los lados */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <LeftOrnament />
        <h3 className="text-[#4A4A4A] text-base md:text-lg font-medium tracking-wide px-1">
          {seccion.tituloSeccion}
        </h3>
        <RightOrnament />
      </div>

      {/* Tarjeta Verde Olivo / Salvia (#8B9883) */}
      <div className="relative bg-[#8B9883] rounded-[34px] px-10 sm:px-14 py-8 sm:py-10 shadow-md transition-all">
        {/* Flecha Izquierda de la tarjeta verde */}
        <button
          onClick={prevNegocio}
          aria-label="Negocio anterior"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/85 hover:text-white hover:scale-110 transition-transform p-1"
        >
          <ChevronLeft className="w-7 h-7 stroke-[1.6]" />
        </button>

        {/* Contenido interior en 2 columnas como el Figma */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Columna Izquierda: Textos del negocio */}
          <div className="md:col-span-5 flex flex-col justify-between h-full min-h-[210px] sm:min-h-[240px] text-white py-2">
            <div>
              <h4 className="text-lg sm:text-xl font-bold tracking-tight mb-2">
                {modoWireframe ? 'Nombre negocio' : negocioActual.nombre}
              </h4>
              <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed pl-2 sm:pl-4">
                {modoWireframe ? 'Descripción' : negocioActual.descripcion}
              </p>
            </div>

            <div className="mt-8 sm:mt-12">
              <h5 className="text-base sm:text-lg font-bold tracking-tight mb-1.5 flex items-center gap-1.5">
                {!modoWireframe && <MapPin className="w-4 h-4 shrink-0 text-white/90" />}
                <span>{modoWireframe ? 'Localidad / Dirección' : negocioActual.localidad}</span>
              </h5>
              <div className="text-xs sm:text-sm text-white/95 font-medium pl-2 sm:pl-4 flex items-center gap-1.5">
                {!modoWireframe && <Star className="w-4 h-4 fill-amber-300 text-amber-300 shrink-0" />}
                <span>{modoWireframe ? 'Puntuacion' : negocioActual.puntuacion}</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Contenedor blanco de imágenes ilustrativas */}
          <div className="md:col-span-7">
            <div className="relative bg-white rounded-[24px] h-[230px] sm:h-[270px] w-full flex items-center justify-center overflow-hidden shadow-inner group">
              {modoWireframe ? (
                <span className="text-[#CCCCCC] text-xs sm:text-sm font-medium select-none px-8 text-center">
                  Imágenes ilustrativas del negocio
                </span>
              ) : (
                <>
                  <img
                    src={negocioActual.imagenes[fotoIndex]}
                    alt={negocioActual.nombre}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <span className="absolute bottom-3 right-4 bg-black/50 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-full">
                    Foto {fotoIndex + 1} de {negocioActual.imagenes.length}
                  </span>
                </>
              )}

              {/* Flechas internas del carrusel blanco */}
              <button
                onClick={prevFoto}
                aria-label="Imagen anterior"
                className={`absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                  modoWireframe
                    ? 'text-[#D0D0D0] hover:text-gray-500'
                    : 'bg-white/80 text-gray-700 hover:bg-white shadow-xs'
                }`}
              >
                <ChevronLeft className="w-5 h-5 stroke-[1.6]" />
              </button>

              <button
                onClick={nextFoto}
                aria-label="Siguiente imagen"
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                  modoWireframe
                    ? 'text-[#D0D0D0] hover:text-gray-500'
                    : 'bg-white/80 text-gray-700 hover:bg-white shadow-xs'
                }`}
              >
                <ChevronRight className="w-5 h-5 stroke-[1.6]" />
              </button>
            </div>
          </div>
        </div>

        {/* Flecha Derecha de la tarjeta verde */}
        <button
          onClick={nextNegocio}
          aria-label="Siguiente negocio"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/85 hover:text-white hover:scale-110 transition-transform p-1"
        >
          <ChevronRight className="w-7 h-7 stroke-[1.6]" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  // Por defecto inicia en el modo idéntico al Figma para que luzca tal cual la imagen
  const [modoWireframe, setModoWireframe] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [eventoIndex, setEventoIndex] = useState(0);
  const [idioma, setIdioma] = useState('ES');
  const [modalAbierto, setModalAbierto] = useState(null); // 'login' | 'publicate' | null

  const prevEvento = () => {
    setEventoIndex((prev) => (prev === 0 ? EVENTOS_EJEMPLO.length - 1 : prev - 1));
  };

  const nextEvento = () => {
    setEventoIndex((prev) => (prev === EVENTOS_EJEMPLO.length - 1 ? 0 : prev + 1));
  };

  const irACategoria = (id) => {
    setCategoriaActiva(id);
    const targetId = id === 'cafeterias' ? 'cafeteria' : id;
    const elemento = document.getElementById(targetId);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtrado opcional si el usuario escribe en el buscador
  const seccionesFiltradas = RECOMENDACIONES_DATA.filter((sec) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      sec.tituloSeccion.toLowerCase().includes(q) ||
      sec.negocios.some(
        (n) =>
          n.nombre.toLowerCase().includes(q) ||
          n.localidad.toLowerCase().includes(q) ||
          n.descripcion.toLowerCase().includes(q)
      )
    );
  });

  const eventoActual = EVENTOS_EJEMPLO[eventoIndex];

  return (
    <div
      className="min-h-screen bg-[#FAF9F5] text-[#2D2D2D] relative pb-20 selection:bg-[#FF7A2F]/20 selection:text-[#FF7A2F]"
      style={{
        // Cuadrícula sutil de fondo como el lienzo del diseño
        backgroundImage: `
          linear-gradient(to right, rgba(215, 212, 204, 0.32) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(215, 212, 204, 0.32) 1px, transparent 1px)
        `,
        backgroundSize: '34px 34px'
      }}
    >
      {/* Barra flotante superior derecha para alternar entre el Diseño exacto de Figma y Vista con Datos Reales */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg rounded-full px-3.5 py-2 text-xs">
        <span className="text-gray-500 font-medium hidden sm:inline">Modo de vista:</span>
        <button
          onClick={() => setModoWireframe(true)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
            modoWireframe
              ? 'bg-[#FF7A2F] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          Figma Exacto
        </button>
        <button
          onClick={() => setModoWireframe(false)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
            !modoWireframe
              ? 'bg-[#8B9883] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Con Datos SINATUR
        </button>
      </div>

      {/* ================= 1. NAVBAR SUPERIOR ================= */}
      <header className="w-full max-w-[1024px] mx-auto pt-6 pb-4 px-4 sm:px-8">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo SINATUR */}
          <a href="#inicio" className="flex flex-col items-center sm:items-start group">
            <span className="text-2xl sm:text-[26px] font-bold tracking-wider text-[#4A4A4A] font-serif leading-none">
              SINATUR
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#8C8C8C] tracking-tight mt-0.5">
              Sistema Nacional de Turismo
            </span>
          </a>

          {/* Enlaces Centrales */}
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

          {/* Acciones Derecha: Idioma, Ingresar y Botón Naranja */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Botón cambio de idioma */}
            <button
              onClick={() => setIdioma((prev) => (prev === 'ES' ? 'EN' : 'ES'))}
              title="Cambiar idioma"
              className="flex items-center gap-1 text-[#4A4A4A] hover:text-[#FF7A2F] transition-colors p-1.5 rounded-lg border border-gray-300/80 bg-white/70"
            >
              <Languages className="w-4 h-4" />
              <span className="text-[11px] font-bold">{idioma}</span>
            </button>

            {/* Botón Ingresar */}
            <button
              onClick={() => setModalAbierto('login')}
              className="flex items-center gap-1.5 text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors text-xs sm:text-sm font-medium"
            >
              <div className="w-7 h-7 rounded-full bg-[#8C8C8C]/20 flex items-center justify-center text-[#7A7A7A]">
                <User className="w-4 h-4 fill-current" />
              </div>
              <span>Ingresar</span>
            </button>

            {/* Botón Naranja "Publícate con nosotros" */}
            <button
              onClick={() => setModalAbierto('publicate')}
              className="bg-[#FF7A2F] hover:bg-[#e8661c] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Publícate con nosotros
            </button>
          </div>
        </nav>
      </header>

      {/* ================= 2. SECCIÓN PRÓXIMOS EVENTOS ================= */}
      <section className="w-full max-w-[960px] mx-auto mt-6 px-4 sm:px-6">
        <h2 className="text-base sm:text-lg font-bold text-[#2D2D2D] mb-3 px-1">
          Próximos eventos
        </h2>

        {/* Contenedor Carrusel Gris Claro (#E2E2E2) */}
        <div className="relative w-full h-[210px] sm:h-[260px] bg-[#E2E2E2] rounded-[22px] flex items-center justify-between px-3 sm:px-5 overflow-hidden shadow-xs">
          {!modoWireframe && (
            <>
              <img
                src={eventoActual.imagen}
                alt={eventoActual.titulo}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
              <div className="relative z-10 max-w-xl px-8 sm:px-12 text-white">
                <span className="inline-flex items-center gap-1.5 bg-[#FF7A2F] text-white text-xs font-semibold px-3 py-1 rounded-full mb-2.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {eventoActual.fecha} • {eventoActual.departamento}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 leading-snug">
                  {eventoActual.titulo}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 line-clamp-2">
                  {eventoActual.descripcion}
                </p>
              </div>
            </>
          )}

          {/* Flecha Izquierda */}
          <button
            onClick={prevEvento}
            aria-label="Evento anterior"
            className="relative z-10 text-white hover:scale-110 transition-transform p-1.5"
          >
            <ChevronLeft className="w-7 h-7 stroke-[1.8]" />
          </button>

          {/* Flecha Derecha */}
          <button
            onClick={nextEvento}
            aria-label="Siguiente evento"
            className="relative z-10 text-white hover:scale-110 transition-transform p-1.5"
          >
            <ChevronRight className="w-7 h-7 stroke-[1.8]" />
          </button>
        </div>
      </section>

      {/* ================= 3. SECCIÓN CATEGORÍAS ("¿A dónde deseas ir hoy?") ================= */}
      <section className="w-full max-w-[960px] mx-auto mt-10 px-4 sm:px-6 text-center">
        <h2 className="text-base sm:text-lg font-medium text-[#6B6B6B] mb-7">
          ¿A dónde deseas ir hoy?
        </h2>

        {/* Fila de 6 botones cuadrados con borde naranja */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 sm:gap-6 max-w-[850px] mx-auto justify-items-center">
          {CATEGORIAS_BOTONES.map((cat) => {
            const IconComponent = cat.icon;
            const activo = categoriaActiva === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => irACategoria(cat.id)}
                className="group flex flex-col items-center focus:outline-none cursor-pointer"
              >
                <div
                  className={`w-[100px] h-[100px] sm:w-[108px] sm:h-[108px] rounded-[22px] bg-white flex items-center justify-center border-[2.5px] transition-all duration-200 ${
                    activo
                      ? 'border-[#FF7A2F] bg-[#FFF5EF] text-[#FF7A2F] scale-105 shadow-[0_0_16px_rgba(255,122,47,0.45)]'
                      : 'border-[#FF8A47] text-[#FF8A47] shadow-[0_2px_12px_rgba(255,122,47,0.28)] group-hover:scale-105 group-hover:shadow-[0_4px_16px_rgba(255,122,47,0.4)]'
                  }`}
                >
                  <IconComponent className="w-11 h-11 stroke-[1.8]" />
                </div>
                <span className="mt-2.5 text-xs sm:text-[13px] font-bold text-[#7A7A7A] group-hover:text-[#FF7A2F] transition-colors">
                  {cat.nombre}
                </span>
              </button>
            );
          })}
        </div>

        {/* Barra de Búsqueda Redondeada */}
        <div className="max-w-[540px] mx-auto mt-8">
          <div className="relative flex items-center bg-white rounded-full border border-gray-200/90 shadow-xs px-4 py-2.5 focus-within:border-[#FF7A2F] focus-within:ring-2 focus-within:ring-[#FF7A2F]/20 transition-all">
            <Search className="w-4 h-4 text-[#FF7A2F] mr-3 shrink-0" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="¿Sabes dónde deseas ir?"
              className="w-full bg-transparent text-xs sm:text-sm text-gray-700 placeholder-[#A6A6A6] focus:outline-none"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= 4. SECCIÓN DE RECOMENDACIONES ================= */}
      <section className="w-full max-w-[960px] mx-auto mt-12 px-4 sm:px-6">
        {/* Encabezado de dos líneas */}
        <div className="text-center mb-8">
          <h2 className="text-base sm:text-lg font-medium text-[#6B6B6B]">
            ¿Quieres una recomendación?
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#6B6B6B] mt-0.5">
            Echa un vistazo
          </p>
        </div>

        {/* Bloques verticales de categorías: Hospedajes, Restaurantes, Bares, Discotecas, Cafetería */}
        {seccionesFiltradas.map((seccion) => (
          <BloqueRecomendacion
            key={seccion.id}
            seccion={seccion}
            modoWireframe={modoWireframe}
          />
        ))}
      </section>

      {/* ================= MODAL INTERACTIVO PARA INGRESAR / PUBLICARSE ================= */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl relative">
            <button
              onClick={() => setModalAbierto(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {modalAbierto === 'login' ? (
              <div>
                <h3 className="text-xl font-bold text-[#2D2D2D] mb-1">Iniciar Sesión en SINATUR</h3>
                <p className="text-xs text-gray-500 mb-5">
                  Ingresa con tu cuenta de turista o propietario de negocio.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setModalAbierto(null);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="usuario@ejemplo.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF7A2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF7A2F]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#FF7A2F] hover:bg-[#e8661c] text-white font-semibold py-2.5 rounded-full text-sm transition-colors"
                  >
                    Ingresar
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-[#2D2D2D] mb-1">Publícate con nosotros</h3>
                <p className="text-xs text-gray-500 mb-5">
                  Registra tu local comercial o complejo turístico en el Sistema Nacional de Turismo.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setModalAbierto(null);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Nombre del Negocio
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Hotel Colonial Granada"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF7A2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Código RUC
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="J0310000000000"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF7A2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Categoría
                    </label>
                    <select className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF7A2F]">
                      <option>Hospedajes</option>
                      <option>Restaurantes</option>
                      <option>Bares</option>
                      <option>Discotecas</option>
                      <option>Cafeterías</option>
                      <option>Transporte</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#8B9883] hover:bg-[#788570] text-white font-semibold py-2.5 rounded-full text-sm transition-colors mt-2"
                  >
                    Enviar solicitud de registro
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}