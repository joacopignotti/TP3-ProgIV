
import type { Producto } from "../schemas/producto.schema";

type PasteleriaProps = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

export default function Pasteleria({ productos, onAgregar }: PasteleriaProps) {
  return (
    <section className="pasteleria">
      <h2>Pastelería</h2>
      <p className="pasteleria-descripcion">
        Algo dulce para acompañar tu café.
      </p>

      <div className="pasteleria-lista">
        {productos.map((producto) => (
          <article className="pasteleria-producto" key={producto.id}>
            <h3>{producto.nombre}</h3>

            <div className="pasteleria-precio">
              ${producto.precio.toLocaleString("es-AR")}
            </div>

            <button
              type="button"
              onClick={() => onAgregar(producto)}
            >
              Agregar al carrito
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
