import { request } from './httpClient.js'

export function getDepartments(signal) {
  return request('/departamentos', { signal })
}

export function getBusinessCategories(signal) {
  return request('/categorias', { signal })
}

export function getTouristComplexes(signal) {
  return request('/complejos_turisticos', { signal })
}

export function createBusinessRequest(token, data) {
  return request('/solicitudes_registros', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export function getMyBusinessRequests(token, signal) {
  return request('/solicitudes_registros/mias', { token, signal })
}

export function getMyBusinessDocumentUrl(token, requestId, documentId) {
  return request(`/solicitudes_registros/mias/${requestId}/documentos/${documentId}`, { token })
}

export function getAdminBusinessRequests(token, signal) {
  return request('/solicitudes_registros', { token, signal })
}

export function decideBusinessRequest(token, requestId, estado) {
  return request(`/solicitudes_registros/${requestId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ estado }),
  })
}

export function getAdminBusinessDocumentUrl(token, requestId, documentId) {
  return request(`/solicitudes_registros/${requestId}/documentos/${documentId}`, { token })
}
