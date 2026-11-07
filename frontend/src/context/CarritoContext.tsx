
import { createContext, useContext, useReducer } from "react";
import {
  carritoReducer,
  type Producto,
  type ItemCarrito,
} from "../reducers/carritoReducer";

type CarritoContextType = {
  carrito: ItemCarrito[];
  agregarProducto: (producto: Producto) => void;
  restarProducto: (productoId: number) => void;
  eliminarProducto: (productoId: number) => void;
  vaciarCarrito: () => void;
};

const CarritoContext = createContext<CarritoContextType | undefined>(
  undefined
);

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

export function useCarrito() {
  const context = useContext(CarritoContext);

  if (!context) {
    throw new Error("useCarrito debe utilizarse dentro de CarritoProvider");
  }

  return context;
}
