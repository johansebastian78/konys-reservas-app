// Carta digital por categorías, solo lectura (RF-07)
const CATEGORIAS = ['pizzas', 'entradas', 'postres', 'bebidas']

export default function Carta({ platos }) {
  return (
    <section className="seccion" id="carta">
      <h2>Nuestra carta</h2>
      {CATEGORIAS.map((cat) => {
        const lista = platos.filter((p) => p.categoria === cat)
        if (lista.length === 0) return null
        return (
          <div key={cat}>
            <h3 className="categoria">{cat}</h3>
            <div className="platos">
              {lista.map((p) => (
                <div className="plato" key={p.id}>
                  <div>
                    <strong>{p.nombre}</strong>
                    <p>{p.descripcion}</p>
                  </div>
                  <span className="precio">${Number(p.precio).toLocaleString('es-CO')}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
