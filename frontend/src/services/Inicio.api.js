import { request } from './httpClient.js'

const ALIAS_CATEGORIA = {
  '1': 'hospedajes',
  hospedaje: 'hospedajes',
  hospedajes: 'hospedajes',
  '2': 'restaurantes',
  restaurante: 'restaurantes',
  restaurantes: 'restaurantes',
  '3': 'bares',
  bar: 'bares',
  bares: 'bares',
  '4': 'discotecas',
  discoteca: 'discotecas',
  discotecas: 'discotecas',
  '5': 'cafeterias',
  cafeteria: 'cafeterias',
  cafeterias: 'cafeterias',
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()
}

function extractArray(res) {
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.data)) return res.data
  return []
}

function agruparPorCategoria(comerciales) {
  const secciones = {
    hospedajes: [],
    restaurantes: [],
    bares: [],
    discotecas: [],
    cafeterias: [],
  }

  for (const local of comerciales) {
    if (local.esta_publicado === false) continue

    const categorias = Array.isArray(local.categorias) ? local.categorias : []
    if (categorias.length === 0) continue

    // <--- AQUÍ ES DONDE SE ARMA EL ARREGLO COMPLETO DE FOTOS --->
    const listaImagenes = [
      ...(Array.isArray(local.imagenes) ? local.imagenes : []),
      local.url_imagen,
    ].filter(Boolean)

    const localFormateado = {
      ...local,
      maps_link: typeof local.maps_link === 'string'
        ? local.maps_link.replace(/^hhttps:\/\//i, 'https://')
        : null,
      imagenes: [...new Set(listaImagenes)],
    }

    const keys = new Set(
      categorias
        .map((cat) => ALIAS_CATEGORIA[normalize(cat)])
        .filter((key) => key && secciones[key])
    )

    for (const key of keys) {
      secciones[key].push(localFormateado)
    }
  }

  for (const key of Object.keys(secciones)) {
    secciones[key].sort((a, b) => {
      const destDiff = (b.es_destacado ? 1 : 0) - (a.es_destacado ? 1 : 0)
      if (destDiff !== 0) return destDiff
      return Number(b.promedio_calificacion ?? b.puntuacion ?? 0) - Number(a.promedio_calificacion ?? a.puntuacion ?? 0)
    })
  }

  return secciones
}

export function getEventosNacionales(signal) {
  return request('/eventos_nacionales', { signal }).then(extractArray)
}

export function getRecomendacionesInicio(signal) {
  return request('/locales_comerciales', { signal })
    .then(extractArray)
    .then(agruparPorCategoria)
}