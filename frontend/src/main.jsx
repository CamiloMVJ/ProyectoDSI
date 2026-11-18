import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Inicio from './Inicio.jsx'
import LoginSINATUR from './login.jsx'
import RegistroNegocioSINATUR from './Registro_Negocio.jsx'
import RegistroUsuarioSINATUR from './Registro_Usuario.jsx'
import UserAccount from './Pages/UserAccount.jsx'
import MyBusinessRequests from './Pages/MyBusinessRequests.jsx'
import AdminBusinessRequests from './Pages/AdminBusinessRequests.jsx'
import GestionEstablecimientosVista from "./Pages/GestionEstablecimientos.jsx";
import SearchResults from './Pages/SearchResults.jsx'
import Favorites from './Pages/Favorites.jsx'
import StorageUploadTest from './Pages/StorageUploadTest.jsx'
import GestionLugares from './Pages/GestionLugares.jsx'
import PerfilLugar from './Pages/PerfilLugar.jsx'
import GuestOnly from './Components/GuestOnly.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import NationalEvents from './Pages/NationalEvents.jsx'
import AdminAccounts from './Pages/AdminAccounts.jsx'

import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <Inicio /> },
  { path: '/buscar', element: <SearchResults /> },
  { path: '/calendario', element: <NationalEvents /> },
  { path: '/admin/eventos', element: <NationalEvents admin /> },
  { path: '/admin/administradores', element: <AdminAccounts /> },
  { path: '/favoritos', element: <Favorites /> },
  { path: '/ingresar', element: <GuestOnly><LoginSINATUR /></GuestOnly> },
  { path: '/registrarse', element: <GuestOnly><RegistroUsuarioSINATUR /></GuestOnly> },
  { path: '/registro-negocio', element: <RegistroNegocioSINATUR /> },
  { path: '/account', element: <UserAccount /> },
  { path: '/mis-solicitudes', element: <MyBusinessRequests /> },
  { path: '/admin/solicitudes', element: <AdminBusinessRequests /> },
  { path: '/probar-subidas', element: <StorageUploadTest /> },
  { path: '/gestion-establecimientos', element: <GestionEstablecimientosVista /> },
  { path: '/gestion-establecimientos/:id/editar', element: <GestionEstablecimientosVista /> },
  { path: '/gestion-lugares', element: <GestionLugares /> },
  { path: '/gestion-lugares/:id/editar', element: <GestionLugares /> },
  { path: '/perfil-lugar/:id', element: <PerfilLugar /> },
  { path: '/perfil-lugar/:id', element: <PerfilLugar /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
