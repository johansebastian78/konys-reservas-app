// Agregar, editar, ocultar y borrar platos (RF-14)
import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase.js'

const VACIO = { nombre: '', categoria: 'pizzas', descripcion: '', precio: '' }

export default function AdminCarta() {
  const [platos, setPlatos] = useState([])
  const [form, setForm] = useState(VACIO)
  const [editando, setEditando] = useState(null)

  async function cargar() {
    const { data } = await supabase.from('platos').select('*').order('categoria').order('nombre')
    setPlatos(data || [])
  }

  useEffect(() => { cargar() }, [])

  async function guardar(e) {
    e.preventDefault()
    if (form.nombre === '' || form.precio === '') return alert('Escribe el nombre y el precio')
    const datos = { ...form, precio: Number(form.precio) }
    if (editando) {
      await supabase.from('platos').update(datos).eq('id', editando)
    } else {
      await supabase.from('platos').insert({ ...datos, disponible: true })
    }
    setForm(VACIO)
    setEditando(null)
    cargar()
  }

  function editar(p) {
    setEditando(p.id)
    setForm({ nombre: p.nombre, categoria: p.categoria, descripcion: p.descripcion || '', precio: p.precio })
  }

  async function ocultar(p) {
    await supabase.from('platos').update({ disponible: !p.disponible }).eq('id', p.id)
    cargar()
  }

  async function borrar(id) {
    if (!window.confirm('¿Borrar este plato?')) return
    await supabase.from('platos').delete().eq('id', id)
    cargar()
  }

  return (
    <div>
      <h2>Carta</h2>

      <form className="formulario" onSubmit={guardar}>
        <input placeholder="Nombre del plato" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
          <option value="pizzas">pizzas</option>
          <option value="entradas">entradas</option>
          <option value="postres">postres</option>
          <option value="bebidas">bebidas</option>
        </select>
        <input placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
        <input type="number" placeholder="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
        <button className="btn-principal">{editando ? 'Guardar cambios' : '+ Nuevo plato'}</button>
      </form>

      <div className="tabla-scroll">
        <table>
          <thead>
            <tr><th>Plato</th><th>Categoría</th><th>Precio</th><th>Disponible</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {platos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${Number(p.precio).toLocaleString('es-CO')}</td>
                <td>{p.disponible ? 'Sí' : 'Oculto'}</td>
                <td>
                  <button onClick={() => editar(p)}>Editar</button>
                  <button onClick={() => ocultar(p)}>{p.disponible ? 'Ocultar' : 'Mostrar'}</button>
                  <button onClick={() => borrar(p.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
