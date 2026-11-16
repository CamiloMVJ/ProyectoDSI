import { request } from './httpClient.js'

export function getDepartments(signal) {
  return request('/departamentos', { signal })
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
