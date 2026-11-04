
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pasteleria from "../../components/Pasteleria";

const productos = [
  {
    id: 19,
    nombre: "Muffin de chocolate",
    tipo: "pasteleria",
    precioBase: 2500,
    precio: 2500,
  },
  {
    id: 20,
    nombre: "Porción de torta selva negra",
    tipo: "pasteleria",
    precioBase: 4200,
    precio: 4200,
  },
];

describe("Pasteleria", () => {
  it("muestra los productos de pastelería", () => {
    render(<Pasteleria productos={productos} onAgregar={vi.fn()} />);

    expect(screen.getByText("Muffin de chocolate")).toBeInTheDocument();
    expect(
      screen.getByText("Porción de torta selva negra")
    ).toBeInTheDocument();
  });

  it("muestra los precios de los productos", () => {
    render(<Pasteleria productos={productos} onAgregar={vi.fn()} />);

    expect(screen.getByText("$2500")).toBeInTheDocument();
    expect(screen.getByText("$4200")).toBeInTheDocument();
  });

  it("permite agregar un muffin al carrito", async () => {
    const user = userEvent.setup();
    const onAgregar = vi.fn();

    render(<Pasteleria productos={productos} onAgregar={onAgregar} />);

    await user.click(
      screen.getByRole("button", { name: /agregar muffin/i })
    );

    expect(onAgregar).toHaveBeenCalledWith(productos[0]);
  });

  it("permite agregar una porción de selva negra al carrito", async () => {
    const user = userEvent.setup();
    const onAgregar = vi.fn();

    render(<Pasteleria productos={productos} onAgregar={onAgregar} />);

    await user.click(
      screen.getByRole("button", { name: /agregar selva negra/i })
    );

    expect(onAgregar).toHaveBeenCalledWith(productos[1]);
  });
});


