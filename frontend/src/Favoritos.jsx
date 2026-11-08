
import React, { useState } from "react";
import {
  Heart,
  Search,
  MapPin,
  Star,
  Trash2,
  Building2,
  Landmark,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";

const favoritosIniciales = [
  {
    id: 1,
    nombre: "Volcán Masaya",
    categoria: "Atractivo turístico",
    departamento: "Masaya",
    descripcion: "Un impresionante volcán activo y uno de los destinos naturales más visitados de Nicaragua.",
    imagen:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900",
    tipo: "atractivo",
  },
  {
    id: 2,
    nombre: "Isla de Ometepe",
    categoria: "Atractivo turístico",
    departamento: "Rivas",
    descripcion: "Una isla rodeada por el lago Cocibolca, reconocida por sus paisajes y naturaleza.",
    imagen:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900",
    tipo: "atractivo",
  },
  {
    id: 3,
    nombre: "Hotel Los Pinos",
    categoria: "Hotel",
    departamento: "Matagalpa",
    descripcion: "Un espacio acogedor para descansar y disfrutar del ambiente natural de la zona.",
    imagen:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900",
    tipo: "negocio",
  },
  {
    id: 4,
    nombre: "Restaurante El Mirador",
    categoria: "Restaurante",
    departamento: "Granada",
    descripcion: "Un lugar para disfrutar de la gastronomía local y una agradable vista.",
    imagen:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900",
    tipo: "negocio",
  },
];

export default function FavoritosSINATUR() {
  const [favoritos, setFavoritos] = useState(favoritosIniciales);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const favoritosFiltrados = favoritos.filter((lugar) => {
    const coincideFiltro =
      filtro === "todos" || lugar.tipo === filtro;

    const coincideBusqueda =
      lugar.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      lugar.departamento.toLowerCase().includes(busqueda.toLowerCase());

    return coincideFiltro && coincideBusqueda;
  });

  const eliminarFavorito = (id) => {
    setFavoritos((actuales) =>
      actuales.filter((lugar) => lugar.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7f3] text-[#263c30]">

      {/* Fondo decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-[#dce9dc] opacity-60 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#e4eee2] opacity-70 blur-3xl" />
      </div>

      <div className="relative z-10">

        {/* Encabezado */}
        <header className="bg-[#294536] text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-wide">
                SINATUR
              </h1>
              <p className="text-xs text-green-100 tracking-widest">
                SISTEMA NACIONAL DE TURISMO
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold">Mi perfil</p>
                <p className="text-xs text-green-100">Usuario registrado</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center border border-white/30">
                <span className="font-bold">U</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-10">

          {/* Regresar */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-[#55705d] hover:text-[#ff7a18] transition mb-7"
          >
            <ArrowLeft size={18} />
            Regresar al perfil
          </button>

          {/* Título */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ff7a18]/10 flex items-center justify-center">
                <Heart size={25} className="text-[#ff7a18]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#718476]">
                  MI ESPACIO PERSONAL
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#294536]">
                  Mis lugares favoritos
                </h2>
              </div>
            </div>

            <p className="text-[#718476] max-w-2xl leading-relaxed">
              Aquí encontrarás todos los atractivos turísticos y negocios
              que has guardado para visitarlos o consultarlos cuando quieras.
            </p>
          </section>

          {/* Resumen */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5ebe4] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#718476]">Lugares guardados</p>
              <p className="text-3xl font-bold text-[#294536]">
                {favoritos.length}
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#718476]">
              <div className="w-10 h-10 rounded-full bg-[#fff0e4] flex items-center justify-center">
                <Heart size={19} className="text-[#ff7a18]" />
              </div>
              Tus destinos seleccionados en un solo lugar.
            </div>
          </section>

          {/* Búsqueda y filtros */}
          <section className="flex flex-col lg:flex-row gap-4 justify-between mb-7">

            <div className="relative flex-1 max-w-xl">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9b8d]"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por nombre o departamento..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-[#dfe8df] outline-none focus:border-[#557d60] focus:ring-2 focus:ring-[#557d60]/10 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal size={18} className="text-[#718476] mr-1" />

              {[
                { id: "todos", label: "Todos" },
                { id: "atractivo", label: "Atractivos" },
                { id: "negocio", label: "Negocios" },
              ].map((opcion) => (
                <button
                  key={opcion.id}
                  onClick={() => setFiltro(opcion.id)}
                  className={`px-5 py-3 rounded-xl text-sm font-semibold transition ${
                    filtro === opcion.id
                      ? "bg-[#294536] text-white shadow-md"
                      : "bg-white text-[#607466] border border-[#dfe8df] hover:border-[#294536]"
                  }`}
                >
                  {opcion.label}
                </button>
              ))}
            </div>
          </section>

          {/* Tarjetas */}
          {favoritosFiltrados.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritosFiltrados.map((lugar) => (
                <article
                  key={lugar.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e4ebe3] shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 group"
                >
                  {/* Imagen */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={lugar.imagen}
                      alt={lugar.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#294536] text-xs font-semibold px-3 py-2 rounded-full">
                      {lugar.categoria}
                    </span>

                    <button
                      onClick={() => eliminarFavorito(lugar.id)}
                      title="Eliminar de favoritos"
                      aria-label={`Eliminar ${lugar.nombre} de favoritos`}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#fff0e4] transition"
                    >
                      <Heart
                        size={21}
                        fill="#ff7a18"
                        className="text-[#ff7a18]"
                      />
                    </button>
                  </div>

                  {/* Información */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[#829486] mb-3">
                      {lugar.tipo === "atractivo" ? (
                        <Landmark size={15} />
                      ) : (
                        <Building2 size={15} />
                      )}
                      {lugar.tipo === "atractivo"
                        ? "Atractivo turístico"
                        : "Establecimiento turístico"}
                    </div>

                    <h3 className="text-xl font-bold text-[#294536] mb-2">
                      {lugar.nombre}
                    </h3>

                    <p className="text-sm text-[#78877c] leading-relaxed mb-4 min-h-[60px]">
                      {lugar.descripcion}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#edf1ec] pt-4">
                      <div className="flex items-center gap-2 text-sm text-[#718476]">
                        <MapPin size={16} className="text-[#ff7a18]" />
                        {lugar.departamento}
                      </div>

                      <button
                        onClick={() => eliminarFavorito(lugar.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#9a6b50] hover:text-[#ff7a18] transition"
                      >
                        <Trash2 size={15} />
                        Quitar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            /* Estado vacío */
            <section className="bg-white rounded-3xl border border-[#e4ebe3] p-12 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-[#fff0e4] flex items-center justify-center mx-auto mb-5">
                <Heart size={36} className="text-[#ff7a18]" />
              </div>

              <h3 className="text-2xl font-bold text-[#294536] mb-2">
                No hay lugares guardados
              </h3>

              <p className="text-[#829486] max-w-md mx-auto mb-6">
                {busqueda
                  ? "No encontramos favoritos que coincidan con tu búsqueda."
                  : "Todavía no has agregado lugares a tu lista de favoritos. Explora Nicaragua y guarda tus destinos preferidos."}
              </p>

              <button
                onClick={() => {
                  setFiltro("todos");
                  setBusqueda("");
                }}
                className="bg-[#ff7a18] hover:bg-[#e9690c] text-white font-semibold px-7 py-3 rounded-xl transition shadow-md"
              >
                Ver todos los favoritos
              </button>
            </section>
          )}

          {/* Pie de página */}
          <footer className="text-center mt-14 pb-5">
            <p className="text-sm text-[#91a094]">
              SINATUR · Descubre y disfruta Nicaragua
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
