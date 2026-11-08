const Footer = () => {
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

export default Footer;  