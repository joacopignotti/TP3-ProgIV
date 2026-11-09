import { z } from 'zod';

export const ProductoSchema = z.object({
    id: z.number(),
    tipo: z.enum(['expreso', 'filtrado', 'pasteleria']),
    nombre: z.string(),
    tamano: z.string().optional(),
    gramos: z.number().optional(),
    variedad: z.string().optional(),
    precio: z.number(),
    origen: z.object({
      acidez: z.string(),
      cuerpo: z.string(),
      notas: z.string(),
    }).optional(),
});

export const ListadoProductosSchema = z.array(ProductoSchema);

export type Producto = z.infer<typeof ProductoSchema>;

export type EstadoMenu =
    | { status: 'cargando' }
    | { status: 'error'; mensaje: string }
    | { status: 'listo'; productos: Producto[] };