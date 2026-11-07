import { useReducer } from "react";
import {
  carritoReducer,
  type Producto,
} from "../reducers/carritoReducer";
import { CarritoContext } from "./carritoContextDefinition";
type CarritoProviderProps = {
  children: React.ReactNode;
};

export function CarritoProvider({ children }: CarritoProviderProps) {
  const [carrito, dispatch] = useReducer(carritoReducer, []);

  const agregarProducto = (producto: Producto) => {
    dispatch({ type: "AGREGAR", producto });
  };

  const restarProducto = (productoId: number) => {
    dispatch({ type: "RESTAR", productoId });
  };

  const eliminarProducto = (productoId: number) => {
    dispatch({ type: "ELIMINAR", productoId });
  };

  const vaciarCarrito = () => {
    dispatch({ type: "VACIAR" });
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        restarProducto,
        eliminarProducto,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
