// Página principal del cliente
import { useState } from 'react'
import { useDatos } from '../hooks/useDatos.js'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import MesaCard from '../components/MesaCard.jsx'
import Carta from '../components/Carta.jsx'
import ReservaModal from '../components/ReservaModal.jsx'

export default function Cliente() {
  const { mesas, horarios, platos, cargando } = useDatos()
  const [mesaElegida, setMesaElegida] = useState(null)

  return (
    <div>
      <Header />

      <section className="hero" id="inicio">
        <h1>KONYS</h1>
        <p>La pizza más icónica de la ciudad</p>
        <a href="#mesas" className="btn-principal">Reserva tu mesa</a>
      </section>

      <section className="seccion" id="mesas">
        <h2>Nuestras mesas</h2>
        {cargando && <p>Cargando...</p>}
        {!cargando && mesas.length === 0 && <p>No hay mesas registradas.</p>}
        <div className="mesas">
          {mesas.map((m) => (
            <MesaCard key={m.id} mesa={m} onSeleccionar={setMesaElegida} />
          ))}
        </div>
      </section>

      <Carta platos={platos} />
      <Footer />

      {mesaElegida && (
        <ReservaModal mesa={mesaElegida} horarios={horarios} onCerrar={() => setMesaElegida(null)} />
      )}
    </div>
  )
}
