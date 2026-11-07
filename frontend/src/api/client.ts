import { ListadoProductosSchema, type Producto } from '../schemas/producto.schema';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function obtenerProductos(): Promise<Producto[]> {
    const response = await fetch(`${API_BASE_URL}/productos`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al cargar los productos');
    }

    const rawData = await response.json();
    const resultado = ListadoProductosSchema.safeParse(rawData);

    if (!resultado.success) {
        throw new Error('La respuesta de la API no cumple el contrato esperado');
    }

    return resultado.data;
}

export type ItemPedido = {
  productoId: number;
  cantidad: number;
};

export type CrearPedidoRequest = {
  items: ItemPedido[];
  mesaId: number | null;
};

export type PedidoCreado = {
  id: number;
  estado: string;
  total: number;
  mesaId: number | null;
};

export async function crearPedido(
  pedido: CrearPedidoRequest
): Promise<PedidoCreado> {
  const response = await fetch(`${API_BASE_URL}/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pedido),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      typeof errorData.error === "string"
        ? errorData.error
        : typeof errorData.message === "string"
          ? errorData.message
          : "No se pudo confirmar el pedido"
    );
  }

  return (await response.json()) as PedidoCreado;
}
