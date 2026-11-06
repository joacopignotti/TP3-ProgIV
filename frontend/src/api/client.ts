import { ListadoProductosSchema, Producto } from '../schemas/producto.schema';

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