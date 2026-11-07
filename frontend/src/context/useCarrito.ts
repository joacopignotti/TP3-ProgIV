import { useContext } from "react";
import { CarritoContext } from "./carritoContextDefinition";

export function useCarrito() {
  const context = useContext(CarritoContext);

  if (!context) {
    throw new Error("useCarrito debe utilizarse dentro de CarritoProvider");
  }

  return context;
}