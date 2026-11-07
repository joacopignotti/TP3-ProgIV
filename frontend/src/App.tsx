
import { useEffect, useState } from "react";
import "./App.css";
import { CarritoProvider } from "./context/CarritoContext";
import { useCarrito } from "./context/useCarrito";

import Pasteleria from "./components/Pasteleria";
import SelectorCafe from "./components/SelectorCafe";
import Carrito from "./components/Carrito";

import { obtenerProductos } from "./api/client";
import type { EstadoMenu } from "./schemas/producto.schema";

function Contenido() {
  const { agregarProducto } = useCarrito();

  const [estadoMenu, setEstadoMenu] = useState<EstadoMenu>({
    status: "cargando",
  });

  useEffect(() => {
    let activo = true;

    obtenerProductos()
      .then((productos) => {
        if (activo) {
          setEstadoMenu({
            status: "listo",
            productos,
          });
        }
      })
      .catch((error: unknown) => {
        if (activo) {
          setEstadoMenu({
            status: "error",
            mensaje:
              error instanceof Error
                ? error.message
                : "Error desconocido al cargar el menú",
          });
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  if (estadoMenu.status === "cargando") {
    return <p role="status">Cargando productos...</p>;
  }

  if (estadoMenu.status === "error") {
    return (
      <p role="alert">
        Error al cargar los productos: {estadoMenu.mensaje}
      </p>
    );
  }

  // En este punto, TypeScript sabe que el estado es "listo".
  const productosCafe = estadoMenu.productos.filter(
    (producto) =>
      producto.tipo === "expreso" ||
      producto.tipo === "filtrado"
  );

  const productosPasteleria = estadoMenu.productos.filter(
    (producto) => producto.tipo === "pasteleria"
  );

  return (
    <main>
      <h1>Cafetería Origen</h1>

      <SelectorCafe
        productos={productosCafe}
        onAgregar={agregarProducto}
      />

      <Pasteleria
        productos={productosPasteleria}
        onAgregar={agregarProducto}
      />

      <Carrito />
    </main>
  );
}

function App() {
  return (
    <CarritoProvider>
      <Contenido />
    </CarritoProvider>
  );
}

export default App;
