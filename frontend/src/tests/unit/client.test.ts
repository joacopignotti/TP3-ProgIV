import { describe, it, expect, vi } from 'vitest';
import { obtenerProductos } from '../../api/client.ts';

describe('obtenerProductos', () => {
    it('debe retornar la lista de productos validada correctamente por Zod', async () => {
        const mockData = [
        { id: 1, tipo: 'expreso', nombre: 'Café Expreso', precio: 3000 }
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
        } as Response);

        const productos = await obtenerProductos();
        expect(productos).toEqual(mockData);
    });
});