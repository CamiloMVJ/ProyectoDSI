import { pool } from '../db/db.js'

export async function findByUser(idUsuario, client = pool) {
  const { rows } = await client.query(`
    SELECT f.id_favorito, f.id_usuario, f.id_local, f.fecha_guardado,
           l.nombre, l.descripcion, l.municipio, l.direccion_exacta, l.maps_link,
           l.id_departamento, d.nombre AS departamento, imagen.url_imagen,
           CASE WHEN c.id_lugar IS NOT NULL THEN 'complejo'
                WHEN a.id_lugar IS NOT NULL THEN 'atractivo'
                WHEN lc.id_local IS NOT NULL THEN 'local'
                ELSE 'lugar' END AS tipo
    FROM public.favoritos AS f
    JOIN public.locales AS l ON l.id_local = f.id_local
    JOIN public.departamentos AS d ON d.id_departamento = l.id_departamento
    LEFT JOIN public.lugares_turisticos AS lt ON lt.id_lugar = l.id_local
    LEFT JOIN public.complejos_turisticos AS c ON c.id_lugar = lt.id_lugar
    LEFT JOIN public.atractivos_independientes AS a ON a.id_lugar = lt.id_lugar
    LEFT JOIN public.locales_comerciales AS lc ON lc.id_local = l.id_local
    LEFT JOIN LATERAL (
      SELECT url_imagen FROM public.imagenes_locales
      WHERE id_local = l.id_local ORDER BY id_imagen LIMIT 1
    ) AS imagen ON TRUE
    WHERE f.id_usuario = $1
    ORDER BY f.fecha_guardado DESC, f.id_favorito DESC`, [idUsuario])
  return rows
}

export async function create(idUsuario, idLocal, client = pool) {
  const { rows } = await client.query(`INSERT INTO public.favoritos (id_usuario, id_local)
    VALUES ($1, $2) RETURNING id_favorito, id_usuario, id_local, fecha_guardado`, [idUsuario, idLocal])
  return rows[0]
}

export async function remove(idFavorito, idUsuario, client = pool) {
  const { rows } = await client.query(`DELETE FROM public.favoritos
    WHERE id_favorito = $1 AND id_usuario = $2 RETURNING id_favorito`, [idFavorito, idUsuario])
  return rows[0] ?? null
}
