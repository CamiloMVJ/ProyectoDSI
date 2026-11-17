import { AppError } from "../errors/app-error.js"

const knownRoles = new Set(["Usuario", "Propietario", "Administrador"])

// Punto de extensión: cada módulo podrá reemplazar esta política con reglas de propiedad.
// La política de prueba solo da acceso al espacio sandbox del propio usuario.
export function authorizeStorage(user, action, reference, config) {
  const scope = reference?.scope || 'sandbox'
  const allowedRole = scope === 'business-request'
    ? ['Usuario', 'Propietario'].includes(user?.rol)
    : scope === 'local-image'
      ? knownRoles.has(user?.rol)
    : knownRoles.has(config.testRole) && user?.rol === config.testRole
  if (
    !allowedRole ||
    !Number.isSafeInteger(user?.id) ||
    user.id <= 0 ||
    !["authorize", "confirm", "download", "delete"].includes(action) ||
    (scope === 'business-request' && action === 'delete') ||
    (reference &&
      (reference.userId !== user.id || !['sandbox', 'business-request', 'local-image'].includes(reference.scope)))
  ) {
    throw new AppError("No tenés permiso para gestionar este archivo", 403)
  }
}
