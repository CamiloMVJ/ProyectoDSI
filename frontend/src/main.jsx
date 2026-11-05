import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
