
import { createContext } from "react";
import type {
  Producto,
  ItemCarrito,
} from "../reducers/carritoReducer";

export type CarritoContextType = {
  carrito: ItemCarrito[];
  agregarProducto: (producto: Producto) => void;
  restarProducto: (productoId: number) => void;
  eliminarProducto: (productoId: number) => void;
  vaciarCarrito: () => void;
};

export const CarritoContext = createContext<
  CarritoContextType | undefined
>(undefined);
