import { z } from 'zod';

export const ProductoSchema = z.object({
    id: z.number(),
    tipo: z.enum(['expreso', 'filtrado', 'pasteleria']),
    nombre: z.string(),
    tamano: z.string().optional(),
    gramos: z.number().optional(),
    variedad: z.string().optional(),
    precio: z.number(),
});

export const ListadoProductosSchema = z.array(ProductoSchema);

export type Producto = z.infer<typeof ProductoSchema>;
