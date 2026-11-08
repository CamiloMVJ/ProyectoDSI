import './App.css';
import { useState } from 'react';
import   Navbar from './Components/Navbar';
import EventCarousel from './Components/EventCarousel';
import SearchBar from './Components/SearchBar';
import SectionHeaderDecoration from './Components/SectionHeaderDecoration';
import RecommendationSection from './Components/RecommendationSection';
import  HospedajeIcon from './Components/Icons';  
import Footer from './Components/Footer';
import { useNavigate } from 'react-router-dom';
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
  Star,
  Heart,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';


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
    <div id="explorar" className="w-full max-w-7xl mx-auto mt-12 px-6 sm:px-10 text-center scroll-mt-28">
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#344e3b] mb-7">
        {title}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 sm:gap-6 max-w-4xl mx-auto justify-items-center">
        {categories.map(({ id, label, Icon }) => {
          const isSelected = selectedCategory === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(id)}
              className="group flex flex-col items-center focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#C45111] cursor-pointer"
              aria-pressed={isSelected}
            >
              <div
                className={`w-[100px] h-[100px] sm:w-[112px] sm:h-[112px] rounded-[24px] flex items-center justify-center border-[2.5px] transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#C45111] border-[#C45111] text-white scale-105 shadow-[0_8px_20px_rgba(255,122,47,0.4)]'
                    : 'bg-white border-[#C45111] text-[#C45111] shadow-[0_4px_14px_rgba(255,122,47,0.18)] group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(255,122,47,0.3)]'
                }`}
              >
                <Icon className="w-11 h-11 stroke-[1.8]" />
              </div>
              <span
                className={`mt-2.5 text-xs sm:text-[13px] font-bold transition-colors ${
                  isSelected
                    ? 'text-[#C45111]'
                    : 'text-[#6B6B6B] group-hover:text-[#C45111]'
                }`}
              >
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
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [favorites, setFavorites] = useState({});

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const targetElement = document.getElementById(categoryId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFavorite = (sectionId) => {
    setFavorites((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div id="inicio" className="w-full min-h-screen bg-[#f6f8f3] text-[#2D2D2D] flex flex-col justify-between">
      <div>
        {/* 1. Barra de Navegación Fija (Glassmorphism) */}
        <Navbar
          onLoginClick={() => navigate('/ingresar')}
          onPublishClick={() => navigate('/registro-negocio')}
        />

        {/* Explorar primero, luego descubrir eventos y recomendaciones. */}
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        <SearchBar
          value={searchQuery}
          selectedDepartment={selectedDepartment}
          onChange={setSearchQuery}
          onDepartmentChange={setSelectedDepartment}
        />

        <EventCarousel />

        {/* 4. Sección de Recomendaciones */}
        <section className="w-full max-w-7xl mx-auto mt-16 px-6 sm:px-10">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C45111] bg-[#C45111]/10 px-3.5 py-1.5 rounded-full">
              Explora Destinos
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#3A3A3A] mt-3">
              ¿Quieres una recomendación?
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#7A7A7A] mt-1">
              Echa un vistazo a los lugares mejor valorados por categoría
            </p>
          </div>

          <div className="space-y-14">
            {RECOMMENDATION_SECTIONS.map((section) => (
              <RecommendationSection
                key={section.id}
                id={section.id}
                sectionTitle={section.title}
                esFavorito={!!favorites[section.id]}
                onToggleFavorite={() => toggleFavorite(section.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* 5. Pie de Página (Footer) */}
      <Footer />
    </div>
  );
}
