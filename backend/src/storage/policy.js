import { AppError } from "../errors/app-error.js"

const knownRoles = new Set(["Usuario", "Propietario", "Administrador"])

// Punto de extensión: cada módulo podrá reemplazar esta política con reglas de propiedad.
// La política de prueba solo da acceso al espacio sandbox del propio usuario.
export function authorizeStorage(user, action, reference, config) {
  if (
    !knownRoles.has(config.testRole) ||
    user?.rol !== config.testRole ||
    !Number.isSafeInteger(user?.id) ||
    user.id <= 0 ||
    !["authorize", "confirm", "download", "delete"].includes(action) ||
    (reference &&
      (reference.userId !== user.id || reference.scope !== "sandbox"))
  ) {
    throw new AppError("No tenés permiso para gestionar este archivo", 403)
  }
}
