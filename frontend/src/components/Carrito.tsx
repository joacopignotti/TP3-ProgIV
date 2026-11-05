
import { useCarrito } from "../context/CarritoContext";

function Carrito() {
  const { carrito, agregarProducto, restarProducto, eliminarProducto } =
    useCarrito();

  const total = carrito.reduce(
    (acumulado, item) =>
      acumulado + item.producto.precio * item.cantidad,
    0
  );

  return (
    <section className="carrito">
      <div className="carrito-encabezado">
        <div>
          <span className="subtitulo">TU SELECCIÓN</span>
          <h2>Mi carrito</h2>
        </div>
        <span className="cantidad-items">
          {carrito.reduce((total, item) => total + item.cantidad, 0)} productos
        </span>
      </div>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <span className="icono-carrito">☕</span>
          <h3>Tu carrito está vacío</h3>
          <p>¡Elegí algo rico de nuestro menú para empezar!</p>
        </div>
      ) : (
        <>
          <div className="lista-carrito">
            {carrito.map((item) => (
              <article className="item-carrito" key={item.producto.id}>
                <div className="item-info">
                  <h3>{item.producto.nombre}</h3>
                  <p>${item.producto.precio.toLocaleString("es-AR")} c/u</p>
                </div>

                <div className="item-acciones">
                  <div className="contador">
                    <button
                      onClick={() => restarProducto(item.producto.id)}
                      aria-label={`Restar ${item.producto.nombre}`}
                    >
                      −
                    </button>

                    <span>{item.cantidad}</span>

                    <button
                      onClick={() => agregarProducto(item.producto)}
                      aria-label={`Agregar ${item.producto.nombre}`}
                    >
                      +
                    </button>
                  </div>

                  <strong>
                    ${(item.producto.precio * item.cantidad).toLocaleString("es-AR")}
                  </strong>

                  <button
                    className="boton-eliminar"
                    onClick={() => eliminarProducto(item.producto.id)}
                    aria-label={`Eliminar ${item.producto.nombre}`}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="carrito-total">
            <span>Total orientativo</span>
            <strong>${total.toLocaleString("es-AR")}</strong>
          </div>
        </>
      )}
    </section>
  );
}

export default Carrito;


