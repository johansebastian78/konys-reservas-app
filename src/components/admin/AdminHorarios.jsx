// Definir o cambiar el horario de atención por día (RF-11)
import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase.js'
import { DIAS } from '../../services/slots.js'

const NUEVO = { dia_semana: 'lunes', jornada: 'almuerzo', hora_inicio: '12:30', hora_fin: '14:30', duracion_slot: 60 }

export default function AdminHorarios() {
  const [horarios, setHorarios] = useState([])
  const [nuevo, setNuevo] = useState(NUEVO)

  async function cargar() {
    const { data } = await supabase.from('horarios').select('*').order('id')
    setHorarios(data || [])
  }

  useEffect(() => { cargar() }, [])

  // Cambia un campo de una fila solo en pantalla
  function cambiar(id, campo, valor) {
    setHorarios(horarios.map((h) => (h.id === id ? { ...h, [campo]: valor } : h)))
  }

  async function guardar(h) {
    await supabase.from('horarios').update({
      hora_inicio: h.hora_inicio,
      hora_fin: h.hora_fin,
      duracion_slot: Number(h.duracion_slot),
      activo: h.activo,
    }).eq('id', h.id)
    alert('Horario guardado')
    cargar()
  }

  async function agregar(e) {
    e.preventDefault()
    await supabase.from('horarios').insert({ ...nuevo, duracion_slot: Number(nuevo.duracion_slot), activo: true })
    setNuevo(NUEVO)
    cargar()
  }

  async function borrar(id) {
    if (!window.confirm('¿Borrar este horario?')) return
    await supabase.from('horarios').delete().eq('id', id)
    cargar()
  }

  return (
    <div>
      <h2>Horarios</h2>

      <form className="formulario" onSubmit={agregar}>
        <select value={nuevo.dia_semana} onChange={(e) => setNuevo({ ...nuevo, dia_semana: e.target.value })}>
          {DIAS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={nuevo.jornada} onChange={(e) => setNuevo({ ...nuevo, jornada: e.target.value })}>
          <option value="almuerzo">almuerzo</option>
          <option value="noche">noche</option>
        </select>
        <input type="time" value={nuevo.hora_inicio} onChange={(e) => setNuevo({ ...nuevo, hora_inicio: e.target.value })} />
        <input type="time" value={nuevo.hora_fin} onChange={(e) => setNuevo({ ...nuevo, hora_fin: e.target.value })} />
        <input type="number" value={nuevo.duracion_slot} onChange={(e) => setNuevo({ ...nuevo, duracion_slot: e.target.value })} />
        <button className="btn-principal">+ Agregar horario</button>
      </form>

      <div className="tabla-scroll">
        <table>
          <thead>
            <tr><th>Día</th><th>Jornada</th><th>Inicio</th><th>Fin</th><th>Minutos</th><th>Activo</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {horarios.map((h) => (
              <tr key={h.id}>
                <td>{h.dia_semana}</td>
                <td>{h.jornada}</td>
                <td><input type="time" value={h.hora_inicio} onChange={(e) => cambiar(h.id, 'hora_inicio', e.target.value)} /></td>
                <td><input type="time" value={h.hora_fin} onChange={(e) => cambiar(h.id, 'hora_fin', e.target.value)} /></td>
                <td><input type="number" className="corto" value={h.duracion_slot} onChange={(e) => cambiar(h.id, 'duracion_slot', e.target.value)} /></td>
                <td><input type="checkbox" checked={h.activo} onChange={(e) => cambiar(h.id, 'activo', e.target.checked)} /></td>
                <td>
                  <button onClick={() => guardar(h)}>Guardar</button>
                  <button onClick={() => borrar(h.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
