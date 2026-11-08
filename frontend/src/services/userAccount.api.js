const API = (import.meta.env?.VITE_API_URL || "/api").replace(/\/$/, "")
const SESSION_KEY = "sinatur.sesion"

function usuarioPublico(usuario) {
  return {
    id_usuario: usuario.id_usuario,
    nombre_completo: usuario.nombre_completo,
    email: usuario.email,
    telefono: usuario.telefono ?? "",
    fecha_registro: usuario.fecha_registro ?? null,
  }
}

export function saveSession({ token, usuario }) {
  if (!token || !Number.isInteger(usuario?.id_usuario)) {
    throw new Error("El servidor no devolvió una sesión válida")
  }

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      token,
      usuario: usuarioPublico(usuario),
    }),
  )
}

export function getSession() {
  try {
    const sesion = JSON.parse(sessionStorage.getItem(SESSION_KEY))

    return sesion?.token && Number.isInteger(sesion.usuario?.id_usuario)
      ? sesion
      : null
  } catch {
    return null
  }
}

export function delSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const body = await response.json().catch(() => null)

  if (!response.ok || body?.success === false) {
    const error = new Error(
      body?.message || body?.mensaje || "No se pudo completar la solicitud",
    )

    error.status = response.status
    throw error
  }

  if (!body?.data) {
    throw new Error("El servidor devolvió una respuesta inesperada")
  }

  return body.data
}

export async function login(credenciales) {
  const sesion = await request("/usuarios/login", {
    method: "POST",
    body: JSON.stringify(credenciales),
  })

  saveSession(sesion)
}

export function getAccount(sesion, signal) {
  return request(`/usuarios/${sesion.usuario.id_usuario}`, {
    token: sesion.token,
    signal,
  })
}

export function updateAccount(sesion, datos) {
  return request(`/usuarios/${sesion.usuario.id_usuario}`, {
    method: "PATCH",
    token: sesion.token,
    body: JSON.stringify(datos),
  })
}
