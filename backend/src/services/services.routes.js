import { Router } from 'express'
import { validar } from '../middlewares/validacion.middleware.js'
import { campaniaSchema } from '../dtos/campania.dto.js'
import { categoriaSchema } from '../dtos/categoria.dto.js'
import { eventoSchema } from '../dtos/evento.dto.js'
import { lugarSchema } from '../dtos/lugar.dto.js'
import { itemMenuSchema } from '../dtos/items_Menu.dto.js'
import { pagoSchema } from '../dtos/pago.dto.js'
import { resenaSchema } from '../dtos/resena.dto.js'
import { servicioSchema } from '../dtos/servicio.dto.js'
import { usuarioSchema } from '../dtos/usuario.dto.js'
import { menuSchema } from '../dtos/menus.dto.js'
// import * as updates from '../dtos/update.dto.js'
import * as campanias_publicitarias from './campanias_publicitarias.service.js'
import * as categorias from './categorias.service.js'
import * as eventos_nacionales from './eventos_nacionales.service.js'
import * as lugares_turisticos from './lugares_turisticos.service.js'
import * as menus from './menus.service.js'
import * as pagos_publicidad from './pagos_publicidad.service.js'
import * as resenas from './resenas.service.js'
import * as servicios from './servicios.service.js'
import * as usuarios from './usuarios.service.js'
import * as items_menu from './items_menu.service.js'

const router = Router()

function register(path, service, createSchema, updateSchema) {
  router.get(path, async (req, res) => res.json(await service.findAll()))
  router.get(`${path}/:id`, async (req, res) => res.json(await service.findOne(req.params.id)))
  router.post(path, validar(createSchema), async (req, res) => {
    res.status(201).json(await service.create(req.body))
  })
  router.patch(`${path}/:id`, validar(updateSchema), async (req, res) => {
    res.json(await service.update(req.params.id, req.body))
  })
  router.delete(`${path}/:id`, async (req, res) => {
    res.json(await service.remove(req.params.id))
  })
}

register('/campanias_publicitarias', campanias_publicitarias, campaniaSchema, /*updates.updateCampaniaSchema*/)
register('/categorias', categorias, categoriaSchema, /*updates.updateCategoriaSchema*/)
register('/eventos_nacionales', eventos_nacionales, eventoSchema, /*updates.updateEventoSchema*/)
register('/lugares_turisticos', lugares_turisticos, lugarSchema, /*updates.updateLugarSchema*/)
register('/menus', menus, menuSchema, /*updates.updateMenuSchema*/)
register('/pagos_publicidad', pagos_publicidad, pagoSchema, /*updates.updatePagoSchema*/)
register('/resenas', resenas, resenaSchema, /*updates.updateResenaSchema*/)
register('/servicios', servicios, servicioSchema, /*updates.updateServicioSchema*/)
register('/usuarios', usuarios, usuarioSchema, /*updates.updateUsuarioSchema*/)
register('/items_menu', items_menu, itemMenuSchema, /*updates.updateItemMenuSchema*/)

export default router
