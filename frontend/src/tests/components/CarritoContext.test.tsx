import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CarritoProvider } from "../../context/CarritoContext";
import { useCarrito } from "../../context/useCarrito";
import { describe, it, expect } from "vitest";
function ComponentePrueba() {
  const {
    carrito,
    agregarProducto,
    restarProducto,
    eliminarProducto,
  } = useCarrito();

  const producto = {
    id: 5,
    nombre: "Expreso Mediano Colombia",
    precio: 7360,
  };

  return (
    <div>
      <p data-testid="cantidad">
        {carrito.reduce((total, item) => total + item.cantidad, 0)}
      </p>

      <button onClick={() => agregarProducto(producto)}>
        Agregar
      </button>

      <button onClick={() => restarProducto(5)}>
        Restar
      </button>

      <button onClick={() => eliminarProducto(5)}>
        Eliminar
      </button>
    </div>
  );
}

describe("CarritoContext", () => {
  it("inicia con el carrito vacío", () => {
    render(
      <CarritoProvider>
        <ComponentePrueba />
      </CarritoProvider>
    );

    expect(screen.getByTestId("cantidad")).toHaveTextContent("0");
  });

  it("permite agregar un producto", async () => {
    const user = userEvent.setup();

    render(
      <CarritoProvider>
        <ComponentePrueba />
      </CarritoProvider>
    );

    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(screen.getByTestId("cantidad")).toHaveTextContent("1");
  });

  it("permite restar una unidad", async () => {
    const user = userEvent.setup();

    render(
      <CarritoProvider>
        <ComponentePrueba />
      </CarritoProvider>
    );

    await user.click(screen.getByRole("button", { name: "Agregar" }));
    await user.click(screen.getByRole("button", { name: "Agregar" }));
    await user.click(screen.getByRole("button", { name: "Restar" }));

    expect(screen.getByTestId("cantidad")).toHaveTextContent("1");
  });

  it("permite eliminar un producto", async () => {
    const user = userEvent.setup();

    render(
      <CarritoProvider>
        <ComponentePrueba />
      </CarritoProvider>
    );

    await user.click(screen.getByRole("button", { name: "Agregar" }));
    await user.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(screen.getByTestId("cantidad")).toHaveTextContent("0");
  });
});

