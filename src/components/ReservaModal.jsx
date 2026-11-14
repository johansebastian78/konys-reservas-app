// Ventana de reserva: fecha, hora, datos y confirmación (RF-02 a RF-06)
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase.js'
import { diaDeLaSemana, generarSlots, slotOcupado, hoy } from '../services/slots.js'
import SlotGrid from './SlotGrid.jsx'

// Busca las reservas que no están canceladas de una mesa en una fecha
async function traerReservas(mesaId, fecha) {
  const { data } = await supabase
    .from('reservas')
    .select('*')
    .eq('mesa_id', mesaId)
    .eq('fecha', fecha)
    .neq('estado', 'cancelada')
  return data || []
}

export default function ReservaModal({ mesa, horarios, onCerrar }) {
  const [fecha, setFecha] = useState(hoy())
  const [reservas, setReservas] = useState([])
  const [slot, setSlot] = useState(null)
  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [personas, setPersonas] = useState('')
  const [error, setError] = useState('')
  const [confirmada, setConfirmada] = useState(null)

  // Cada vez que cambia la fecha se traen las reservas de ese día
  useEffect(() => {
    setSlot(null)
    traerReservas(mesa.id, fecha).then(setReservas)
  }, [fecha, mesa.id])

  const zona = mesa.zona === 'terraza' ? 'Terraza' : 'Salón'

  // Horarios del día elegido y sus slots
  const dia = diaDeLaSemana(fecha)
  const slots = generarSlots(horarios.filter((h) => h.dia_semana === dia))

  function elegirSlot(s, ocupado) {
    if (ocupado) {
      setError('Ese horario ya está ocupado. Elige otro.')
      return
    }
    setError('')
    setSlot(s)
  }

  async function confirmar() {
    // Validaciones del formulario
    if (!slot) return setError('Elige una hora.')
    if (nombre.trim() === '') return setError('Escribe tu nombre.')
    const n = Number(personas)
    if (!n || n < 1) return setError('Escribe el número de personas.')
    if (n > mesa.capacidad) return setError('Esta mesa es máximo para ' + mesa.capacidad + ' personas.')

    const nueva = {
      mesa_id: mesa.id,
      cliente_nombre: nombre.trim(),
      cliente_contacto: contacto.trim(),
      num_personas: n,
      fecha: fecha,
      hora_inicio: slot.inicio,
      hora_fin: slot.fin,
      estado: 'confirmada',
    }
    const { error: err } = await supabase.from('reservas').insert(nueva)
    if (err) return setError('No se pudo guardar la reserva. Intenta de nuevo.')
    setConfirmada(nueva)
  }

  // Pantalla de confirmación (RF-06)
  if (confirmada) {
    return (
      <div className="fondo-modal">
        <div className="modal confirmacion">
          <div className="ok">OK</div>
          <h2>¡Reserva confirmada!</h2>
          <div className="resumen">
            <p>Nombre: {confirmada.cliente_nombre}</p>
            <p>Mesa: {mesa.nombre} ({zona})</p>
            <p>Fecha: {confirmada.fecha}</p>
            <p>Hora: {confirmada.hora_inicio}</p>
            <p>Personas: {confirmada.num_personas}</p>
          </div>
          <button onClick={onCerrar}>Volver al inicio</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fondo-modal">
      <div className="modal">
        <div className="modal-titulo">
          <h2>Reservar · {mesa.nombre} ({zona}, {mesa.capacidad} personas)</h2>
          <button className="cerrar" onClick={onCerrar}>X</button>
        </div>

        <div className="modal-cuerpo">
          <div>
            <h4>1. Elige la fecha</h4>
            <input type="date" value={fecha} min={hoy()} onChange={(e) => setFecha(e.target.value)} />

            <h4>2. Elige la hora</h4>
            <SlotGrid slots={slots} reservas={reservas} seleccionado={slot} onElegir={elegirSlot} />
          </div>

          <div>
            <h4>3. Tus datos</h4>
            <label>Nombre completo</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <label>Teléfono / WhatsApp (opcional)</label>
            <input value={contacto} onChange={(e) => setContacto(e.target.value)} />
            <label>Número de personas</label>
            <input type="number" min="1" max={mesa.capacidad} value={personas} onChange={(e) => setPersonas(e.target.value)} />

            <div className="resumen">
              <strong>Resumen</strong>
              <p>{mesa.nombre} · {fecha} · {slot ? slot.inicio : '--:--'}</p>
            </div>

            {error && <p className="error">{error}</p>}
            <button className="btn-principal" onClick={confirmar}>Confirmar reserva</button>
          </div>
        </div>
      </div>
    </div>
  )
}
