
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectorCafe from "../../components/SelectorCafe";
import type { Producto } from "../../schemas/producto.schema";

const productos: Producto[] = [
  {
    id: 5,
    nombre: "Expreso Mediano Colombia",
    tipo: "expreso",
    precio: 7360,
    tamano: "Mediano",
    variedad: "Colombia",
    gramos: 27,
  },
  {
    id: 6,
    nombre: "Expreso Mediano Etiopía",
    tipo: "expreso",
    precio: 8120,
    tamano: "Mediano",
    variedad: "Etiopía",
    gramos: 27,
  },
  {
    id: 7,
    nombre: "Expreso Mediano Brasil",
    tipo: "expreso",
    precio: 7600,
    tamano: "Mediano",
    variedad: "Brasil",
    gramos: 27,
  },
];

describe("SelectorCafe", () => {
  it("muestra las opciones de bebida y tamaño", () => {
    render(
      <SelectorCafe productos={productos} onAgregar={vi.fn()} />
    );

    expect(
      screen.getByRole("combobox", { name: /bebida/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", { name: /tamaño/i })
    ).toBeInTheDocument();
  });

  it("mantiene deshabilitado el botón hasta completar las elecciones", () => {
    render(
      <SelectorCafe productos={productos} onAgregar={vi.fn()} />
    );

    expect(
      screen.getByRole("button", { name: /agregar/i })
    ).toBeDisabled();
  });

  it("muestra los tres orígenes con sus precios al elegir bebida y tamaño", async () => {
    const user = userEvent.setup();

    render(
      <SelectorCafe productos={productos} onAgregar={vi.fn()} />
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: /bebida/i }),
      "expreso"
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: /tamaño/i }),
      "Mediano"
    );

    expect(
      screen.getByRole("radio", { name: /Colombia/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", { name: /Etiopía/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", { name: /Brasil/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/7[.]?360/)).toBeInTheDocument();
    expect(screen.getByText(/8[.]?120/)).toBeInTheDocument();
    expect(screen.getByText(/7[.]?600/)).toBeInTheDocument();
  });

  it("habilita agregar al seleccionar un origen", async () => {
    const user = userEvent.setup();

    render(
      <SelectorCafe productos={productos} onAgregar={vi.fn()} />
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: /bebida/i }),
      "expreso"
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: /tamaño/i }),
      "Mediano"
    );

    await user.click(
      screen.getByRole("radio", { name: /Colombia/i })
    );

    expect(
      screen.getByRole("button", { name: /agregar/i })
    ).toBeEnabled();
  });

  it("agrega el producto del origen seleccionado", async () => {
    const user = userEvent.setup();
    const onAgregar = vi.fn();

    render(
      <SelectorCafe productos={productos} onAgregar={onAgregar} />
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: /bebida/i }),
      "expreso"
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: /tamaño/i }),
      "Mediano"
    );

    await user.click(
      screen.getByRole("radio", { name: /Colombia/i })
    );

    await user.click(
      screen.getByRole("button", { name: /agregar/i })
    );

    expect(onAgregar).toHaveBeenCalledWith(productos[0]);
  });
});
