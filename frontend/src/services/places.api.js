import { request } from './httpClient.js'

export function getDepartments(signal) {
  return request('/departamentos', { signal })
}

export async function getPlacesCatalog(signal) {
  const [places, departments, images, complexes, attractions] = await Promise.all([
    request('/lugares_turisticos', { signal }),
    getDepartments(signal),
    request('/imagenes_lugares', { signal }),
    request('/complejos_turisticos', { signal }),
    request('/atractivos_independientes', { signal }),
  ])

  const departmentNames = new Map(departments.map(item => [Number(item.id_departamento), item.nombre]))
  const placeImages = new Map()
  images.forEach(image => {
    const id = Number(image.id_lugar)
    if (!placeImages.has(id)) placeImages.set(id, image.url_imagen)
  })
  const complexIds = new Set(complexes.map(item => Number(item.id_lugar)))
  const attractionIds = new Set(attractions.map(item => Number(item.id_lugar)))

  return {
    departments,
    places: places.map(place => ({
      ...place,
      departamento: departmentNames.get(Number(place.id_departamento)) ?? '',
      url_imagen: placeImages.get(Number(place.id_lugar)) ?? null,
      tipo: complexIds.has(Number(place.id_lugar)) ? 'complejo' : attractionIds.has(Number(place.id_lugar)) ? 'atractivo' : 'otro',
    })),
  }
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
    if (order === 'recientes') return Number(b.id_lugar) - Number(a.id_lugar)
    const comparison = String(a.nombre ?? '').localeCompare(String(b.nombre ?? ''), 'es')
    return order === 'nombre-desc' ? -comparison : comparison
  })
}
