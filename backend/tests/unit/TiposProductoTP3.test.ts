
import { describe, it, expect } from "vitest";
import { CafeExpreso } from "../../src/models/CafeExpreso.js";
import { CafeFiltrado } from "../../src/models/CafeFiltrado.js";
import { Pasteleria } from "../../src/models/Pasteleria.js";
import { BRASIL } from "../../src/models/Variedad.js";

describe("TP3 - Tipos de productos normalizados", () => {

  it('debería devolver "expreso" en minúscula', () => {
    const producto = new CafeExpreso(1, "Pocillo", BRASIL);

    expect(producto.tipo).toBe("expreso");
  });

  it('debería devolver "filtrado" en minúscula', () => {
    const producto = new CafeFiltrado(2, "Mediano", BRASIL);

    expect(producto.tipo).toBe("filtrado");
  });

  it('debería devolver "pasteleria" sin tilde', () => {
    const producto = new Pasteleria(
      19,
      "Muffin de chocolate",
      2500
    );

    expect(producto.tipo).toBe("pasteleria");
  });

});
