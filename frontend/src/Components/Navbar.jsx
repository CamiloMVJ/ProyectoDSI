import {
  User,
  Languages,
} from 'lucide-react';

  const Navbar = ({ onLoginClick, onPublishClick }) => {
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
export default Navbar;
