import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function GuestOnly({ children }) {
  const { sesion } = useAuth()
  return sesion ? <Navigate to="/account" replace /> : children
}
