
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectorCafe from "../../components/SelectorCafe";

const productos = [
  {
    id: 5,
    nombre: "Expreso Mediano Colombia",
    tipo: "expreso",
    precioBase: 2500,
    precio: 7360,
    tamano: "Mediano",
    variedad: "Colombia",
    gramos: 27,
    costoCafe: 4860,
  },
  {
    id: 14,
    nombre: "Filtrado Mediano Colombia",
    tipo: "filtrado",
    precioBase: 3200,
    precio: 5900,
    tamano: "Mediano",
    variedad: "Colombia",
    gramos: 15,
    costoCafe: 2700,
  },
];

describe("SelectorCafe", () => {
  it("muestra las tres opciones de selección", () => {
    render(
      <SelectorCafe productos={productos} onAgregar={vi.fn()} />
    );

    expect(screen.getByRole("combobox", { name: /bebida/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /tamaño/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /origen/i })).toBeInTheDocument();
  });

  it("mantiene deshabilitado el botón si faltan elecciones", () => {
    render(
      <SelectorCafe productos={productos} onAgregar={vi.fn()} />
    );

    expect(
      screen.getByRole("button", { name: /agregar/i })
    ).toBeDisabled();
  });

  it("habilita agregar y muestra el precio al completar las elecciones", async () => {
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

    await user.selectOptions(
      screen.getByRole("combobox", { name: /origen/i }),
      "Colombia"
    );

    expect(screen.getByText(/7360/)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /agregar/i })
    ).toBeEnabled();
  });

  it("agrega el producto seleccionado", async () => {
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

    await user.selectOptions(
      screen.getByRole("combobox", { name: /origen/i }),
      "Colombia"
    );

    await user.click(
      screen.getByRole("button", { name: /agregar/i })
    );

    expect(onAgregar).toHaveBeenCalledWith(productos[0]);
  });
});


