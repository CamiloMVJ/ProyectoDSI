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