import { categoriaSchema } from './categoria.dto.js';
import { usuarioSchema } from './usuario.dto.js';
import { turistaSchema } from './turista.dto.js';
import { propietarioNegocioSchema } from './propietario_negocio.dto.js';
import { administradorSchema } from './administradores.dto.js';
import { lugarSchema } from './lugar.dto.js';
import { imagenLugarSchema } from './imagen_lugar.dto.js';
import { horarioSchema } from './horario.dto.js';
import { resenaSchema } from './resena.dto.js';
import { favoritoSchema } from './favorito.dto.js';
import { complejoTuristicoSchema } from './complejo_turistico.dto.js';
import { atractivoIndependienteSchema } from './atractivos_independientes.dto.js';
import { localComercialSchema } from './local_comercial.dto.js';
import { eventoSchema } from './evento.dto.js';
import { servicioSchema } from './servicio.dto.js';
import { menuSchema } from './menus.dto.js';
import { itemMenuSchema } from './items_Menu.dto.js';
import { solicitudRegistroSchema } from './solicitud_registro.dto.js';
import { campaniaSchema } from './campania.dto.js';
import { pagoSchema } from './pago.dto.js';

export const updateCategoriaSchema = categoriaSchema
    .fork(
        ['nombre', 'descripcion', 'icono_url'],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo de la categoría para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en la categoría.',
        'any.required': 'Debés enviar los datos de la categoría que querés actualizar.'
    });


export const updateUsuarioSchema = usuarioSchema
    .fork(
        ['nombre_completo', 'email', 'password', 'telefono'],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del usuario para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el usuario.',
        'any.required': 'Debés enviar los datos del usuario que querés actualizar.'
    });


export const updateTuristaSchema = turistaSchema
    .fork(
        ['id_usuario', 'pais_origen'],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del turista para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el turista.',
        'any.required': 'Debés enviar los datos del turista que querés actualizar.'
    });


export const updatePropietarioNegocioSchema = propietarioNegocioSchema
    .fork(
        ['id_usuario', 'estado_verificacion'],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del propietario del negocio para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el propietario del negocio.',
        'any.required': 'Debés enviar los datos del propietario del negocio que querés actualizar.'
    });


export const updateAdministradorSchema = administradorSchema
    .fork(
        ['id_usuario', 'rol'],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del administrador para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el administrador.',
        'any.required': 'Debés enviar los datos del administrador que querés actualizar.'
    });


export const updateLugarSchema = lugarSchema
    .fork(
        [
            'nombre',
            'descripcion',
            'departamento',
            'municipio',
            'direccion_exacta',
            'maps_link'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del lugar turístico para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el lugar turístico.',
        'any.required': 'Debés enviar los datos del lugar turístico que querés actualizar.'
    });


export const updateImagenLugarSchema = imagenLugarSchema
    .fork(
        ['id_lugar', 'url_imagen', 'descripcion'],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo de la imagen del lugar para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en la imagen del lugar.',
        'any.required': 'Debés enviar los datos de la imagen del lugar que querés actualizar.'
    });


export const updateHorarioSchema = horarioSchema
    .fork(
        [
            'id_lugar',
            'dia_semama',
            'hora_apertura',
            'hora_cierre',
            'es_feriado'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del horario para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el horario.',
        'any.required': 'Debés enviar los datos del horario que querés actualizar.'
    });


export const updateResenaSchema = resenaSchema
    .fork(
        [
            'id_turista',
            'id_lugar',
            'calificacion',
            'comentario',
            'respuesta_propietario',
            'estado_moderacion'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo de la reseña para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en la reseña.',
        'any.required': 'Debés enviar los datos de la reseña que querés actualizar.'
    });


export const updateFavoritoSchema = favoritoSchema
    .fork(
        ['id_turista', 'id_lugar'],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del favorito para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el favorito.',
        'any.required': 'Debés enviar los datos del favorito que querés actualizar.'
    });


export const updateComplejoTuristicoSchema = complejoTuristicoSchema
    .fork(
        [
            'id_lugar',
            'capacidad_locales',
            'cobro_entrada',
            'id_administrador',
            'costo_entrada'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del complejo turístico para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el complejo turístico.',
        'any.required': 'Debés enviar los datos del complejo turístico que querés actualizar.'
    });


export const updateAtractivoIndependienteSchema = atractivoIndependienteSchema
    .fork(
        [
            'id_lugar',
            'tipo_acceso',
            'entidad_encargada',
            'id_administrador',
            'normativa_visitantes'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del atractivo independiente para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el atractivo independiente.',
        'any.required': 'Debés enviar los datos del atractivo independiente que querés actualizar.'
    });


export const updateLocalComercialSchema = localComercialSchema
    .fork(
        [
            'codigo_ruc',
            'id_dueno',
            'id_complejo_padre',
            'es_independiente',
            'precio_minimo',
            'precio_maximo',
            'id_categoria'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del local comercial para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el local comercial.',
        'any.required': 'Debés enviar los datos del local comercial que querés actualizar.'
    });


export const updateEventoSchema = eventoSchema
    .fork(
        [
            'titulo',
            'descripcion',
            'fecha_inicio',
            'fecha_fin',
            'hora_inicio',
            'hora_fin',
            'departamento',
            'municipio',
            'direccion_referencia',
            'tipo_evento',
            'costo_entrada',
            'es_gratuito',
            'es_anual_recurrente',
            'id_lugar_asociado',
            'estado'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del evento nacional para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el evento nacional.',
        'any.required': 'Debés enviar los datos del evento nacional que querés actualizar.'
    });


export const updateServicioSchema = servicioSchema
    .fork(
        [
            'id_local',
            'nombre_servicio',
            'descripcion',
            'precio',
            'moneda',
            'tipo_cobro',
            'incluye',
            'duracion_estimada',
            'esta_disponible'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del servicio para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el servicio.',
        'any.required': 'Debés enviar los datos del servicio que querés actualizar.'
    });


export const updateMenuSchema = menuSchema
    .fork(
        [
            'id_local',
            'titulo_menu',
            'descripcion',
            'esta_activo'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del menú para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el menú.',
        'any.required': 'Debés enviar los datos del menú que querés actualizar.'
    });


export const updateItemMenuSchema = itemMenuSchema
    .fork(
        [
            'id_menu',
            'nombre_platillo',
            'descripcion',
            'precio',
            'moneda',
            'url_foto',
            'es_vegetariano',
            'esta_disponible'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del ítem del menú para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el ítem del menú.',
        'any.required': 'Debés enviar los datos del ítem del menú que querés actualizar.'
    });


export const updateSolicitudRegistroSchema = solicitudRegistroSchema
    .fork(
        [
            'id_dueno',
            'id_administrador',
            'documentos_adjuntos',
            'estado',
            'observaciones'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo de la solicitud de registro para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en la solicitud de registro.',
        'any.required': 'Debés enviar los datos de la solicitud de registro que querés actualizar.'
    });


export const updateCampaniaSchema = campaniaSchema
    .fork(
        [
            'id_local',
            'fecha_inicio',
            'fecha_fin',
            'monto_total',
            'moneda',
            'estado'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo de la campaña publicitaria para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en la campaña publicitaria.',
        'any.required': 'Debés enviar los datos de la campaña publicitaria que querés actualizar.'
    });


export const updatePagoSchema = pagoSchema
    .fork(
        [
            'id_campania',
            'id_dueno',
            'id_administrador',
            'monto',
            'moneda',
            'metodo_pago',
            'numero_referencia',
            'comprobante_url',
            'estado_pago'
        ],
        (schema) => schema.optional()
    )
    .prefs({ noDefaults: true })
    .unknown(false)
    .min(1)
    .required()
    .messages({
        'object.min': 'Debés enviar al menos un campo del pago de publicidad para actualizar.',
        'object.unknown': 'El campo "{{#label}}" no está permitido en el pago de publicidad.',
        'any.required': 'Debés enviar los datos del pago de publicidad que querés actualizar.'
    });