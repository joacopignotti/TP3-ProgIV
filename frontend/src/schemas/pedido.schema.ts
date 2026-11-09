import { z } from "zod";

export const ItemPedidoSchema = z.object({
  productoId: z.number().int().positive(),
  cantidad: z.number().int().positive(),
});

export const PedidoSchema = z.object({
  id: z.number().int().positive(),
  estado: z.enum(["pendiente", "entregado"]),
  total: z.number().nonnegative(),
  mesaId: z.number().int().positive().nullable(),
  items: z.array(ItemPedidoSchema),
});

export type Pedido = z.infer<typeof PedidoSchema>;
