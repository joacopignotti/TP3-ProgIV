
import { describe, it, expect } from "vitest";
import { carritoReducer } from "../../reducers/carritoReducer";

const producto = {
  id: 5,
  nombre: "Expreso Mediano Colombia",
  precio: 7360,
};

describe("carritoReducer", () => {
  it("agrega un producto al carrito", () => {
    const resultado = carritoReducer([], {
      type: "AGREGAR",
      producto,
    });

    expect(resultado).toEqual([
      {
        producto,
        cantidad: 1,
      },
    ]);
  });

  it("aumenta la cantidad si el producto ya existe", () => {
    const estado = [{ producto, cantidad: 1 }];

    const resultado = carritoReducer(estado, {
      type: "AGREGAR",
      producto,
    });

    expect(resultado).toEqual([
      {
        producto,
        cantidad: 2,
      },
    ]);
  });

  it("resta una unidad del producto", () => {
    const estado = [{ producto, cantidad: 2 }];

    const resultado = carritoReducer(estado, {
      type: "RESTAR",
      productoId: 5,
    });

    expect(resultado).toEqual([
      {
        producto,
        cantidad: 1,
      },
    ]);
  });

  it("elimina un producto del carrito", () => {
    const estado = [{ producto, cantidad: 1 }];

    const resultado = carritoReducer(estado, {
      type: "ELIMINAR",
      productoId: 5,
    });

    expect(resultado).toEqual([]);
  });
});
