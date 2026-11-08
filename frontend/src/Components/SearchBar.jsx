import { Search, MapPin } from "lucide-react";
const SearchBar = ({
  value = '',
  selectedDepartment = '',
  departments = [],
  onChange,
  onDepartmentChange,
  onSearchSubmit,
  placeholder = '¿Sabes dónde deseas ir?'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit({ query: value, department: selectedDepartment });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-9 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-full border border-gray-200 shadow-md hover:shadow-lg focus-within:border-[#C45111] focus-within:ring-4 focus-within:ring-[#C45111]/10 pl-5 pr-2 py-2 transition-all"
      >
        <Search className="w-5 h-5 text-[#C45111] mr-3 shrink-0" />
        <input
          type="text"
          aria-label="Buscar destinos o negocios"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs sm:text-sm text-gray-700 placeholder-[#9E9E9E] focus:outline-none"
        />

        {/* Filtro rápido por Departamento (se llena dinámicamente o muestra opción base) */}
        <div className="hidden sm:flex items-center border-l border-gray-200 pl-3 mr-2">
          <MapPin className="w-4 h-4 text-[#526554] mr-1.5 shrink-0" />
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange && onDepartmentChange(e.target.value)}
            aria-label="Filtrar por departamento"
            className="bg-transparent text-xs font-medium text-[#5A5A5A] focus:outline-none cursor-pointer pr-2"
          >
            <option value="">Todo el país</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-[#C45111] hover:bg-[#9d3e0b] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0 cursor-pointer shadow-xs"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};
export default SearchBar;