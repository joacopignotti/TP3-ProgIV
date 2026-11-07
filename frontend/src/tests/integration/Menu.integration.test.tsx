
import {
  beforeAll,
  afterAll,
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import { render, screen } from "@testing-library/react";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import App from "../../App";

const API_URL = "http://localhost:3000";

const productos = [
  {
    id: 1,
    nombre: "Expreso Pocillo Brasil",
    tipo: "expreso",
    precio: 5020,
    tamano: "Pocillo",
    variedad: "Brasil",
    gramos: 18,
  },
  {
    id: 19,
    nombre: "Muffin de chocolate",
    tipo: "pasteleria",
    precio: 2500,
  },
];

const server = setupServer(
  http.get(`${API_URL}/productos`, () => {
    return HttpResponse.json(productos, {
      status: 200,
    });
  })
);

beforeAll(() => {
  server.listen({
    onUnhandledRequest: "error",
  });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("Integración - carga del menú con MSW", () => {
  it("debería cargar productos desde la API simulada", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Cafetería Origen",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Muffin de chocolate")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /mi carrito/i,
      })
    ).toBeInTheDocument();
  });
  it("debería mostrar un error cuando la API responde HTTP 500", async () => {
  server.use(
    http.get(`${API_URL}/productos`, () => {
      return HttpResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    })
  );

  render(<App />);

  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent("Error interno del servidor");

  expect(
    screen.queryByRole("heading", {
      name: "Cafetería Origen",
    })
  ).not.toBeInTheDocument();
});
it("debería mostrar un error cuando la API no está disponible", async () => {
  server.use(
    http.get(`${API_URL}/productos`, () => {
      return HttpResponse.error();
    })
  );

  render(<App />);

  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent("Error al cargar los productos");

  expect(
    screen.queryByRole("heading", {
      name: "Cafetería Origen",
    })
  ).not.toBeInTheDocument();
});
it("debería rechazar una respuesta que no cumple el contrato de Zod", async () => {
  server.use(
    http.get(`${API_URL}/productos`, () => {
      return HttpResponse.json(
        [
          {
            id: 1,
            nombre: "Expreso inválido",
            tipo: "expreso",
            precio: "gratis",
            tamano: "Pocillo",
            variedad: "Brasil",
            gramos: 18,
          },
        ],
        { status: 200 }
      );
    })
  );

  render(<App />);

  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent(
    "La respuesta de la API no cumple el contrato esperado"
  );

  expect(
    screen.queryByText("Expreso inválido")
  ).not.toBeInTheDocument();
});
});
