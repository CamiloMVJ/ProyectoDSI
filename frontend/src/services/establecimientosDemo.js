// Almacenamiento local para verificar pantallas SIN backend.
// No almacena contraseñas ni crea usuarios reales.
const VERSION = 'v3'
export const claveEstablecimientos = (idUsuario) =>
  `sinatur.establecimientos.${VERSION}.${idUsuario == null ? 'invitado' : `usuario-${idUsuario}`}`

export const leerEstablecimientos = (idUsuario) => {
  try {
    const datos = JSON.parse(localStorage.getItem(claveEstablecimientos(idUsuario)))
    return Array.isArray(datos) ? datos : []
  } catch { return [] }
}

export const guardarEstablecimientos = (idUsuario, registros) => {
  localStorage.setItem(claveEstablecimientos(idUsuario), JSON.stringify(registros))
  window.dispatchEvent(new Event('sinatur:establecimientos-actualizados'))
}

export const registrarEstablecimientoDemo = (idUsuario, negocio) => {
  const actuales = leerEstablecimientos(idUsuario)
  if (actuales.some(item => item.codigo_ruc.trim().toLowerCase() === negocio.codigo_ruc.trim().toLowerCase())) {
    throw new Error('Ya existe un establecimiento con ese RUC en esta demostración.')
  }
  const nuevo = { ...negocio, id_local: crypto.randomUUID(), servicios: [], horarios: [], imagenes: [], estado: 'Activo' }
  guardarEstablecimientos(idUsuario, [nuevo, ...actuales])
  return nuevo
}
