// Registrar, listar, editar, borrar y activar mesas (RF-09, RF-10, RF-13)
import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase.js'

const VACIA = { nombre: '', zona: 'salon', capacidad: '', foto_url: '' }

export default function AdminMesas() {
  const [mesas, setMesas] = useState([])
  const [form, setForm] = useState(VACIA)
  const [editando, setEditando] = useState(null)

  async function cargar() {
    const { data } = await supabase.from('mesas').select('*').order('id')
    setMesas(data || [])
  }

  useEffect(() => { cargar() }, [])

  async function guardar(e) {
    e.preventDefault()
    if (form.nombre === '' || Number(form.capacidad) < 1) return alert('Escribe el nombre y la capacidad')
    const datos = { ...form, capacidad: Number(form.capacidad) }
    if (editando) {
      await supabase.from('mesas').update(datos).eq('id', editando)
    } else {
      await supabase.from('mesas').insert({ ...datos, activa: true })
    }
    setForm(VACIA)
    setEditando(null)
    cargar()
  }

  function editar(m) {
    setEditando(m.id)
    setForm({ nombre: m.nombre, zona: m.zona, capacidad: m.capacidad, foto_url: m.foto_url || '' })
  }

  async function borrar(id) {
    if (!window.confirm('¿Borrar esta mesa y sus reservas?')) return
    await supabase.from('mesas').delete().eq('id', id)
    cargar()
  }

  async function cambiarEstado(m) {
    await supabase.from('mesas').update({ activa: !m.activa }).eq('id', m.id)
    cargar()
  }

  return (
    <div>
      <h2>Mesas</h2>

      <form className="formulario" onSubmit={guardar}>
        <input placeholder="Nombre (Mesa 6)" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <select value={form.zona} onChange={(e) => setForm({ ...form, zona: e.target.value })}>
          <option value="salon">Salón</option>
          <option value="terraza">Terraza</option>
        </select>
        <input type="number" placeholder="Capacidad" value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: e.target.value })} />
        <input placeholder="URL de foto (opcional)" value={form.foto_url} onChange={(e) => setForm({ ...form, foto_url: e.target.value })} />
        <button className="btn-principal">{editando ? 'Guardar cambios' : '+ Nueva mesa'}</button>
      </form>

      <div className="tabla-scroll">
        <table>
          <thead>
            <tr><th>Mesa</th><th>Zona</th><th>Capacidad</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {mesas.map((m) => (
              <tr key={m.id}>
                <td>{m.nombre}</td>
                <td>{m.zona}</td>
                <td>{m.capacidad} personas</td>
                <td>
                  <label>
                    <input type="checkbox" checked={m.activa} onChange={() => cambiarEstado(m)} />
                    {m.activa ? ' Activa' : ' Inactiva'}
                  </label>
                </td>
                <td>
                  <button onClick={() => editar(m)}>Editar</button>
                  <button onClick={() => borrar(m.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
