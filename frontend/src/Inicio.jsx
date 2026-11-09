import './index.css';
import { useEffect, useState } from 'react';
import Navbar from './Components/Navbar';
import EventCarousel from './Components/EventCarousel';
import SearchBar from './Components/SearchBar';
import RecommendationSection from './Components/RecommendationSection';
import HospedajeIcon from './Components/Icons';
import Footer from './Components/Footer';
import { useNavigate } from 'react-router-dom';
import { Utensils, Martini, Disc, Coffee, Bus } from 'lucide-react';
import { getDepartments } from './services/places.api.js';


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
              className="group flex flex-col items-center focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#c45111] cursor-pointer"
              aria-pressed={isSelected}
            >
              <div className={`category-card ${isSelected ? 'category-card-selected' : 'category-card-default'}`}>
                <Icon className="w-11 h-11 stroke-[1.8]" />
              </div>
              <span
                className={`mt-2.5 text-xs sm:text-[13px] font-bold transition-colors ${isSelected
                  ? 'text-[#c45111]'
                  : 'text-[#526554] group-hover:text-[#c45111]'
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
  const [departments, setDepartments] = useState([]);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    getDepartments(controller.signal)
      .then(setDepartments)
      .catch(error => { if (error.name !== 'AbortError') setDepartments([]); });
    return () => controller.abort();
  }, []);

  const handleSearch = ({ query, department }) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (department) params.set('departamento', department);
    navigate(`/buscar${params.size ? `?${params}` : ''}`);
  };

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
    <div id="inicio" className="w-full min-h-screen bg-[#f6f8f3] text-[#25382e] flex flex-col justify-between">
      <div>
        {/* 1. Barra de Navegación Fija (Glassmorphism) */}
        <Navbar
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
          departments={departments}
          onChange={setSearchQuery}
          onDepartmentChange={setSelectedDepartment}
          onSearchSubmit={handleSearch}
        />

        <EventCarousel />

        {/* 4. Sección de Recomendaciones */}
        <section className="w-full max-w-7xl mx-auto mt-16 px-6 sm:px-10">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c45111] bg-[#c45111]/10 px-3.5 py-1.5 rounded-full">
              Explora Destinos
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#25382e] mt-3">
              ¿Quieres una recomendación?
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#526554] mt-1">
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
