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

export function getClosedDays(token, id, signal, basePath = '/gestion-establecimientos') {
  return request(`${basePath}/${id}/dias-cerrados`, { token, signal })
}

export function getLocalImages(token, id, signal, basePath = '/gestion-establecimientos') {
  return request(`${basePath}/${id}/imagenes`, { token, signal })
}

export function deleteLocalImage(token, id, imageId, basePath = '/gestion-establecimientos') {
  return request(`${basePath}/${id}/imagenes/${imageId}`, {
    method: 'DELETE', token,
  })
}

export function createClosedDay(token, id, data, basePath = '/gestion-establecimientos') {
  return request(`${basePath}/${id}/dias-cerrados`, {
    method: 'POST', token, body: JSON.stringify(data),
  })
}

export function deleteClosedDay(token, id, closureId, basePath = '/gestion-establecimientos') {
  return request(`${basePath}/${id}/dias-cerrados/${closureId}`, {
    method: 'DELETE', token,
  })
}
