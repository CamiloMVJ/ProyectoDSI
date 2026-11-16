import { pool } from '../db/db.js'

export async function findOwnedPendingRequest(requestId, userId, db = pool) {
  const { rows } = await db.query(
    `SELECT id_solicitud FROM public.solicitudes_registros
     WHERE id_solicitud = $1 AND id_usuario = $2 AND estado = 'Pendiente'`,
    [requestId, userId],
  )
  return rows[0] ?? null
}

export async function findOwnedRequest(requestId, userId, db = pool) {
  const { rows } = await db.query(
    'SELECT id_solicitud FROM public.solicitudes_registros WHERE id_solicitud = $1 AND id_usuario = $2',
    [requestId, userId],
  )
  return rows[0] ?? null
}

export async function findOwnedDocument(requestId, documentId, userId, db = pool) {
  const { rows } = await db.query(
    `SELECT doc.url_archivo
     FROM public.documentos_solicitudes doc
     JOIN public.solicitudes_registros s ON s.id_solicitud = doc.id_solicitud
     WHERE doc.id_solicitud = $1 AND doc.id_documento = $2 AND s.id_usuario = $3`,
    [requestId, documentId, userId],
  )
  return rows[0] ?? null
}

export async function findRequestDocumentForAdmin(requestId, documentId, db = pool) {
  const { rows } = await db.query(
    `SELECT doc.url_archivo, s.id_usuario
     FROM public.documentos_solicitudes doc
     JOIN public.solicitudes_registros s ON s.id_solicitud = doc.id_solicitud
     WHERE doc.id_solicitud = $1 AND doc.id_documento = $2`,
    [requestId, documentId],
  )
  return rows[0] ?? null
}

export async function saveRequestDocument(requestId, userId, fileName, documentType, path, db = pool) {
  const { rows } = await db.query(
    `INSERT INTO public.documentos_solicitudes
      (id_solicitud, nombre_archivo, tipo_documento, url_archivo)
     SELECT id_solicitud, $3, $4, $5
     FROM public.solicitudes_registros
     WHERE id_solicitud = $1 AND id_usuario = $2 AND estado = 'Pendiente'
     RETURNING id_documento`,
    [requestId, userId, fileName, documentType, path],
  )
  return rows[0] ?? null
}
