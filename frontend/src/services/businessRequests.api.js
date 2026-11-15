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
