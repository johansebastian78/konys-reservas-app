// Funciones para calcular los horarios (slots) de reserva

// Los días se guardan sin tilde en la base de datos
export const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

// Recibe una fecha '2026-11-15' y devuelve el día, por ejemplo 'domingo'
export function diaDeLaSemana(fecha) {
  const d = new Date(fecha + 'T00:00:00')
  return DIAS[d.getDay()]
}

// '12:30' -> 750 minutos
function aMinutos(hora) {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

// 750 minutos -> '12:30'
function aHora(minutos) {
  const h = String(Math.floor(minutos / 60)).padStart(2, '0')
  const m = String(minutos % 60).padStart(2, '0')
  return h + ':' + m
}

// Con los horarios de un día arma la lista de slots
// Ejemplo 12:30 a 14:30 con 60 minutos da 12:30 y 13:30
export function generarSlots(horariosDelDia) {
  const slots = []
  horariosDelDia.forEach((h) => {
    let inicio = aMinutos(h.hora_inicio)
    const fin = aMinutos(h.hora_fin)
    const duracion = Number(h.duracion_slot)
    while (inicio + duracion <= fin) {
      slots.push({ inicio: aHora(inicio), fin: aHora(inicio + duracion) })
      inicio = inicio + duracion
    }
  })
  return slots.sort((a, b) => a.inicio.localeCompare(b.inicio))
}

// Un slot está ocupado si se cruza con alguna reserva
export function slotOcupado(slot, reservas) {
  return reservas.some((r) => slot.inicio < r.hora_fin && slot.fin > r.hora_inicio)
}

// Fecha de hoy en formato '2026-11-15'
export function hoy() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return d.getFullYear() + '-' + mes + '-' + dia
}
