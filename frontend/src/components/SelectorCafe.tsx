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

  const productosDisponibles = productos.filter(
    (producto) =>
      producto.tipo === bebida &&
      producto.tamano === tamano
  );

  const productoSeleccionado = productosDisponibles.find(
    (producto) => producto.variedad === origen
  );

  const puedeAgregar = Boolean(productoSeleccionado);

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
          onChange={(e) => {
            setBebida(e.target.value);
            setOrigen("");
          }}
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
          onChange={(e) => {
            setTamano(e.target.value);
            setOrigen("");
          }}
        >
          <option value="">Seleccioná un tamaño</option>
          <option value="Pocillo">Pocillo</option>
          <option value="Mediano">Mediano</option>
          <option value="Taza grande">Taza grande</option>
        </select>
      </div>

      {bebida && tamano && (
        <fieldset>
          <legend>Elegí un origen</legend>

          {productosDisponibles.map((producto) => (
            <label key={producto.id}>
              <input
                type="radio"
                name="origen"
                value={producto.variedad}
                checked={origen === producto.variedad}
                onChange={() => setOrigen(producto.variedad ?? "")}
              />

              <span>
                {producto.variedad} - ${producto.precio.toLocaleString("es-AR")}
                {producto.origen && <small className="notas-origen">
                  Acidez: {producto.origen.acidez}; cuerpo: {producto.origen.cuerpo}; notas: {producto.origen.notas}
                </small>}
              </span>
            </label>
          ))}

          {productosDisponibles.length === 0 && (
            <p>No hay cafés disponibles para esta selección.</p>
          )}
        </fieldset>
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

