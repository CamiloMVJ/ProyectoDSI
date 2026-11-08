import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getSession,
  delSession,
  getAccount,
  updateAccount,
} from "../services/userAccount.api.js"

export function useCuentaUsuario() {
  const navigate = useNavigate()

  const [sesion] = useState(getSession)
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState("")
  const [aviso, setAviso] = useState("")
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    if (!sesion) return

    const controller = new AbortController()

    obtenerMiCuenta(sesion, controller.signal)
      .then((usuario) => {
        if (!controller.signal.aborted) {
          setUsuario(usuario)
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return

        if ([401, 403].includes(error.status)) {
          eliminarSesion()
          navigate("/ingresar", { replace: true })
        } else {
          setError(error.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCargando(false)
        }
      })

    return () => controller.abort()
  }, [sesion, intento, navigate])

  async function guardar(datos) {
    setGuardando(true)
    setError("")
    setAviso("")

    try {
      const actualizado = await actualizarMiCuenta(sesion, datos)

      setUsuario(actualizado)
      setAviso("Tus cambios se guardaron correctamente.")

      return actualizado
    } catch (error) {
      if ([401, 403].includes(error.status)) {
        eliminarSesion()
        navigate("/ingresar", { replace: true })
      } else {
        setError(error.message)
      }

      return null
    } finally {
      setGuardando(false)
    }
  }

  function cerrarSesion() {
    eliminarSesion()
    navigate("/ingresar", { replace: true })
  }

  function reintentar() {
    setError("")
    setCargando(true)
    setIntento((value) => value + 1)
  }

  function limpiarAviso() {
    setAviso("")
  }

  return {
    sesion,
    usuario,
    cargando,
    guardando,
    error,
    aviso,
    guardar,
    cerrarSesion,
    reintentar,
    limpiarAviso,
  }
}
