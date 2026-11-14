// Panel de administración en /admin (RF-08)
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminMesas from '../components/admin/AdminMesas.jsx'
import AdminHorarios from '../components/admin/AdminHorarios.jsx'
import AdminReservas from '../components/admin/AdminReservas.jsx'
import AdminCarta from '../components/admin/AdminCarta.jsx'

// Contraseña simple que viene de las variables de entorno
const CLAVE = import.meta.env.VITE_ADMIN_PASSWORD || 'konys2026'

export default function Admin() {
  const [entro, setEntro] = useState(false)
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [seccion, setSeccion] = useState('mesas')

  function ingresar(e) {
    e.preventDefault()
    if (clave === CLAVE) {
      setEntro(true)
      setError('')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  // Pantalla de acceso
  if (!entro) {
    return (
      <div className="login">
        <form className="login-caja" onSubmit={ingresar}>
          <div className="logo">🍕 Konys</div>
          <h2>Panel de administración</h2>
          <label>Contraseña</label>
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
          {error && <p className="error">{error}</p>}
          <button className="btn-principal">Ingresar</button>
          <Link to="/">Volver a la página</Link>
        </form>
      </div>
    )
  }

  return (
    <div className="admin">
      <aside className="lateral">
        <h3>Konys · Admin</h3>
        <button className={seccion === 'mesas' ? 'activo' : ''} onClick={() => setSeccion('mesas')}>Mesas</button>
        <button className={seccion === 'horarios' ? 'activo' : ''} onClick={() => setSeccion('horarios')}>Horarios</button>
        <button className={seccion === 'reservas' ? 'activo' : ''} onClick={() => setSeccion('reservas')}>Reservas</button>
        <button className={seccion === 'carta' ? 'activo' : ''} onClick={() => setSeccion('carta')}>Carta</button>
        <button className="salir" onClick={() => setEntro(false)}>Cerrar sesión</button>
      </aside>

      <main className="contenido">
        {seccion === 'mesas' && <AdminMesas />}
        {seccion === 'horarios' && <AdminHorarios />}
        {seccion === 'reservas' && <AdminReservas />}
        {seccion === 'carta' && <AdminCarta />}
      </main>
    </div>
  )
}
