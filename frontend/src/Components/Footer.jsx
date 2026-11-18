import { Link, useLocation } from 'react-router-dom';
import { shouldTransitionPage } from '../services/pageTransitions.js';

const Footer = () => {
  const { pathname } = useLocation();
  return (
    <footer className="mt-24 w-full bg-[#2F362C] text-white">
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
          <Link to="/" viewTransition={shouldTransitionPage(pathname, '/')} className="hover:text-[#C45111] transition-colors">
            Inicio
          </Link>
          <Link to="/buscar" viewTransition={shouldTransitionPage(pathname, '/buscar')} className="hover:text-[#C45111] transition-colors">
            Explorar
          </Link>
        </div>

        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} SINATUR. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
