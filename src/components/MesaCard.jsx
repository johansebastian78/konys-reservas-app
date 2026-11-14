// Tarjeta de una mesa (RF-01)
export default function MesaCard({ mesa, onSeleccionar }) {
  return (
    <div className={mesa.activa ? 'card' : 'card card-inactiva'}>
      {mesa.foto_url
        ? <img src={mesa.foto_url} alt={mesa.nombre} className="card-foto" />
        : <div className="card-foto sin-foto">🍽️</div>}
      <h3>{mesa.nombre}</h3>
      <p>{mesa.zona === 'terraza' ? 'Terraza' : 'Salón'} · {mesa.capacidad} personas</p>
      <span className={mesa.activa ? 'badge libre' : 'badge ocupada'}>
        {mesa.activa ? 'Disponible' : 'No disponible'}
      </span>
      <button disabled={!mesa.activa} onClick={() => onSeleccionar(mesa)}>
        Ver horarios
      </button>
    </div>
  )
}
