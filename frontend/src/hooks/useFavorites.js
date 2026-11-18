import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from './useAuth.js'
import { addFavorite, getFavorites, removeFavorite } from '../services/favorites.api.js'

export function useFavorites() {
  const { sesion } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(Boolean(sesion))
  const [pendingId, setPendingId] = useState(null)
  const [error, setError] = useState('')
  const inFlight = useRef(false)

  const refresh = useCallback(async (signal) => {
    if (!sesion) { setFavorites([]); setLoading(false); return }
    setLoading(true)
    try {
      const rows = await getFavorites(sesion.token, signal)
      if (!signal?.aborted) { setFavorites(rows); setError('') }
    } catch (cause) {
      if (!signal?.aborted) setError(cause.message)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [sesion])

  useEffect(() => {
    const controller = new AbortController()
    if (sesion) {
      getFavorites(sesion.token, controller.signal)
        .then(rows => { if (!controller.signal.aborted) { setFavorites(rows); setError(''); setLoading(false) } })
        .catch(cause => { if (!controller.signal.aborted) { setError(cause.message); setLoading(false) } })
    }
    return () => controller.abort()
  }, [sesion])

  async function toggle(idLocal, item) {
    if (!sesion || inFlight.current) return false
    inFlight.current = true
    const existing = favorites.find(item => Number(item.id_local) === Number(idLocal))
    setPendingId(idLocal)
    setError('')
    try {
      if (existing) {
        await removeFavorite(sesion.token, existing.id_favorito)
        setFavorites(current => current.filter(favorite => Number(favorite.id_local) !== Number(idLocal)))
      } else {
        const created = await addFavorite(sesion.token, idLocal)
        setFavorites(current => [{ ...item, ...created, id_local: Number(idLocal), tipo: item?.tipo === 'otro' ? 'lugar' : item?.tipo }, ...current])
      }
      return true
    } catch (cause) {
      setError(cause.message)
      return false
    } finally {
      setPendingId(null)
      inFlight.current = false
    }
  }

  return { favorites, loading, pendingId, error, refresh, toggle }
}
