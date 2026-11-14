// Encabezado con el logo, el menú y el botón de Admin
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="logo">🍕 Konys</div>
      <nav className="menu">
        <a href="#inicio">Inicio</a>
        <a href="#mesas">Mesas</a>
        <a href="#carta">Carta</a>
        <a href="#mesas">Reservar</a>
        <a href="#contacto">Contacto</a>
        <Link to="/admin" className="btn-admin">Admin</Link>
      </nav>
    </header>
  )
}
