
import type { Producto } from "../schemas/producto.schema";

type PasteleriaProps = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

export default function Pasteleria({
  productos,
  onAgregar,
}: PasteleriaProps) {
  return (
    <section>
      <h2>Pastelería</h2>

      <div>
        {productos.map((producto) => (
          <article key={producto.id}>
            <h3>{producto.nombre}</h3>

            <p>${producto.precio}</p>

            <button onClick={() => onAgregar(producto)}>
              {producto.nombre.toLowerCase().includes("muffin")
                ? "Agregar muffin"
                : "Agregar selva negra"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}


