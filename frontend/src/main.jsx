import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Inicio from './Inicio.jsx'
import LoginSINATUR from './login.jsx'
import RegistroNegocioSINATUR from './Registro_Negocio.jsx'
import UserAccount from './Pages/UserAccount.jsx'
import GuestOnly from './Components/GuestOnly.jsx'
import AuthProvider from './context/AuthProvider.jsx'

import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <Inicio /> },
  { path: '/ingresar', element: <GuestOnly><LoginSINATUR /></GuestOnly> },
  { path: '/registro-negocio', element: <RegistroNegocioSINATUR /> },
  { path: '/account', element: <UserAccount /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
