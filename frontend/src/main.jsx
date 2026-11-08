import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Inicio from './Inicio.jsx'
import LoginSINATUR from './login.jsx'
import RegistroNegocioSINATUR from './Inicio.jsx'
import './index.css'
//import App from './App.jsx'
import RegistroNegocioSINATUR from './Registro_Negocio.jsx'
//import App from './App.jsx'
import App from './Inicio.jsx'

//* *//
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//* *//

const router = createBrowserRouter([
  { path: '/', element: <Home />, errorElement: <ErrorBoundary /> },
  { path: '/registro-negocio', element: <RegistroNegocioSINATUR /> },
  
])
import App from './Inicio.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
