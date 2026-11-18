import { request } from './httpClient.js'

export function getDepartments(signal) {
  return request('/departamentos', { signal })
}

export function getCategories(signal) {
  return request('/categorias', { signal })
}

export function searchPlaces(params, signal) {
  return request(`/buscar${params.size ? `?${params}` : ''}`, { signal })
}

export async function getPlacesCatalog(signal, maxBudget = '', category = '') {
  const params = new URLSearchParams()
  if (maxBudget !== '') params.set('max_budget', maxBudget)
  if (category !== '') params.set('id_categoria', category)
  const places = await request(`/lugares_turisticos/buscar${params.size ? `?${params}` : ''}`, { signal })
  const departmentNames = new Map(places.map(place => [place.id_departamento, place.departamento]))
  const departments = Array.from(departmentNames, ([id_departamento, nombre]) => ({ id_departamento, nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  return { departments, places }
}

export function getCommercialCatalog(signal, maxBudget = '', category = '') {
  const params = new URLSearchParams()
  if (maxBudget !== '') params.set('max_budget', maxBudget)
  if (category !== '') params.set('id_categoria', category)
  return request(`/locales_comerciales${params.size ? `?${params}` : ''}`, { signal })
}
