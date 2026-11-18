// Comparar fechas calendario como cadenas ISO para no mover el día por zona horaria.
export const isoDay = (value) => typeof value === 'string' ? value.slice(0, 10) : ''
export function eventsForDay(events, day) {
  return events.filter((event) => {
    const start = isoDay(event.fecha_inicio)
    const end = isoDay(event.fecha_fin)
    if (!start || !end) return false
    if (!event.es_anual_recurrente) return start <= day && day <= end
    // Repetición anual de fechas, inclusive si el rango cruza diciembre/enero.
    const span = Math.round((Date.parse(end + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / 86400000)
    if (span < 0) return false
    const year = Number(day.slice(0, 4))
    for (const y of [year - 1, year]) {
      const base = new Date(`${y}-${start.slice(5)}T00:00:00Z`)
      // 29-feb en años no bisiestos: no se programa automáticamente en 1-mar.
      if (Number.isNaN(base.getTime()) || base.toISOString().slice(5, 10) !== start.slice(5)) continue
      const finish = new Date(base.getTime() + span * 86400000).toISOString().slice(0, 10)
      const beginning = base.toISOString().slice(0, 10)
      if (beginning <= day && day <= finish) return true
    }
    return false
  })
}
export function eventsForMonth(events, year, month) {
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const result = []
  for (let d = 1; d <= days; d++) {
    const date = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    for (const event of eventsForDay(events, date)) if (!result.some(x => x.id_evento === event.id_evento)) result.push(event)
  }
  return result
}
