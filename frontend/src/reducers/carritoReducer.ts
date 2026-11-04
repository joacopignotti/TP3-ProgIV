export type Producto = {
  id: number;
  nombre: string;
  precio: number;
};

export type ItemCarrito = {
  producto: Producto;
  cantidad: number;
};

type AccionCarrito =
  | { type: "AGREGAR"; producto: Producto }
  | { type: "RESTAR"; productoId: number }
  | { type: "ELIMINAR"; productoId: number };

export function carritoReducer(
  estado: ItemCarrito[],
  accion: AccionCarrito
): ItemCarrito[] {
  switch (accion.type) {
    case "AGREGAR": {
      const existe = estado.find(
        (item) => item.producto.id === accion.producto.id
      );

      if (existe) {
        return estado.map((item) =>
          item.producto.id === accion.producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...estado, { producto: accion.producto, cantidad: 1 }];
    }

    case "RESTAR":
      return estado
        .map((item) =>
          item.producto.id === accion.productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0);

    case "ELIMINAR":
      return estado.filter(
        (item) => item.producto.id !== accion.productoId
      );

    default:
      return estado;
  }
}


