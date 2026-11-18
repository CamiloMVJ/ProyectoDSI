import { useState } from 'react'
import { AuthContext } from './AuthContext.js'
import { delSession, getSession, login } from '../services/userAccount.api.js'

export default function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(getSession)

  async function signIn(credentials) {
    const usuario = await login(credentials)
    setSesion(getSession())
    return usuario
  }

  function signOut() {
    delSession()
    setSesion(null)
  }

  return (
    <AuthContext.Provider value={{ sesion, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
