import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import App from "../../App";

const API = "http://localhost:3000";
const cafe = { id: 1, tipo: "expreso", nombre: "Expreso Pocillo Brasil", tamano: "Pocillo", variedad: "Brasil", gramos: 18, precio: 5020,
  origen: { acidez: "baja", cuerpo: "denso", notas: "avellana" } };
let cuerpo: unknown = null;
let consultas = 0;
const pedido = { id: 7, estado: "pendiente", total: 5020, mesaId: 4, items: [{ productoId: 1, cantidad: 1 }] };
const server = setupServer(
  http.get(`${API}/productos`, () => HttpResponse.json([cafe])),
  http.post(`${API}/pedidos`, async ({ request }) => {
    cuerpo = await request.json();
    return HttpResponse.json(pedido, { status: 201 });
  }),
  http.get(`${API}/pedidos/7`, () => {
    consultas++;
    return HttpResponse.json({ ...pedido, estado: "entregado" });
  })
);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => { server.resetHandlers(); cuerpo = null; consultas = 0; window.history.replaceState({}, "", "/"); });
afterAll(() => server.close());

describe("Mesa QR, confirmación y seguimiento", () => {
  it("lee la mesa de la URL, muestra los datos de confirmación y permite consultar el estado", async () => {
    window.history.replaceState({}, "", "/?mesa=4");
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByText("Mesa 4")).toBeInTheDocument();
    await user.selectOptions(screen.getByRole("combobox", { name: "Bebida" }), "expreso");
    await user.selectOptions(screen.getByRole("combobox", { name: "Tamaño" }), "Pocillo");
    await user.click(screen.getByRole("radio", { name: /Brasil/ }));
    await user.click(screen.getByRole("button", { name: /^Agregar$/ }));
    await user.click(screen.getByRole("button", { name: "Confirmar pedido" }));
    expect(await screen.findByText(/Pedido confirmado correctamente/)).toBeInTheDocument();
    expect(cuerpo).toEqual({ items: [{ productoId: 1, cantidad: 1 }], mesaId: 4 });
    expect(screen.getByText("Número de pedido:")).toBeInTheDocument();
    expect(screen.getByText("Total del pedido:")).toBeInTheDocument();
    expect(screen.getByText("pendiente")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Consultar estado del pedido" }));
    expect(await screen.findByText("entregado")).toBeInTheDocument();
    expect(consultas).toBe(1);
  });

  it("reintenta GET /productos luego de un error HTTP", async () => {
    let intentos = 0;
    server.use(http.get(`${API}/productos`, () => {
      intentos++;
      return intentos === 1 ? HttpResponse.json({ error: "No disponible" }, { status: 500 }) : HttpResponse.json([cafe]);
    }));
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent("No disponible");
    await user.click(screen.getByRole("button", { name: "Reintentar cargar menú" }));
    expect(await screen.findByRole("heading", { name: "Cafetería Origen" })).toBeInTheDocument();
    expect(intentos).toBe(2);
  });
});
