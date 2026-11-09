import { describe, expect, it } from "vitest";
import request from "supertest";
import { crearApp } from "../../src/app.js";

describe("mesas existentes (inventario de demostración)", () => {
  it("acepta un pedido para una mesa válida", async () => {
    const app = crearApp();
    const res = await request(app).post("/pedidos").send({
      mesaId: 7,
      items: [{ productoId: 1, cantidad: 1 }],
    });
    expect(res.status).toBe(201);
    expect(res.body.mesaId).toBe(7);
  });

  it("rechaza una mesa inexistente con HTTP 400 y no guarda el pedido", async () => {
    const app = crearApp();
    const res = await request(app).post("/pedidos").send({
      mesaId: 9999,
      items: [{ productoId: 1, cantidad: 1 }],
    });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: expect.stringContaining("no existe") });
    const lista = await request(app).get("/pedidos");
    expect(lista.body).toEqual([]);
  });

  it("admite retiro en barra sin mesa", async () => {
    const app = crearApp();
    const res = await request(app).post("/pedidos").send({
      items: [{ productoId: 1, cantidad: 1 }],
    });
    expect(res.status).toBe(201);
    expect(res.body.mesaId).toBeNull();
  });
});
