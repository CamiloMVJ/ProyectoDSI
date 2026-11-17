import { request } from './httpClient.js';

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim();
}

export function getEventosNacionales(signal) {
  return request('/eventos_nacionales', { signal });
}

export function getCategorias(signal) {
  return request('/categorias', { signal });
}

/**
 * Obtiene los locales comerciales publicados y los agrupa por las categorías de Inicio
 * ('hospedajes', 'restaurantes', 'bares', 'discotecas', 'cafeterias')
 * ordenados por destacados y mejor puntuación.
 */
export async function getRecomendacionesInicio(signal) {
  const locales = await request('/locales_comerciales', { signal });
  const lista = Array.isArray(locales) ? locales : [];

  const secciones = {
    hospedajes: [],
    restaurantes: [],
    bares: [],
    discotecas: [],
    cafeterias: [],
  };

  // Mapea nombres (singular/plural) e IDs de la tabla categorias hacia cada sección
  const aliasCategoria = {
    '1': 'hospedajes',
    hospedaje: 'hospedajes',
    hospedajes: 'hospedajes',
    hotel: 'hospedajes',
    hostal: 'hospedajes',
    '2': 'restaurantes',
    restaurante: 'restaurantes',
    restaurantes: 'restaurantes',
    '3': 'bares',
    bar: 'bares',
    bares: 'bares',
    '4': 'discotecas',
    discoteca: 'discotecas',
    discotecas: 'discotecas',
    '5': 'cafeterias',
    cafeteria: 'cafeterias',
    cafeterias: 'cafeterias',
  };

  for (const local of lista) {
    // Filtrar si viene explícitamente no publicado
    if (local.esta_publicado === false) continue;

    // Extrae todas las categorías asociadas al local (arreglo o campo simple)
    const rawCats = Array.isArray(local.categorias)
      ? local.categorias.map((c) => (typeof c === 'object' ? (c.nombre ?? c.id_categoria) : c))
      : [local.categoria, local.nombre_categoria, local.id_categoria].filter(Boolean);

    const keysAsignadas = new Set();
    for (const raw of rawCats) {
      const key = aliasCategoria[normalize(raw)];
      if (key && secciones[key]) {
        keysAsignadas.add(key);
      }
    }

    for (const key of keysAsignadas) {
      secciones[key].push(local);
    }
  }

  // Ordenar cada categoría: primero destacados, luego mayor calificación
  for (const key of Object.keys(secciones)) {
    secciones[key].sort((a, b) => {
      const destA = a.es_destacado ? 1 : 0;
      const destB = b.es_destacado ? 1 : 0;
      if (destB !== destA) return destB - destA;
      return (
        Number(b.promedio_calificacion ?? b.puntuacion ?? 0) -
        Number(a.promedio_calificacion ?? a.puntuacion ?? 0)
      );
    });
  }

  return secciones;
}