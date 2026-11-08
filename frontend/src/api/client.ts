import {
  ListadoProductosSchema,
  type Producto,
} from "../schemas/producto.schema";

import {
  PedidoSchema,
  type Pedido,
} from "../schemas/pedido.schema";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function solicitar(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    const data: unknown = await response.json().catch(() => ({}));
    const mensaje =
      typeof data === "object" && data !== null && "error" in data &&
      typeof data.error === "string" ? data.error :
      typeof data === "object" && data !== null && "message" in data &&
      typeof data.message === "string" ? data.message :
      `Error HTTP ${response.status}`;
    throw new Error(mensaje);
  }
  return response.json() as Promise<unknown>;
}

export async function obtenerProductos(): Promise<Producto[]> {
  const resultado = ListadoProductosSchema.safeParse(await solicitar("/productos"));
  if (!resultado.success) {
    throw new Error("La respuesta de la API no cumple el contrato esperado");
  }
  return resultado.data;
}

export type ItemPedido = { productoId: number; cantidad: number };
export type CrearPedidoRequest = { items: ItemPedido[]; mesaId: number | null };
export type PedidoCreado = Pedido;

function validarPedido(data: unknown): Pedido {
  const resultado = PedidoSchema.safeParse(data);
  if (!resultado.success) {
    throw new Error("La respuesta del pedido no cumple el contrato esperado");
  }
  return resultado.data;
}

export async function crearPedido(pedido: CrearPedidoRequest): Promise<Pedido> {
  return validarPedido(await solicitar("/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido),
  }));
}

export async function obtenerPedido(id: number): Promise<Pedido> {
  return validarPedido(await solicitar(`/pedidos/${id}`));
}
