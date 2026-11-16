import { request } from './httpClient.js'

export function getManagedEstablishments(token, signal) {
  return request('/gestion-establecimientos', { token, signal })
}

export function getMenuCategories(signal) {
  return request('/menu-categories', { signal })
}

export function saveManagedEstablishment(token, id, data) {
  return request(`/gestion-establecimientos/${id}`, {
    method: 'PUT', token, body: JSON.stringify(data),
  })
}
