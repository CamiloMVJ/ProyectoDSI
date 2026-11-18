import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, Image as ImageIcon, X } from 'lucide-react'

export default function ProfileImageGallery({ images = [], name }) {
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const expandButtonRef = useRef(null)
  const closeButtonRef = useRef(null)
  const dialogRef = useRef(null)
  const active = images[index]
  const multiple = images.length > 1

  useEffect(() => {
    if (!expanded) return
    const previousOverflow = document.body.style.overflow
    const expandButton = expandButtonRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      if (expandButton?.isConnected) expandButton.focus()
    }
  }, [expanded])

  function move(direction) {
    setIndex(current => (current + direction + images.length) % images.length)
  }

  function handleDialogKeyDown(event) {
    if (event.key === 'Escape') setExpanded(false)
    if (event.key === 'ArrowLeft' && multiple) move(-1)
    if (event.key === 'ArrowRight' && multiple) move(1)
    if (event.key === 'Tab') {
      const buttons = [...dialogRef.current.querySelectorAll('button:not(:disabled)')]
      const first = buttons[0]
      const last = buttons.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  if (!images.length) {
    return <section className="mb-12" aria-label={`Galería de ${name}`}>
      <div className="flex aspect-[16/9] max-h-[500px] items-center justify-center rounded-2xl border border-[#d8e1d5] bg-[#eaf0e7] text-[#526554]">
        <div className="flex flex-col items-center gap-3 px-6 text-center"><ImageIcon size={46} aria-hidden="true" /><p className="font-semibold">Este lugar aún no tiene imágenes.</p></div>
      </div>
    </section>
  }

  return <section className="mb-12" aria-label={`Galería de ${name}`}>
    <div className="relative flex aspect-[16/10] max-h-[520px] items-center justify-center overflow-hidden rounded-2xl bg-[#172b22] shadow-lg sm:aspect-[16/8]">
      <img src={active.url} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[#172b22]/25" aria-hidden="true" />
      <img key={active.url} src={active.url} alt={active.descripcion || `${name}, imagen ${index + 1}`} className="relative h-full w-full object-contain" loading="eager" decoding="async" />
      <span className="absolute left-4 top-4 rounded-full bg-[#172b22]/80 px-3 py-1.5 text-xs font-bold text-white" aria-live="polite">{index + 1} / {images.length}</span>
      {multiple && <>
        <button type="button" onClick={() => move(-1)} aria-label="Imagen anterior" className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#172b22]/80 text-white transition-colors hover:bg-[#172b22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C45111]"><ChevronLeft size={23} aria-hidden="true" /></button>
        <button type="button" onClick={() => move(1)} aria-label="Imagen siguiente" className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#172b22]/80 text-white transition-colors hover:bg-[#172b22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C45111]"><ChevronRight size={23} aria-hidden="true" /></button>
      </>}
      <button ref={expandButtonRef} type="button" onClick={() => setExpanded(true)} className="absolute bottom-4 right-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/95 px-4 text-sm font-bold text-[#263f32] shadow-md transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C45111]" aria-label={`Ampliar imagen ${index + 1} de ${name}`}><Expand size={17} aria-hidden="true" /> Ampliar</button>
    </div>
    <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[#526554]"><p className="min-w-0 truncate">{active.descripcion || `Imagen ${index + 1} de ${name}`}</p>{multiple && <span className="shrink-0 text-xs font-semibold">Selecciona una miniatura</span>}</div>
    {multiple && <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3" role="group" aria-label="Miniaturas de la galería">
      {images.map((image, imageIndex) => <button key={image.id ?? `${image.url}-${imageIndex}`} type="button" onClick={() => setIndex(imageIndex)} aria-label={`Ver imagen ${imageIndex + 1} de ${name}`} aria-pressed={index === imageIndex} className={`relative h-20 w-28 shrink-0 snap-start overflow-hidden rounded-xl transition-opacity sm:h-24 sm:w-36 ${index === imageIndex ? 'opacity-100 shadow-md' : 'opacity-65 hover:opacity-100'} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C45111]`}>
        <img src={image.url} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        {index === imageIndex && <span className="absolute inset-x-3 bottom-1 h-1 rounded-full bg-[#C45111] shadow-sm" aria-hidden="true" />}
      </button>)}
    </div>}
    {expanded && <div ref={dialogRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c1712]/95 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={`Imagen ampliada de ${name}`} onClick={event => { if (event.target === event.currentTarget) setExpanded(false) }} onKeyDown={handleDialogKeyDown}>
      <div className="relative flex h-full w-full max-w-7xl items-center justify-center">
        <img src={active.url} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[#0c1712]/40" aria-hidden="true" />
        <img src={active.url} alt={active.descripcion || `${name}, imagen ${index + 1}`} className="relative max-h-full max-w-full object-contain" />
        <button ref={closeButtonRef} type="button" onClick={() => setExpanded(false)} aria-label="Cerrar imagen ampliada" className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><X size={24} aria-hidden="true" /></button>
        {multiple && <>
          <button type="button" onClick={() => move(-1)} aria-label="Imagen anterior" className="absolute left-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ChevronLeft size={26} aria-hidden="true" /></button>
          <button type="button" onClick={() => move(1)} aria-label="Imagen siguiente" className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ChevronRight size={26} aria-hidden="true" /></button>
        </>}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white">{index + 1} de {images.length}</span>
      </div>
    </div>}
  </section>
}
