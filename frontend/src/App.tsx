import "./App.css";
import { CarritoProvider, useCarrito } from "./context/CarritoContext";
import Pasteleria from "./components/Pasteleria";
import SelectorCafe from "./components/SelectorCafe";

function Contenido() {
  const { carrito, agregarProducto } = useCarrito();

  const productosCafe = [
    // Acá después conectaremos los productos de la API.
  ];

  const productosPasteleria = [
    {
      id: 19,
      nombre: "Muffin de chocolate",
      tipo: "pasteleria",
      precioBase: 2500,
      precio: 2500,
    },
    {
      id: 20,
      nombre: "Porción de torta selva negra",
      tipo: "pasteleria",
      precioBase: 4200,
      precio: 4200,
    },
  ];

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

      <section>
        <h2>Carrito</h2>

        {carrito.map((item) => (
          <p key={item.producto.id}>
            {item.producto.nombre} - Cantidad: {item.cantidad}
          </p>
        ))}
      </section>
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


