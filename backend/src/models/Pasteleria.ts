
import { Producto } from "./Producto.js";

export class Pasteleria extends Producto {
  get tipo(): string {
    return "pasteleria";
  }

  calcularPrecio(): number {
    return this.precioBase;
  }
}
