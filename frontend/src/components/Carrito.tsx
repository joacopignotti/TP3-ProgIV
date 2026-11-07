
import { useState } from "react";
import { useCarrito } from "../context/useCarrito";
import { crearPedido } from "../api/client";

function Carrito() {
  const {
    carrito,
    agregarProducto,
    restarProducto,
    eliminarProducto,
    vaciarCarrito,
  } = useCarrito();

  const [enviando, setEnviando] = useState(false);
  const [errorPedido, setErrorPedido] = useState("");
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);

  const total = carrito.reduce(
    (acumulado, item) =>
      acumulado + item.producto.precio * item.cantidad,
    0
  );

  async function confirmarPedido() {
    if (carrito.length === 0 || enviando) return;

    setEnviando(true);
    setErrorPedido("");
    setPedidoConfirmado(false);

    try {
      await crearPedido({
        items: carrito.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
        })),
        mesaId: null,
      });

      vaciarCarrito();
      setPedidoConfirmado(true);
    } catch (error) {
      setErrorPedido(
        error instanceof Error
          ? error.message
          : "No se pudo confirmar el pedido"
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="carrito">
      <div className="carrito-encabezado">
        <div>
          <span className="subtitulo">TU SELECCIÓN</span>
          <h2>Mi carrito</h2>
        </div>

        <span className="cantidad-items">
          {carrito.reduce(
            (total, item) => total + item.cantidad,
            0
          )} productos
        </span>
      </div>

      {pedidoConfirmado && (
        <p role="status">
          Pedido confirmado correctamente
        </p>
      )}

      {errorPedido && (
        <p role="alert">
          Error al confirmar el pedido: {errorPedido}
        </p>
      )}

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
              <article
                className="item-carrito"
                key={item.producto.id}
              >
                <div className="item-info">
                  <h3>{item.producto.nombre}</h3>
                  <p>
                    ${item.producto.precio.toLocaleString("es-AR")} c/u
                  </p>
                </div>

                <div className="item-acciones">
                  <div className="contador">
                    <button
                      type="button"
                      disabled={enviando}
                      onClick={() =>
                        restarProducto(item.producto.id)
                      }
                      aria-label={`Restar ${item.producto.nombre}`}
                    >
                      −
                    </button>

                    <span>{item.cantidad}</span>

                    <button
                      type="button"
                      disabled={enviando}
                      onClick={() =>
                        agregarProducto(item.producto)
                      }
                      aria-label={`Agregar ${item.producto.nombre}`}
                    >
                      +
                    </button>
                  </div>

                  <strong>
                    ${(item.producto.precio * item.cantidad)
                      .toLocaleString("es-AR")}
                  </strong>

                  <button
                    type="button"
                    className="boton-eliminar"
                    disabled={enviando}
                    onClick={() =>
                      eliminarProducto(item.producto.id)
                    }
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

          <button
            type="button"
            onClick={confirmarPedido}
            disabled={enviando}
          >
            {enviando ? "Confirmando..." : "Confirmar pedido"}
          </button>
        </>
      )}
    </section>
  );
}

export default Carrito;
