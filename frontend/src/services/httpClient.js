const API = (import.meta.env?.VITE_API_URL || "/api").replace(/\/$/, "")

export async function request(path, { token, ...options } = {}) {
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
