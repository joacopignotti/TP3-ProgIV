
import { useState } from "react";
import type { Producto } from "../schemas/producto.schema";

type SelectorCafeProps = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

function SelectorCafe({ productos, onAgregar }: SelectorCafeProps) {
  const [bebida, setBebida] = useState("");
  const [tamano, setTamano] = useState("");
  const [origen, setOrigen] = useState("");

  const productoSeleccionado = productos.find(
    (producto) =>
      producto.tipo === bebida &&
      producto.tamano === tamano &&
      producto.variedad === origen
  );

  const puedeAgregar = Boolean(
    bebida && tamano && origen && productoSeleccionado
  );

  function agregarProducto() {
    if (productoSeleccionado) {
      onAgregar(productoSeleccionado);
    }
  }

  return (
    <section>
      <h2>Elegí tu café</h2>

      <div>
        <label htmlFor="bebida">Bebida</label>
        <select
          id="bebida"
          value={bebida}
          onChange={(e) => setBebida(e.target.value)}
        >
          <option value="">Seleccioná una bebida</option>
          <option value="expreso">Expreso</option>
          <option value="filtrado">Filtrado</option>
        </select>
      </div>

      <div>
        <label htmlFor="tamano">Tamaño</label>
        <select
          id="tamano"
          value={tamano}
          onChange={(e) => setTamano(e.target.value)}
        >
          <option value="">Seleccioná un tamaño</option>
          <option value="Pocillo">Pocillo</option>
          <option value="Mediano">Mediano</option>
          <option value="Taza grande">Taza grande</option>
        </select>
      </div>

      <div>
        <label htmlFor="origen">Origen</label>
        <select
          id="origen"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
        >
          <option value="">Seleccioná un origen</option>
          <option value="Brasil">Brasil</option>
          <option value="Colombia">Colombia</option>
          <option value="Etiopía">Etiopía</option>
        </select>
      </div>

      {productoSeleccionado && (
        <p>Precio: ${productoSeleccionado.precio}</p>
      )}

      <button
        type="button"
        onClick={agregarProducto}
        disabled={!puedeAgregar}
      >
        Agregar
      </button>
    </section>
  );
}

export default SelectorCafe;


