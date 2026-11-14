// Grilla de horas: blanco libre, gris ocupado, oscuro seleccionado (RF-04)
import { slotOcupado } from '../services/slots.js'

export default function SlotGrid({ slots, reservas, seleccionado, onElegir }) {
  if (slots.length === 0) {
    return <p className="aviso">Ese día no hay horarios de atención. Elige otra fecha.</p>
  }

  return (
    <div>
      <div className="slots">
        {slots.map((slot) => {
          const ocupado = slotOcupado(slot, reservas)
          let clase = 'slot'
          if (ocupado) clase = 'slot ocupado'
          if (seleccionado && seleccionado.inicio === slot.inicio) clase = 'slot elegido'
          return (
            <button key={slot.inicio} className={clase} onClick={() => onElegir(slot, ocupado)}>
              {slot.inicio}
            </button>
          )
        })}
      </div>
      <p className="leyenda">⬜ Libre · ▒ Ocupado · ⬛ Seleccionado</p>
    </div>
  )
}
