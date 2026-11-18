import { request } from './httpClient.js'

export function getFavorites(token, signal) {
  return request('/favoritos', { token, signal })
}

export function addFavorite(token, idLocal) {
  return request('/favoritos', {
    method: 'POST', token, body: JSON.stringify({ id_local: idLocal })
  })
}

export function removeFavorite(token, idFavorito) {
  return request(`/favoritos/${idFavorito}`, { method: 'DELETE', token })
}
