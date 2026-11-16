import { request } from './httpClient.js'

async function optionalRecord(path, signal) {
  try {
    return await request(path, { signal })
  } catch (error) {
    if (error.status === 404) return null
    throw error
  }
}

const cordobas = (amount) => `C$ ${Number(amount).toLocaleString('es-NI', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`

export async function getPerfilLugar(id, signal) {
  if (!/^[1-9]\d*$/.test(String(id))) {
    throw new Error('El identificador del lugar no es válido.')
  }

  const [turistico, comercial] = await Promise.all([
    optionalRecord(`/lugares_turisticos/${id}`, signal),
    optionalRecord(`/locales_comerciales/${id}`, signal),
  ])
  if (!turistico && !comercial) {
    throw new Error('No se encontró el lugar solicitado.')
  }

  const [atractivo, complejo, imagenes, horarios, servicios] = await Promise.all([
    turistico ? optionalRecord(`/atractivos_independientes/${id}`, signal) : null,
    turistico ? optionalRecord(`/complejos_turisticos/${id}`, signal) : null,
    request('/imagenes_lugares', { signal }),
    request('/horarios', { signal }),
    request('/servicios', { signal }),
  ])

  const base = comercial ?? turistico
  const galeria = imagenes
    .filter(imagen => Number(imagen.id_local) === Number(id))
    .sort((a, b) => Number(a.id_imagen) - Number(b.id_imagen))
    .map(imagen => imagen.url_imagen)

  const precios = []
  if (comercial?.precio_minimo != null || comercial?.precio_maximo != null) {
    const minimo = comercial.precio_minimo ?? comercial.precio_maximo
    const maximo = comercial.precio_maximo ?? comercial.precio_minimo
    precios.push({
      concepto: 'Rango de precios',
      costo: minimo === maximo ? cordobas(minimo) : `${cordobas(minimo)} – ${cordobas(maximo)}`,
    })
  } else if (complejo?.cobro_entrada && complejo.costo_entrada != null) {
    precios.push({ concepto: 'Entrada', costo: cordobas(complejo.costo_entrada) })
  } else if (complejo && !complejo.cobro_entrada) {
    precios.push({ concepto: 'Entrada', costo: 'Gratis' })
  }

  return {
    ...base,
    categoria: comercial ? 'Local comercial' : atractivo ? 'Atractivo independiente' : complejo ? 'Complejo turístico' : 'Lugar turístico',
    galeria,
    horarios: horarios
      .filter(horario => Number(horario.id_local) === Number(id))
      .sort((a, b) => Number(a.id_horario) - Number(b.id_horario))
      .map(horario => ({
        dia: horario.dia_semana,
        horas: `${String(horario.hora_apertura).slice(0, 5)} – ${String(horario.hora_cierre).slice(0, 5)}`,
      })),
    servicios: servicios
      .filter(servicio => Number(servicio.id_local) === Number(id) && servicio.esta_disponible !== false)
      .map(servicio => servicio.nombre_servicio),
    precios,
    contacto: {
      direccion: [base.direccion_exacta, base.municipio, base.departamento].filter(Boolean).join(', '),
    },
    tipo_acceso: atractivo?.tipo_acceso,
    entidad_encargada: atractivo?.entidad_encargada,
    normativa_visitantes: atractivo?.normativa_visitantes,
  }
import { request } from "./httpClient"


export function getLugarById(id_local, signal) {
  return request(`/locales_comerciales/${id_local}`, {
    method: "GET",
    signal,
  })
}

/**
 * 2. Obtener los menús y sus items (Solo si es un local comercial)
 * (Consulta a las tablas: menus, items_menu)
 */
export function getMenusByLugar(id_local, signal) {
  return request(`/locales_comerciales/${id_local}/menus`, {
    method: "GET",
    signal,
  })
}

/**
 * 3. Obtener las reseñas del lugar
 * (Consulta a la tabla: resenas)
 */
export function getResenasByLugar(id_local, signal) {
  return request(`/locales_comerciales/${id_local}/resenas`, {
    method: "GET",
    signal,
  })
}

/**
 * 4. Publicar una nueva reseña
 */
export function addResena(sesion, id_local, datosResena) {
  return request(`/locales_comerciales/${id_local}/resenas`, {
    method: "POST",
    token: sesion.token,
    body: JSON.stringify(datosResena),
  })
}

/**
 * ==========================================
 * CONSULTAS PARA LUGARES TURÍSTICOS
 * ==========================================
 */

/**
 * 5. Obtener la información del lugar turístico
 * (Consulta a las tablas: lugares_turisticos, complejos_turisticos o atractivos_independientes)
 */
export function getLugarTuristicoById(id_lugar, signal) {
  return request(`/lugares_turisticos/${id_lugar}`, {
    method: "GET",
    signal,
  })
}

/**
 * 6. Obtener las reseñas del lugar turístico
 */
export function getResenasByLugarTuristico(id_lugar, signal) {
  return request(`/lugares_turisticos/${id_lugar}/resenas`, {
    method: "GET",
    signal,
  })
}

/**
 * 7. Publicar una nueva reseña en un lugar turístico
 */
export function addResenaTuristico(sesion, id_lugar, datosResena) {
  return request(`/lugares_turisticos/${id_lugar}/resenas`, {
    method: "POST",
    token: sesion.token,
    body: JSON.stringify(datosResena),
  })
}