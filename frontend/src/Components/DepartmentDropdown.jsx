import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

export default function DepartmentDropdown({ id, value = '', departments = [], onChange, variant = 'filter' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef([])
  const menuId = useId()
  const options = [{ value: '', label: 'Todo el país' }, ...departments.map(department => ({
    value: String(department.id_departamento),
    label: department.nombre,
  }))]
  const selectedIndex = Math.max(0, options.findIndex(option => option.value === String(value)))

  useEffect(() => {
    if (!isOpen) return
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false)
    }
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) optionRefs.current[focusedIndex]?.focus()
  }, [isOpen, focusedIndex])

  function openMenu(index = selectedIndex) {
    setFocusedIndex(index)
    setIsOpen(true)
  }

  function handleKeyDown(event) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const currentIndex = isOpen ? focusedIndex : selectedIndex
    const nextIndex = event.key === 'Home' ? 0
      : event.key === 'End' ? options.length - 1
        : event.key === 'ArrowDown' ? Math.min(currentIndex + 1, options.length - 1)
          : Math.max(currentIndex - 1, 0)
    openMenu(nextIndex)
  }

  function selectOption(option) {
    onChange?.(option.value)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const isHome = variant === 'home'

  return (
    <div ref={containerRef} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false) }} className={`relative z-20 ${isHome ? 'w-full' : ''}`}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => isOpen ? setIsOpen(false) : openMenu()}
        onKeyDown={handleKeyDown}
        className={isHome
          ? 'home-search-control mt-0.5 flex w-full items-center justify-between gap-2 text-left text-sm text-[#25382e]'
          : `department-dropdown-trigger flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border bg-[#f8faf6] px-4 text-left text-sm text-[#25382e] ${isOpen ? 'border-[#c45111] ring-2 ring-[#c45111]/15' : 'border-[#d8e1d5] hover:border-[#9aaf99]'}`}
      >
        <span className="truncate">{options[selectedIndex].label}</span>
        <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-[#526554] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div
          id={menuId}
          role="listbox"
          aria-label="Departamentos"
          onKeyDown={handleKeyDown}
          className={`absolute right-0 top-full z-50 mt-2 max-h-72 w-full min-w-56 overflow-y-auto rounded-2xl border border-[#d8e1d5] bg-[#fffefa] p-2 shadow-[0_18px_40px_-15px_rgba(38,63,50,0.35)] ${isHome ? 'xl:top-0 xl:right-auto xl:left-full xl:mt-0 xl:ml-3 xl:w-64' : 'lg:top-0 lg:right-auto lg:left-full lg:mt-0 lg:ml-3 lg:w-64'}`}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={element => { optionRefs.current[index] = element }}
              type="button"
              role="option"
              aria-selected={index === selectedIndex}
              tabIndex={-1}
              onClick={() => selectOption(option)}
              className={`department-dropdown-option flex min-h-10 w-full items-center justify-between gap-2 rounded-xl px-3 text-left text-sm transition-colors ${index === selectedIndex ? 'bg-[#eaf0e7] font-semibold text-[#263f32]' : 'text-[#344e3b] hover:bg-[#f4f7f1] focus:bg-[#f4f7f1]'}`}
            >
              <span>{option.label}</span>
              {index === selectedIndex && <Check size={16} aria-hidden="true" className="shrink-0 text-[#c45111]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
