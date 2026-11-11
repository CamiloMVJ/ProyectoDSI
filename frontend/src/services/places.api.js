import { request } from './httpClient.js'

export function getDepartments(signal) {
  return request('/departamentos', { signal })
}

export function getCategories(signal) {
  return request('/categorias', { signal })
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

function normalize(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim()
}

export function filterPlaces(places, filters) {
  const query = normalize(filters.q)
  const municipality = normalize(filters.municipio)
  const department = String(filters.departamento ?? '')
  const type = filters.tipo ?? 'todos'
  const order = filters.orden ?? 'nombre-asc'

  return places.filter(place => {
    if (department && String(place.id_departamento) !== department) return false
    if (municipality && !normalize(place.municipio).includes(municipality)) return false
    if (type !== 'todos' && place.tipo !== type) return false
    if (!query) return true
    return [place.nombre, place.descripcion, place.municipio, place.departamento, place.direccion_exacta]
      .some(value => normalize(value).includes(query))
  }).sort((a, b) => {
    if (order === 'recientes') return Number(b.id_local ?? b.id_lugar) - Number(a.id_local ?? a.id_lugar)
    const comparison = String(a.nombre ?? '').localeCompare(String(b.nombre ?? ''), 'es')
    return order === 'nombre-desc' ? -comparison : comparison
  })
}
