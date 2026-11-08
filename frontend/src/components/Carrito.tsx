import { useState } from "react";
import { useCarrito } from "../context/useCarrito";
import { crearPedido, obtenerPedido } from "../api/client";
import type { Pedido }  from "../schemas/pedido.schema";

type CarritoProps = { mesaId?: number | null };

function Carrito({ mesaId = null }: CarritoProps) {
  const { carrito, agregarProducto, restarProducto, eliminarProducto, vaciarCarrito } = useCarrito();
  const [enviando, setEnviando] = useState(false);
  const [consultando, setConsultando] = useState(false);
  const [errorPedido, setErrorPedido] = useState("");
  const [pedidoConfirmado, setPedidoConfirmado] = useState<Pedido | null>(null);
  const total = carrito.reduce(
    (acumulado, item) => acumulado + item.producto.precio * item.cantidad, 0
  );

  async function confirmarPedido() {
    if (carrito.length === 0 || enviando) return;
    setEnviando(true);
    setErrorPedido("");
    setPedidoConfirmado(null);
    try {
      const pedido = await crearPedido({
        items: carrito.map((item) => ({ productoId: item.producto.id, cantidad: item.cantidad })),
        mesaId,
      });
      setPedidoConfirmado(pedido);
      vaciarCarrito();
    } catch (error) {
      setErrorPedido(error instanceof Error ? error.message : "No se pudo confirmar el pedido");
    } finally {
      setEnviando(false);
    }
  }

  async function consultarEstado() {
    if (!pedidoConfirmado || consultando) return;
    setConsultando(true);
    setErrorPedido("");
    try {
      setPedidoConfirmado(await obtenerPedido(pedidoConfirmado.id));
    } catch (error) {
      setErrorPedido(error instanceof Error ? error.message : "No se pudo consultar el pedido");
    } finally {
      setConsultando(false);
    }
  }

  return <section className="carrito">
    <div className="carrito-encabezado">
      <div><span className="subtitulo">TU SELECCIÓN</span><h2>Mi carrito</h2></div>
      <span className="cantidad-items">
        {carrito.reduce((cantidad, item) => cantidad + item.cantidad, 0)} productos
      </span>
    </div>

    {pedidoConfirmado && <div className="pedido-confirmado" role="status">
      <h3>Pedido confirmado correctamente</h3>
      <p>Número de pedido: <strong>{pedidoConfirmado.id}</strong></p>
      <p>Estado: <strong>{pedidoConfirmado.estado}</strong></p>
      <p>Total del pedido: <strong>${pedidoConfirmado.total.toLocaleString("es-AR")}</strong></p>
      <p>{pedidoConfirmado.mesaId === null ? "Retiro en barra" : `Mesa ${pedidoConfirmado.mesaId}`}</p>
      <button type="button" onClick={consultarEstado} disabled={consultando}>
        {consultando ? "Consultando..." : "Consultar estado del pedido"}
      </button>
    </div>}

    {errorPedido && <p role="alert">Error al confirmar o consultar el pedido: {errorPedido}</p>}

    {carrito.length === 0 ? <div className="carrito-vacio">
      <span className="icono-carrito">☕</span>
      <h3>Tu carrito está vacío</h3>
      <p>¡Elegí algo rico de nuestro menú para empezar!</p>
    </div> : <>
      <div className="lista-carrito">
        {carrito.map((item) => <article className="item-carrito" key={item.producto.id}>
          <div className="item-info">
            <h3>{item.producto.nombre}</h3>
            <p>${item.producto.precio.toLocaleString("es-AR")} c/u</p>
          </div>
          <div className="item-acciones">
            <div className="contador">
              <button type="button" disabled={enviando}
                onClick={() => restarProducto(item.producto.id)}
                aria-label={`Restar ${item.producto.nombre}`}>−</button>
              <span>{item.cantidad}</span>
              <button type="button" disabled={enviando}
                onClick={() => agregarProducto(item.producto)}
                aria-label={`Agregar ${item.producto.nombre}`}>+</button>
            </div>
            <strong>${(item.producto.precio * item.cantidad).toLocaleString("es-AR")}</strong>
            <button type="button" className="boton-eliminar" disabled={enviando}
              onClick={() => eliminarProducto(item.producto.id)}
              aria-label={`Eliminar ${item.producto.nombre}`}>Eliminar</button>
          </div>
        </article>)}
      </div>
      <div className="carrito-total">
        <span>Total orientativo</span><strong>${total.toLocaleString("es-AR")}</strong>
      </div>
      <button type="button" onClick={confirmarPedido} disabled={enviando}>
        {enviando ? "Confirmando..." : "Confirmar pedido"}
      </button>
    </>}
  </section>;
}

export default Carrito;
