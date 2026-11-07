import {
  beforeAll,
  afterAll,
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { CarritoProvider } from "../../context/CarritoContext";
import { useCarrito } from "../../context/useCarrito";

import Carrito from "../../components/Carrito";

const API_URL = "http://localhost:3000";

const cafe = {
  id: 1,
  nombre: "Expreso Pocillo Brasil",
  precio: 5020,
};

let cuerpoRecibido: unknown = null;

const server = setupServer(
  http.post(`${API_URL}/pedidos`, async ({ request }) => {
    cuerpoRecibido = await request.json();

    return HttpResponse.json(
      {
        id: 1,
        estado: "pendiente",
        total: 10040,
        mesaId: null,
      },
      { status: 201 }
    );
  })
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
  cuerpoRecibido = null;
});

afterAll(() => {
  server.close();
});

function CarritoDePrueba() {
  const { agregarProducto } = useCarrito();

  return (
    <>
      <button onClick={() => agregarProducto(cafe)}>
        Agregar café
      </button>

      <Carrito />
    </>
  );
}

function renderCarrito() {
  return render(
    <CarritoProvider>
      <CarritoDePrueba />
    </CarritoProvider>
  );
}

describe("Integración - confirmación de pedidos con MSW", () => {
  it("debería enviar el pedido con los productos y cantidades correctas", async () => {
    const user = userEvent.setup();

    renderCarrito();

    await user.click(
      screen.getByRole("button", { name: "Agregar café" })
    );

    await user.click(
      screen.getByRole("button", { name: "Agregar café" })
    );

    expect(
      screen.getByText("Expreso Pocillo Brasil")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /confirmar pedido/i })
    );

    await waitFor(() => {
      expect(cuerpoRecibido).toEqual({
        items: [
          {
            productoId: 1,
            cantidad: 2,
          },
        ],
        mesaId: null,
      });
    });

    expect(
      await screen.findByText(/pedido confirmado/i)
    ).toBeInTheDocument();
  });
  it("conserva el carrito cuando la API rechaza el pedido con HTTP 400", async () => {
  server.use(
    http.post(`${API_URL}/pedidos`, () => {
      return HttpResponse.json(
        { error: "Producto inválido" },
        { status: 400 }
      );
    })
  );

  const user = userEvent.setup();
  renderCarrito();

  await user.click(
    screen.getByRole("button", { name: "Agregar café" })
  );

  await user.click(
    screen.getByRole("button", { name: /confirmar pedido/i })
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Producto inválido"
  );

  expect(
    screen.getByText("Expreso Pocillo Brasil")
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: /confirmar pedido/i })
  ).toBeEnabled();
});
it("permite reintentar el pedido después de un error HTTP 500", async () => {
  let intentos = 0;

  server.use(
    http.post(`${API_URL}/pedidos`, () => {
      intentos++;

      if (intentos === 1) {
        return HttpResponse.json(
          { error: "Error interno del servidor" },
          { status: 500 }
        );
      }

      return HttpResponse.json(
        {
          id: 2,
          estado: "pendiente",
          total: 5020,
          mesaId: null,
        },
        { status: 201 }
      );
    })
  );

  const user = userEvent.setup();
  renderCarrito();

  await user.click(
    screen.getByRole("button", { name: "Agregar café" })
  );

  await user.click(
    screen.getByRole("button", { name: /confirmar pedido/i })
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Error interno del servidor"
  );

  expect(
    screen.getByText("Expreso Pocillo Brasil")
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: /confirmar pedido/i })
  );

  expect(
    await screen.findByText(/pedido confirmado/i)
  ).toBeInTheDocument();

  expect(intentos).toBe(2);

  expect(
    screen.getByText("Tu carrito está vacío")
  ).toBeInTheDocument();
});
});
