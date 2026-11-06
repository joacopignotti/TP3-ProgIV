
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CarritoProvider, useCarrito } from "../../context/CarritoContext";
import Carrito from "../../components/Carrito";

const cafe = {
  id: 1,
  nombre: "Expreso Pocillo Brasil",
  precio: 5020,
};

const torta = {
  id: 19,
  nombre: "Porción de torta",
  precio: 3500,
};

function AgregarProductosPrueba() {
  const {
    agregarProducto,
    restarProducto,
    eliminarProducto,
  } = useCarrito();

  return (
    <>
      <button onClick={() => agregarProducto(cafe)}>
        Agregar café
      </button>

      <button onClick={() => agregarProducto(torta)}>
        Agregar torta
      </button>

      <button onClick={() => restarProducto(cafe.id)}>
        Restar café
      </button>

      <button onClick={() => eliminarProducto(cafe.id)}>
        Eliminar café
      </button>

      <Carrito />
    </>
  );
}

function renderCarrito() {
  return render(
    <CarritoProvider>
      <AgregarProductosPrueba />
    </CarritoProvider>
  );
}

describe("Carrito", () => {
  it("muestra un mensaje cuando está vacío", () => {
  renderCarrito();

  expect(
    screen.getByText("Tu carrito está vacío")
  ).toBeInTheDocument();
});

  it("muestra los productos agregados", () => {
    renderCarrito();

    fireEvent.click(screen.getByText("Agregar café"));

    expect(screen.getByText("Expreso Pocillo Brasil")).toBeInTheDocument();
  });

  it("muestra el precio del producto", () => {
    renderCarrito();

    fireEvent.click(screen.getByText("Agregar café"));

    expect(screen.getAllByText("$5.020")).toHaveLength(2);
  });

  it("aumenta la cantidad de un producto", () => {
    renderCarrito();

    fireEvent.click(screen.getByText("Agregar café"));
    fireEvent.click(screen.getByText("Agregar café"));

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("resta la cantidad de un producto", () => {
    renderCarrito();

    fireEvent.click(screen.getByText("Agregar café"));
    fireEvent.click(screen.getByText("Agregar café"));
    fireEvent.click(screen.getByText("Restar café"));

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("elimina un producto del carrito", () => {
    renderCarrito();

    fireEvent.click(screen.getByText("Agregar café"));
    fireEvent.click(screen.getByText("Eliminar café"));

    expect(
      screen.queryByText("Expreso Pocillo Brasil")
    ).not.toBeInTheDocument();
  });

  it("calcula el total con distintos productos", () => {
    renderCarrito();

    fireEvent.click(screen.getByText("Agregar café"));
    fireEvent.click(screen.getByText("Agregar torta"));

    expect(screen.getAllByText("$8.520")).toHaveLength(1);
  });
});
