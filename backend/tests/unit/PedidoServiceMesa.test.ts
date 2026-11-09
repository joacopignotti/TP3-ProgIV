
import { describe, it, expect, beforeEach } from "vitest";
import { PedidoService } from "../../src/services/PedidoService.js";
import { ProductoService } from "../../src/services/ProductoService.js";
import type { Producto } from "../../src/models/Producto.js";

// Producto falso para controlar el precio durante las pruebas
const productoFalso = (id: number, precio: number) =>
  ({
    id,
    nombre: `Producto ${id}`,
    tipo: "Falso",
    precioBase: 0,
    calcularPrecio: () => precio,
  }) as Producto;

describe("PedidoService - mesaId", () => {
  let service: PedidoService;

  const items = [
    { productoId: 1, cantidad: 2 },
  ];

  beforeEach(() => {
    const productos = new ProductoService([
      productoFalso(1, 5000),
    ]);

    service = new PedidoService(productos);
  });

  it("debería crear un pedido con la mesa indicada", () => {
    const pedido = service.crear(items, 4);

    expect(pedido.mesaId).toBe(4);
  });

  it("debería crear un pedido para retirar si no se indica mesa", () => {
    const pedido = service.crear(items);

    expect(pedido.mesaId).toBeNull();
  });

  it("debería conservar la mesa al listar los pedidos", () => {
    service.crear(items, 7);

    const pedidos = service.listar();

    expect(pedidos).toHaveLength(1);
    expect(pedidos[0].mesaId).toBe(7);
  });

  it("debería conservar la mesa al obtener un pedido por ID", () => {
    const pedidoCreado = service.crear(items, 3);

    const pedidoObtenido = service.obtener(pedidoCreado.id);

    expect(pedidoObtenido.mesaId).toBe(3);
  });
});
