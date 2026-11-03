
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { crearApp } from "../../src/app.js";

describe("POST /pedidos - integración con mesaId", () => {
  let app: ReturnType<typeof crearApp>;

  const items = [
    { productoId: 1, cantidad: 2 },
  ];

  beforeEach(() => {
    // Cada test comienza con una aplicación nueva.
    app = crearApp();
  });

  it("debería crear un pedido con mesaId 4", async () => {
    const res = await request(app)
      .post("/pedidos")
      .send({
        items,
        mesaId: 4,
      });

    expect(res.status).toBe(201);
    expect(res.body.mesaId).toBe(4);
    expect(res.body.estado).toBe("pendiente");
    expect(res.body.total).toBe(10040);
  });

  it("debería crear un pedido para retirar si no se indica mesa", async () => {
    const res = await request(app)
      .post("/pedidos")
      .send({ items });

    expect(res.status).toBe(201);
    expect(res.body.mesaId).toBeNull();
  });

  it("debería devolver 400 si mesaId es cero", async () => {
    const res = await request(app)
      .post("/pedidos")
      .send({
        items,
        mesaId: 0,
      });

    expect(res.status).toBe(400);
  });

  it("debería devolver 400 si mesaId es negativo", async () => {
    const res = await request(app)
      .post("/pedidos")
      .send({
        items,
        mesaId: -2,
      });

    expect(res.status).toBe(400);
  });

  it("debería devolver 400 si mesaId es decimal", async () => {
    const res = await request(app)
      .post("/pedidos")
      .send({
        items,
        mesaId: 2.5,
      });

    expect(res.status).toBe(400);
  });

  it("debería devolver 400 si mesaId es texto", async () => {
    const res = await request(app)
      .post("/pedidos")
      .send({
        items,
        mesaId: "hola",
      });

    expect(res.status).toBe(400);
  });

  it("debería conservar mesaId al consultar el pedido", async () => {
    const creacion = await request(app)
      .post("/pedidos")
      .send({
        items,
        mesaId: 7,
      });

    expect(creacion.status).toBe(201);

    const consulta = await request(app)
      .get(`/pedidos/${creacion.body.id}`);

    expect(consulta.status).toBe(200);
    expect(consulta.body.mesaId).toBe(7);
    expect(consulta.body.items).toEqual(items);
  });

  it("debería conservar mesaId al listar pedidos", async () => {
    await request(app)
      .post("/pedidos")
      .send({
        items,
        mesaId: 3,
      });

    const res = await request(app).get("/pedidos");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].mesaId).toBe(3);
  });

  it("no debería guardar un pedido con mesa inválida", async () => {
    const respuesta = await request(app)
      .post("/pedidos")
      .send({
        items,
        mesaId: 0,
      });

    expect(respuesta.status).toBe(400);

    const listado = await request(app).get("/pedidos");

    expect(listado.body).toHaveLength(0);
  });
});
