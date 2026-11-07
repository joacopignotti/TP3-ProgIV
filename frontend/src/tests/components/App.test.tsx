
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import App from "../../App";
import { obtenerProductos } from "../../api/client";

vi.mock("../../api/client", () => ({
  obtenerProductos: vi.fn(),
}));

describe("App - estados de carga del menú", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("muestra el estado cargando mientras espera la API", () => {
    vi.mocked(obtenerProductos).mockImplementation(
      () => new Promise(() => {})
    );

    render(<App />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Cargando productos..."
    );
  });

  it("muestra el mensaje cuando falla la API", async () => {
    vi.mocked(obtenerProductos).mockRejectedValue(
      new Error("No se pudo conectar con la API")
    );

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo conectar con la API"
    );
  });

  it("muestra el menú cuando los productos están listos", async () => {
    vi.mocked(obtenerProductos).mockResolvedValue([
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
    ]);

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Cafetería Origen",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Muffin de chocolate")
    ).toBeInTheDocument();
  });
});
