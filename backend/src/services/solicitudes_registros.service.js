import * as repository from '../repositories/solicitudes_registros.repository.js'
import * as departamentosRepository from '../repositories/departamentos.repository.js'
import * as complejosRepository from '../repositories/complejos_turisticos.repository.js'
import * as propietariosRepository from '../repositories/propietarios_negocios.repository.js'
import { signedRequestDocument, signedAdminRequestDocument } from '../storage/uploads.service.js'
import { AppError } from '../errors/app-error.js'
import { parseId, allowedData, execute, requireReference, withTransaction } from './service-utils.js'

const fields = ['nombre_negocio', 'razon_social', 'codigo_ruc', 'numero_cedula_solicitante', 'tipo_persona', 'descripcion', 'es_independiente', 'id_complejo_padre', 'municipio', 'direccion_exacta', 'maps_link', 'telefono_contacto', 'correo_contacto', 'sitio_web', 'id_departamento', 'categorias']

export async function findAll() {
  return execute(() => repository.findAll())
}

export async function findMine(idUsuario) {
  idUsuario = parseId(idUsuario)
  return execute(() => repository.findByUser(idUsuario))
}

export async function getMyDocument(user, requestId, documentId) {
  requestId = parseId(requestId)
  documentId = parseId(documentId)
  return execute(() => signedRequestDocument(user, requestId, documentId))
}

export async function getAdminDocument(user, requestId, documentId) {
  requestId = parseId(requestId)
  documentId = parseId(documentId)
  return execute(() => signedAdminRequestDocument(user, requestId, documentId))
}

export async function findOne(id) {
  id = parseId(id)
  return execute(async () => {
    const record = await repository.findOne(id)
    if (!record) throw new AppError('La solicitud no existe', 404)
    return record
  })
}

// El middleware debe validar el DTO de creación antes de llamar a esta función.
export async function create(data, idUsuario) {
  data = allowedData(data, fields)
  idUsuario = parseId(idUsuario)
  return execute(async () => {
    await requireReference(departamentosRepository, data.id_departamento, 'El departamento')
    if (data.es_independiente === false)
      await requireReference(complejosRepository, data.id_complejo_padre, 'El complejo')
    const { categorias = [], ...requestData } = data
    return withTransaction(async (client) => {
      await repository.lockRuc(data.codigo_ruc, client)
      if (await repository.existsApprovedLocalWithRuc(data.codigo_ruc, client))
        throw new AppError('Ya existe un local registrado con este RUC', 409)
      if (await repository.existsPendingWithRuc(data.codigo_ruc, client))
        throw new AppError('Ya existe una solicitud pendiente con este RUC', 409)
      const solicitud = await repository.create({ ...requestData, id_complejo_padre: data.es_independiente === false ? data.id_complejo_padre ?? null : null, id_usuario: idUsuario }, client)
      await repository.addCategories(solicitud.id_solicitud, categorias, client)
      return solicitud
    })
  })
}

export async function update(id, data) {
  id = parseId(id)
  data = allowedData(data, ['estado'])
  return execute(() => withTransaction(async (client) => {
    const { rows } = await client.query(
      'SELECT * FROM public.solicitudes_registros WHERE id_solicitud = $1 FOR UPDATE',
      [id]
    )
    const solicitud = rows[0]
    if (!solicitud) throw new AppError('La solicitud no existe', 404)
    if (solicitud.estado !== 'Pendiente') throw new AppError('Esta solicitud ya fue resuelta', 409)

    if (data.estado === 'Aprobada') {
      await repository.lockRuc(solicitud.codigo_ruc, client)
      if (await repository.existsApprovedLocalWithRuc(solicitud.codigo_ruc, client))
        throw new AppError('Ya existe un local registrado con este RUC', 409)
      await client.query('SELECT id_usuario FROM public.usuarios WHERE id_usuario = $1 FOR UPDATE', [solicitud.id_usuario])
      let propietario = await propietariosRepository.findByUserId(solicitud.id_usuario, client)
      if (!propietario) {
        const owner = await client.query(
          `INSERT INTO public.propietarios_negocios
            (id_usuario, numero_cedula, tipo_persona, estado_verificacion)
           VALUES ($1, $2, $3, 'Verificado') RETURNING id_propietario`,
          [solicitud.id_usuario, solicitud.numero_cedula_solicitante, solicitud.tipo_persona]
        )
        propietario = owner.rows[0]
      }
      const local = await client.query(
        `INSERT INTO public.locales
          (nombre, descripcion, id_departamento, municipio, direccion_exacta,
           maps_link, telefono_contacto, correo_contacto, sitio_web)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_local`,
        [solicitud.nombre_negocio, solicitud.descripcion, solicitud.id_departamento,
          solicitud.municipio, solicitud.direccion_exacta, solicitud.maps_link,
          solicitud.telefono_contacto, solicitud.correo_contacto, solicitud.sitio_web]
      )
      const idLocal = local.rows[0].id_local
      await client.query(
        `INSERT INTO public.locales_comerciales
          (id_local, codigo_ruc, razon_social, id_dueno, es_independiente, id_complejo_padre)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [idLocal, solicitud.codigo_ruc, solicitud.razon_social,
          propietario.id_propietario, solicitud.es_independiente ?? true,
          solicitud.es_independiente === false ? solicitud.id_complejo_padre : null]
      )
      await client.query(
        `INSERT INTO public.locales_categorias (id_local, id_categoria)
         SELECT $1, id_categoria FROM public.solicitudes_categorias WHERE id_solicitud = $2`,
        [idLocal, id]
      )
    }
    return repository.decide(id, data.estado, client)
  }))
}

export async function remove(id) {
  id = parseId(id)
  return execute(async () => {
    const result = await repository.remove(id)
    if (!result) throw new AppError('La solicitud no existe', 404)
    return { mensaje: 'Registro eliminado correctamente', id }
  })
}
