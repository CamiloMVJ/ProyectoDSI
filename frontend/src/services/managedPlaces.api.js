import { request } from './httpClient.js'

export function getManagedPlaces(token, signal) {
  return request('/gestion-lugares', { token, signal })
}

export function getManagedPlace(token, id, signal) {
  return request(`/gestion-lugares/${id}`, { token, signal })
}

export function getPlaceAdministrators(token, signal) {
  return request('/gestion-lugares/administradores', { token, signal })
}

export function saveManagedPlace(token, id, data) {
  return request(`/gestion-lugares/${id}`, {
    method: 'PUT', token, body: JSON.stringify(data),
  })
}
