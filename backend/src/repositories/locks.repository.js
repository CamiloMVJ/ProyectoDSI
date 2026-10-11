// Los identificadores vienen exclusivamente de esta lista interna.
const keys = {
  campanias_publicitarias: 'id_campania', categorias: 'id_categoria',
  eventos_nacionales: 'id_evento', lugares_turisticos: 'id_lugar',
  menus: 'id_menu', pagos_publicidad: 'id_pago', resenas: 'id_resena',
  servicios: 'id_servicio', usuarios: 'id_usuario', items_menu: 'id_item',
  administradores: 'id_administrador',
  propietarios_negocios: 'id_propietario',
  turistas: 'id_turista',
  complejos_turisticos: 'id_lugar',
  atractivos_independientes: 'id_lugar',
  locales_comerciales: 'id_local',
  horarios: 'id_horario',
  imagenes_lugares: 'id_imagen',
  favoritos: 'id_favorito',
  solicitudes_registros: 'id_solicitud'
}

export async function lockOne(table, id, client) {
  const key = keys[table]
  if (!key) throw new TypeError('Tabla no permitida para bloqueo')
  const { rows } = await client.query(
    `SELECT ${key} FROM public.${table} WHERE ${key} = $1 FOR UPDATE`, [id]
  )
  return Boolean(rows[0])
}
