import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import '../css/favorites.css'

export default function FavoriteButton({ name, saved, pending, onToggle, className = '' }) {
  const [animation, setAnimation] = useState('')
  const [optimisticSaved, setOptimisticSaved] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const mounted = useRef(true)
  const animationTimer = useRef(null)
  const visualSaved = optimisticSaved ?? saved

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; clearTimeout(animationTimer.current) }
  }, [])

  function animate(type, duration) {
    clearTimeout(animationTimer.current)
    setAnimation(type)
    animationTimer.current = setTimeout(() => { if (mounted.current) setAnimation('') }, duration)
  }

  async function handleClick() {
    if (pending || waiting) return
    setWaiting(true)
    setOptimisticSaved(!saved)
    animate(saved ? 'removing' : 'added', saved ? 280 : 600)
    if (saved && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await new Promise(resolve => setTimeout(resolve, 280))
      if (!mounted.current) return
    }
    try {
      const success = await onToggle()
      if (!mounted.current) return
      setOptimisticSaved(null)
      if (!success) animate('rollback', 350)
    } catch {
      if (mounted.current) { setOptimisticSaved(null); animate('rollback', 350) }
    } finally {
      if (mounted.current) setWaiting(false)
    }
  }

  return <button type="button" onClick={handleClick} disabled={pending || waiting} aria-label={visualSaved ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`} aria-pressed={visualSaved} className={`favorite-button absolute right-3 top-3 flex size-11 items-center justify-center rounded-full shadow-sm disabled:cursor-default ${visualSaved ? 'bg-[#c45111] text-white' : 'bg-white text-[#526554] hover:text-[#c45111]'} ${animation ? `favorite-button--${animation}` : ''} ${className}`}>
    <Heart size={19} className={`favorite-button__heart ${visualSaved ? 'fill-current' : ''}`} aria-hidden="true" />
  </button>
}
