
import { useEffect, useState } from "react";
import "./App.css";

import { CarritoProvider, useCarrito } from "./context/CarritoContext";
import Pasteleria from "./components/Pasteleria";
import SelectorCafe from "./components/SelectorCafe";
import Carrito from "./components/Carrito";

import { obtenerProductos } from "./api/client";
import type { Producto } from "./schemas/producto.schema";

function Contenido() {
  const { agregarProducto } = useCarrito();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerProductos()
      .then((datos) => {
        setProductos(datos);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const productosCafe = productos.filter(
    (producto) =>
      producto.tipo === "expreso" || producto.tipo === "filtrado"
  );

  const productosPasteleria = productos.filter(
    (producto) => producto.tipo === "pasteleria"
  );

  if (cargando) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>Error al cargar los productos: {error}</p>;
  }

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



