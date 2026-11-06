import { z } from 'zod';

export const VariedadSchema = z.object({
    nombre: z.string(),
    descripcion: z.string(),
});

    export const ProductoSchema = z.object({
    id: z.number(),
    tipo: z.enum(['expreso', 'filtrado', 'pasteleria']),
    nombre: z.string(),
    tamanio: z.string().optional(),
    gramosCafe: z.number().optional(),
    variedad: VariedadSchema.optional(),
    precio: z.number(),
});

export const ListadoProductosSchema = z.array(ProductoSchema);

export type Producto = z.infer<typeof ProductoSchema>;
export type Variedad = z.infer<typeof VariedadSchema>;