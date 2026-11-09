
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pasteleria from "../../components/Pasteleria";
import type { Producto } from "../../schemas/producto.schema";

const productos: Producto[] = [
  {
    id: 19,
    nombre: "Muffin de chocolate",
    tipo: "pasteleria",
    precio: 2500,
  },
  {
    id: 20,
    nombre: "Porción de torta selva negra",
    tipo: "pasteleria",
    precio: 4200,
  },
];

describe("Pasteleria", () => {
  it("muestra los productos de pastelería", () => {
    render(
      <Pasteleria productos={productos} onAgregar={vi.fn()} />
    );

    expect(
      screen.getByText("Muffin de chocolate")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Porción de torta selva negra")
    ).toBeInTheDocument();
  });

  it("muestra los precios de los productos", () => {
    render(
      <Pasteleria productos={productos} onAgregar={vi.fn()} />
    );

    expect(screen.getByText(/2[.]500/)).toBeInTheDocument();
    expect(screen.getByText(/4[.]200/)).toBeInTheDocument();
  });

  it("permite agregar un muffin al carrito", async () => {
    const user = userEvent.setup();
    const onAgregar = vi.fn();

    render(
      <Pasteleria productos={productos} onAgregar={onAgregar} />
    );

    await user.click(
      screen.getAllByRole("button", {
        name: /agregar al carrito/i,
      })[0]
    );

    expect(onAgregar).toHaveBeenCalledWith(productos[0]);
  });

  it("permite agregar una porción de selva negra al carrito", async () => {
    const user = userEvent.setup();
    const onAgregar = vi.fn();

    render(
      <Pasteleria productos={productos} onAgregar={onAgregar} />
    );

    await user.click(
      screen.getAllByRole("button", {
        name: /agregar al carrito/i,
      })[1]
    );

    expect(onAgregar).toHaveBeenCalledWith(productos[1]);
  });
});


