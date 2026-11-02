
import { describe, it, expect, beforeEach } from "vitest";
import { PedidoService } from "../../src/services/PedidoService.js";
import { ProductoService } from "../../src/services/ProductoService.js";
import { ValidationError } from "../../src/errors/index.js";
import type { Producto } from "../../src/models/Producto.js";

const productoFalso = (id: number, precio: number) =>
  ({
    id,
    nombre: `Producto ${id}`,
    tipo: "Falso",
    precioBase: 0,
    calcularPrecio: () => precio,
  }) as Producto;

describe("PedidoService - validación de mesaId", () => {
  let service: PedidoService;

  const items = [{ productoId: 1, cantidad: 2 }];

  beforeEach(() => {
    const productos = new ProductoService([
      productoFalso(1, 5000),
    ]);
    service = new PedidoService(productos);
  });

  it.each([
    ["cero", 0],
    ["negativo", -1],
    ["decimal", 2.5],
    ["texto", "hola"],
    ["número como texto", "4"],
    ["booleano", true],
    ["NaN", NaN],
    ["infinito", Infinity],
  ])("debería rechazar mesaId %s", (_caso, mesaId) => {
    expect(() =>
      service.crear(items, mesaId as number)
    ).toThrow(ValidationError);
  });

  it("no debería guardar el pedido si la mesa es inválida", () => {
    expect(() => service.crear(items, 0)).toThrow(ValidationError);

    expect(service.listar()).toHaveLength(0);
  });

  it("no debería consumir un ID si la mesa es inválida", () => {
    expect(() => service.crear(items, -1)).toThrow(ValidationError);

    const pedido = service.crear(items, 4);

    expect(pedido.id).toBe(1);
  });

  it("debería aceptar una mesa válida", () => {
    const pedido = service.crear(items, 4);

    expect(pedido.mesaId).toBe(4);
  });

  it("debería aceptar null como retiro en barra", () => {
    const pedido = service.crear(items, null);

    expect(pedido.mesaId).toBeNull();
  });
});
