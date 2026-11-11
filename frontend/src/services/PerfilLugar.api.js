import { request } from "./httpClient"

// Obtener todos los lugares (útil para la página Explorar o el Inicio)
export function getLugares(filtros = {}, signal) {
  const queryString = new URLSearchParams(filtros).toString()
  const url = queryString ? `/lugares?${queryString}` : '/lugares'

  return request(url, {
    method: "GET",
    signal,
  })
}

// Obtener un solo lugar por su ID (para tu interfaz PerfilLugar)
export function getLugarById(id_lugar, signal) {
  return request(`/lugares/${id_lugar}`, {
    method: "GET",
    signal,
  })
}


