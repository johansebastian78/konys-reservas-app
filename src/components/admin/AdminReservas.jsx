// Ver reservas con filtro por fecha y por mesa (RF-12)
import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase.js'

export default function AdminReservas() {
  const [reservas, setReservas] = useState([])
  const [mesas, setMesas] = useState([])
  const [fecha, setFecha] = useState('')
  const [mesaId, setMesaId] = useState('')

  async function cargar() {
    // Trae las reservas junto con el nombre de la mesa
    let consulta = supabase.from('reservas').select('*, mesas(nombre)').order('fecha').order('hora_inicio')
    if (fecha) consulta = consulta.eq('fecha', fecha)
    if (mesaId) consulta = consulta.eq('mesa_id', mesaId)
    const { data } = await consulta
    setReservas(data || [])
  }

  useEffect(() => {
    supabase.from('mesas').select('id, nombre').order('id').then(({ data }) => setMesas(data || []))
    cargar()
  }, [])

  async function cambiarEstado(id, estado) {
    await supabase.from('reservas').update({ estado }).eq('id', id)
    cargar()
  }

  return (
    <div>
      <h2>Reservas</h2>

      <div className="formulario">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <select value={mesaId} onChange={(e) => setMesaId(e.target.value)}>
          <option value="">Mesa: todas</option>
          {mesas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
        <button className="btn-principal" onClick={cargar}>Filtrar</button>
      </div>

      <div className="tabla-scroll">
        <table>
          <thead>
            <tr><th>Cliente</th><th>Contacto</th><th>Mesa</th><th>Fecha</th><th>Hora</th><th>Pers.</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id}>
                <td>{r.cliente_nombre}</td>
                <td>{r.cliente_contacto}</td>
                <td>{r.mesas ? r.mesas.nombre : ''}</td>
                <td>{r.fecha}</td>
                <td>{r.hora_inicio}</td>
                <td>{r.num_personas}</td>
                <td>
                  <select value={r.estado} onChange={(e) => cambiarEstado(r.id, e.target.value)}>
                    <option value="confirmada">confirmada</option>
                    <option value="cancelada">cancelada</option>
                    <option value="completada">completada</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="leyenda">Mostrando {reservas.length} reservas</p>
    </div>
  )
}
