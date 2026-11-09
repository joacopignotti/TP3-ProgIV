import { useEffect, useState } from "react";
import "./App.css";
import { CarritoProvider } from "./context/CarritoContext";
import { useCarrito } from "./context/useCarrito";
import Pasteleria from "./components/Pasteleria";
import SelectorCafe from "./components/SelectorCafe";
import Carrito from "./components/Carrito";
import { obtenerProductos } from "./api/client";
import type { EstadoMenu } from "./schemas/producto.schema";
import { obtenerMesaDesdeURL } from "./utils/mesa";

function Contenido() {
  const { agregarProducto } = useCarrito();
  const mesaId = obtenerMesaDesdeURL(window.location.search);
  const [estadoMenu, setEstadoMenu] = useState<EstadoMenu>({ status: "cargando" });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    obtenerProductos()
      .then((productos) => {
        if (activo) setEstadoMenu({ status: "listo", productos });
      })
      .catch((error: unknown) => {
        if (activo) setEstadoMenu({
          status: "error",
          mensaje: error instanceof Error ? error.message : "Error desconocido al cargar el menú",
        });
      });
    return () => { activo = false; };
  }, [intento]);

  function reintentarMenu() {
    setEstadoMenu({ status: "cargando" });
    setIntento((anterior) => anterior + 1);
  }

  if (estadoMenu.status === "cargando") {
    return <p role="status">Cargando productos...</p>;
  }
  if (estadoMenu.status === "error") {
    return <div>
      <p role="alert">Error al cargar los productos: {estadoMenu.mensaje}</p>
      <button type="button" onClick={reintentarMenu}>Reintentar cargar menú</button>
    </div>;
  }

  const productosCafe = estadoMenu.productos.filter(
    (producto) => producto.tipo === "expreso" || producto.tipo === "filtrado"
  );
  const productosPasteleria = estadoMenu.productos.filter(
    (producto) => producto.tipo === "pasteleria"
  );

  return <main className="container-fluid">
    <h1>Cafetería Origen</h1>
    <p className="identificacion-mesa" role="status">
      {mesaId === null ? "Retiro en barra" : `Mesa ${mesaId}`}
    </p>
    <SelectorCafe productos={productosCafe} onAgregar={agregarProducto} />
    <Pasteleria productos={productosPasteleria} onAgregar={agregarProducto} />
    <Carrito mesaId={mesaId} />
  </main>;
}

export default function App() {
  return <CarritoProvider><Contenido /></CarritoProvider>;
}
