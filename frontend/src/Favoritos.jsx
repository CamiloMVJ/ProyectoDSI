
import './App.css';
import React, { useState } from "react";
import {
  Heart,
  Search,
  MapPin,
  Trash2,
  Building2,
  Landmark,
  ArrowLeft,
  SlidersHorizontal,
  Languages,
  Sparkles,
  Compass,
  Leaf,
} from "lucide-react";

// Arreglo inicial vacío para cargar datos desde la BD
const favoritosIniciales = [];

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
    <div className="min-h-screen bg-[#f3f7f1] text-[#263c30] overflow-hidden">

      {/* Fondo decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-[#d1e6d2] opacity-70 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-96 h-96 rounded-full bg-[#ffe2c9] opacity-50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-[#e4eedf] opacity-40 blur-3xl" />
      </div>

      <div className="relative z-10">

        {/* ENCABEZADO ORIGINAL - NO MODIFICAR */}
        <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-gray-200/60 transition-all">
          <nav className="max-w-7xl mx-auto py-4 px-6 sm:px-10 flex flex-wrap items-center justify-between gap-4">
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

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#526554]" lang="es">
                <Languages aria-hidden="true" className="w-4 h-4" /> Español
              </span>

              <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs sm:text-sm font-bold text-[#294536]">Mi Perfil</p>
                  <p className="text-[10px] sm:text-xs text-[#718476]">Turista registrado</p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#294536] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  T
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main className="max-w-7xl mx-auto px-6 py-10 sm:py-12">

          {/* Regresar */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-semibold text-[#55705d] hover:text-[#ff7a18] transition mb-8 group"
          >
            <span className="w-9 h-9 rounded-full bg-white border border-[#dce8dc] shadow-sm flex items-center justify-center group-hover:bg-[#ff7a18] group-hover:text-white group-hover:border-[#ff7a18] transition">
              <ArrowLeft size={17} />
            </span>
            Regresar al perfil
          </button>

          {/* TÍTULO DESTACADO */}
          <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#294536] via-[#365d43] to-[#527b59] p-7 sm:p-10 mb-9 shadow-xl shadow-[#294536]/15">

            {/* Decoración */}
            <div className="absolute -right-10 -top-20 w-72 h-72 rounded-full border-[35px] border-white/5" />
            <div className="absolute right-36 -bottom-28 w-64 h-64 rounded-full bg-[#ff7a18]/20 blur-3xl" />
            <div className="absolute right-8 bottom-5 opacity-10">
              <Heart size={170} />
            </div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white rounded-full px-4 py-2 text-xs font-semibold tracking-wide mb-5 backdrop-blur-sm">
                <Sparkles size={14} className="text-[#ffb36f]" />
                MI ESPACIO PERSONAL
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#ff7a18] flex items-center justify-center shadow-lg shadow-black/15 rotate-[-4deg]">
                  <Heart size={32} fill="white" className="text-white" />
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  Mis lugares favoritos
                </h2>
              </div>

              <p className="text-green-50/90 text-sm sm:text-base leading-relaxed max-w-xl">
                Tus destinos especiales siempre a tu alcance. Guarda los
                atractivos turísticos y negocios que más te gustan y
                encuéntralos fácilmente cuando quieras.
              </p>

              <div className="flex items-center gap-2 mt-6 text-[#ffd1ac] text-sm font-semibold">
                <Compass size={18} />
                Descubre, guarda y disfruta Nicaragua.
              </div>
            </div>
          </section>

          {/* RESUMEN */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-9">

            {/* Total */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-[#e2eadf] shadow-sm hover:shadow-lg transition">
              <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-[#dcebdc] opacity-60" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#788b7c]">
                    Total de favoritos
                  </p>
                  <p className="text-4xl font-extrabold text-[#294536] mt-2">
                    {favoritos.length}
                  </p>
                  <p className="text-xs text-[#94a397] mt-1">
                    Lugares guardados
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#e5f0e4] flex items-center justify-center">
                  <Heart size={27} className="text-[#477951]" />
                </div>
              </div>
            </div>

            {/* Atractivos */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-[#f4e4d6] shadow-sm hover:shadow-lg transition">
              <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-[#fff0df] opacity-80" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#a17b5d]">
                    Atractivos turísticos
                  </p>
                  <p className="text-4xl font-extrabold text-[#d56d24] mt-2">
                    {favoritos.filter((l) => l.tipo === "atractivo").length}
                  </p>
                  <p className="text-xs text-[#b69a84] mt-1">
                    Destinos naturales y culturales
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#fff0df] flex items-center justify-center">
                  <Landmark size={27} className="text-[#e98236]" />
                </div>
              </div>
            </div>

            {/* Negocios */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-[#dfe9f0] shadow-sm hover:shadow-lg transition">
              <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-[#e2eff5] opacity-80" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#718a9a]">
                    Negocios guardados
                  </p>
                  <p className="text-4xl font-extrabold text-[#3e708b] mt-2">
                    {favoritos.filter((l) => l.tipo === "negocio").length}
                  </p>
                  <p className="text-xs text-[#8ca2af] mt-1">
                    Establecimientos turísticos
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#e2eff5] flex items-center justify-center">
                  <Building2 size={27} className="text-[#4e819c]" />
                </div>
              </div>
            </div>
          </section>

          {/* BUSCADOR Y FILTROS */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2eadf] shadow-sm mb-8">

            <div className="flex flex-col lg:flex-row gap-5 lg:items-center justify-between">

              <div>
                <h3 className="text-lg font-bold text-[#294536]">
                  Explora tu colección
                </h3>
                <p className="text-xs sm:text-sm text-[#8a9b8d] mt-1">
                  Encuentra rápidamente los lugares que has guardado.
                </p>
              </div>

              <div className="relative flex-1 max-w-xl">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff7a18]"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar por nombre o departamento..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#f7faf6] border border-[#dce8dc] outline-none focus:border-[#ff7a18] focus:ring-4 focus:ring-[#ff7a18]/10 transition text-sm text-[#294536] placeholder:text-[#a3afa5]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-6 pt-5 border-t border-[#edf1eb]">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#718476]">
                <SlidersHorizontal size={18} className="text-[#ff7a18]" />
                Filtrar por:
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: "todos", label: "Todos", icon: Heart },
                  { id: "atractivo", label: "Atractivos", icon: Landmark },
                  { id: "negocio", label: "Negocios", icon: Building2 },
                ].map((opcion) => {
                  const Icon = opcion.icon;

                  return (
                    <button
                      key={opcion.id}
                      onClick={() => setFiltro(opcion.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        filtro === opcion.id
                          ? "bg-[#ff7a18] text-white shadow-lg shadow-[#ff7a18]/25 scale-[1.02]"
                          : "bg-[#f1f6ef] text-[#58705e] border border-[#e1eadf] hover:bg-[#e3eee0] hover:border-[#b9d1b9]"
                      }`}
                    >
                      <Icon size={16} />
                      {opcion.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* RESULTADOS */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#294536]">
                Tus destinos guardados
              </h3>
              <p className="text-xs sm:text-sm text-[#8a9b8d] mt-1">
                {favoritosFiltrados.length} resultado(s) encontrados
              </p>
            </div>
          </div>

          {/* TARJETAS */}
          {favoritosFiltrados.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

              {favoritosFiltrados.map((lugar) => (
                <article
                  key={lugar.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#e2eadf] shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                >

                  {/* Imagen */}
                  <div className="relative h-56 overflow-hidden bg-[#e6eee3]">
                    <img
                      src={lugar.imagen}
                      alt={lugar.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#172e21]/45 via-transparent to-transparent" />

                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#294536] text-xs font-bold px-4 py-2 rounded-full shadow-md">
                      {lugar.categoria}
                    </span>

                    <button
                      onClick={() => eliminarFavorito(lugar.id)}
                      title="Eliminar de favoritos"
                      aria-label={`Eliminar ${lugar.nombre} de favoritos`}
                      className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[#ff7a18] hover:scale-110 transition group/heart"
                    >
                      <Heart
                        size={22}
                        fill="#ff7a18"
                        className="text-[#ff7a18] group-hover/heart:text-white group-hover/heart:fill-white transition"
                      />
                    </button>

                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-xs font-semibold">
                      <MapPin size={15} className="text-[#ffb36f]" />
                      {lugar.departamento}
                    </div>
                  </div>

                  {/* Información */}
                  <div className="p-6">

                    <div className="inline-flex items-center gap-2 text-xs font-bold text-[#64806a] bg-[#edf5eb] px-3 py-1.5 rounded-full mb-4">
                      {lugar.tipo === "atractivo" ? (
                        <Landmark size={14} />
                      ) : (
                        <Building2 size={14} />
                      )}
                      {lugar.tipo === "atractivo"
                        ? "Atractivo turístico"
                        : "Establecimiento turístico"}
                    </div>

                    <h3 className="text-xl font-extrabold text-[#294536] mb-2 group-hover:text-[#d96c20] transition">
                      {lugar.nombre}
                    </h3>

                    <p className="text-sm text-[#829084] leading-relaxed mb-5 min-h-[60px]">
                      {lugar.descripcion}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#edf1eb] pt-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#6c806f]">
                        <span className="w-8 h-8 rounded-full bg-[#fff0e3] flex items-center justify-center">
                          <MapPin size={15} className="text-[#ff7a18]" />
                        </span>
                        {lugar.departamento}
                      </div>

                      <button
                        onClick={() => eliminarFavorito(lugar.id)}
                        className="flex items-center gap-2 text-xs font-bold text-[#b77b57] hover:text-[#ff7a18] bg-[#fff7f1] hover:bg-[#ffead9] px-3 py-2 rounded-lg transition"
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

            /* ESTADO VACÍO */
            <section className="relative overflow-hidden bg-white rounded-[28px] border border-[#e2eadf] shadow-md py-14 px-6 text-center">

              <div className="absolute -top-16 -left-16 w-52 h-52 rounded-full bg-[#dcebdc]/60 blur-2xl" />
              <div className="absolute -bottom-20 -right-16 w-64 h-64 rounded-full bg-[#ffe5d1]/60 blur-2xl" />

              <div className="relative z-10">
                <div className="relative w-28 h-28 rounded-[30px] bg-gradient-to-br from-[#fff0df] to-[#ffdfc2] flex items-center justify-center mx-auto mb-7 rotate-[-5deg] shadow-lg shadow-[#ff7a18]/10">
                  <Heart size={49} className="text-[#ff7a18]" />
                  <span className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-[#527b59] text-white flex items-center justify-center shadow-md rotate-[15deg]">
                    <Sparkles size={17} />
                  </span>
                </div>

                <p className="text-xs font-bold tracking-[3px] text-[#e58a49] mb-3">
                  TU COLECCIÓN PERSONAL
                </p>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#294536] mb-3">
                  {busqueda
                    ? "No encontramos resultados"
                    : "¡Tu próxima aventura comienza aquí!"}
                </h3>

                <p className="text-[#829084] max-w-lg mx-auto leading-relaxed mb-8 text-sm sm:text-base">
                  {busqueda
                    ? "No encontramos lugares que coincidan con tu búsqueda. Intenta con otro nombre o departamento."
                    : "Todavía no tienes lugares favoritos. Explora Nicaragua, descubre destinos increíbles y guarda los que más te gusten."}
                </p>

                <button
                  onClick={() => {
                    setFiltro("todos");
                    setBusqueda("");
                  }}
                  className="inline-flex items-center gap-2 bg-[#ff7a18] hover:bg-[#e9690c] text-white font-bold px-7 py-3.5 rounded-xl transition shadow-lg shadow-[#ff7a18]/25 hover:-translate-y-1"
                >
                  <Compass size={19} />
                  Explorar lugares
                </button>
              </div>
            </section>
          )}

          {/* PIE DE PÁGINA */}
          <footer className="text-center mt-14 pb-7">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-[#ff7a18] rounded-full" />
              <Leaf size={17} className="text-[#527b59]" />
              <span className="w-8 h-[2px] bg-[#ff7a18] rounded-full" />
            </div>
            <p className="text-sm font-semibold text-[#718476]">
              SINATUR · Descubre y disfruta Nicaragua
            </p>
            <p className="text-xs text-[#a0ada2] mt-1">
              Cada lugar tiene una historia que merece ser descubierta.
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}
