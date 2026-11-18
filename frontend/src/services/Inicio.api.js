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
  if (Array.isArray(res?.eventos)) return res.eventos
  if (Array.isArray(res?.rows)) return res.rows
  return []
}

function formatearEventos([eventos, departamentos]) {
  const mapaDepartamentos = new Map(
    departamentos.map((dep) => [Number(dep.id_departamento), dep.nombre])
  )

  return eventos
    .filter((ev) => ev.estado !== 'Cancelado')
    .map((ev) => ({
      ...ev,
      departamento:
        ev.departamento ||
        mapaDepartamentos.get(Number(ev.id_departamento)) ||
        null,
      es_gratuito: Boolean(ev.es_gratuito),
      es_anual_recurrente: Boolean(ev.es_anual_recurrente),
      costo_entrada: ev.costo_entrada != null ? Number(ev.costo_entrada) : null,
    }))
    .sort((a, b) => {
      const timeA = a.fecha_inicio
        ? new Date(`${String(a.fecha_inicio).split('T')[0]}T00:00:00`).getTime()
        : Infinity
      const timeB = b.fecha_inicio
        ? new Date(`${String(b.fecha_inicio).split('T')[0]}T00:00:00`).getTime()
        : Infinity
      return timeA - timeB
    })
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

    const listaImagenes = [
      ...(Array.isArray(local.imagenes) ? local.imagenes : []),
      local.url_imagen,
    ].filter(Boolean)

    const localFormateado = {
      ...local,
      maps_link:
        typeof local.maps_link === 'string'
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
      return (
        Number(b.promedio_calificacion ?? b.puntuacion ?? 0) -
        Number(a.promedio_calificacion ?? a.puntuacion ?? 0)
      )
    })
  }

  return secciones
}

export function getEventosNacionales(signal) {
  return Promise.all([
    request('/eventos_nacionales', { signal }).then(extractArray),
    request('/departamentos', { signal }).then(extractArray).catch(() => []),
  ]).then(formatearEventos)
}

export function getRecomendacionesInicio(signal) {
  return request('/locales_comerciales', { signal })
    .then(extractArray)
    .then(agruparPorCategoria)
}