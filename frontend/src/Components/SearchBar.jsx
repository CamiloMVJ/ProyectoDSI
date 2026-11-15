import { ArrowRight, Search, MapPin } from "lucide-react";
import DepartmentDropdown from './DepartmentDropdown.jsx';
const SearchBar = ({
  value = '',
  selectedDepartment = '',
  departments = [],
  onChange,
  onDepartmentChange,
  onSearchSubmit,
  placeholder = 'Lugar, actividad o experiencia...'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit({ query: value, department: selectedDepartment });
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-5xl px-6 sm:px-10">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex flex-col gap-2 rounded-[28px] border border-[#d8e1d5] bg-[#fffefa] p-2.5 shadow-[0_14px_40px_-20px_rgba(38,63,50,0.35)] md:flex-row md:items-stretch md:p-3"
      >
        <div className="flex min-h-17 min-w-0 flex-1 items-center gap-3 rounded-[20px] border border-transparent bg-[#f4f7f1] px-4 transition-colors focus-within:border-[#c45111] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#c45111]/10">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e6] text-[#c45111]"><Search size={20} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <label htmlFor="home-destination" className="block text-[11px] font-bold uppercase tracking-[.12em] text-[#344e3b]">Busca tu destino</label>
            <input
              id="home-destination"
              type="search"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              className="home-search-control mt-0.5 w-full min-w-0 bg-transparent text-sm text-[#25382e] placeholder:text-[#718071]"
            />
          </div>
        </div>

        <div className="flex min-h-17 items-center gap-3 rounded-[20px] border border-transparent bg-[#f4f7f1] px-4 transition-colors focus-within:border-[#c45111] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#c45111]/10 md:w-56">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e7eee4] text-[#344e3b]"><MapPin size={19} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <label htmlFor="home-department" className="block text-[11px] font-bold uppercase tracking-[.12em] text-[#344e3b]">Departamento</label>
            <DepartmentDropdown id="home-department" value={selectedDepartment} departments={departments} onChange={onDepartmentChange} variant="home" />
          </div>
        </div>

        <button
          type="submit"
          className="flex min-h-14 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[20px] bg-[#c45111] px-7 text-sm font-bold text-white shadow-[0_8px_18px_-8px_rgba(196,81,17,0.8)] transition-colors hover:bg-[#9d3e0b] md:min-h-17"
        >
          Buscar <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};
export default SearchBar;
