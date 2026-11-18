import { request } from './httpClient.js'
export const getEventos = (signal) => request('/eventos_nacionales', { signal })
export const getAdmins = (token, signal) => request('/administradores', { token, signal })
export const createAdmin = (token, body) => request('/administradores/cuentas', { token, method: 'POST', body: JSON.stringify(body) })
export const createEvento = (token, body) => request('/eventos_nacionales', { token, method: 'POST', body: JSON.stringify(body) })
export const updateEvento = (token, id, body) => request(`/eventos_nacionales/${id}`, { token, method: 'PATCH', body: JSON.stringify(body) })
export const deleteEvento = (token, id) => request(`/eventos_nacionales/${id}`, { token, method: 'DELETE' })
