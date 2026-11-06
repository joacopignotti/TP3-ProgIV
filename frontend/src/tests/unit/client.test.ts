import { describe, it, expect, vi } from 'vitest';
import { obtenerProductos } from '../../api/client.ts';

describe('obtenerProductos', () => {
    it('devuelve los productos cuando la API responde correctamente', async () => {
        const mockProductos = [
        {
            id: 5,
            tipo: 'expreso',
            nombre: 'Expreso Mediano',
            precio: 7360,
        },
        ];

        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProductos,
        }));

        const resultado = await obtenerProductos();
        expect(resultado).toEqual(mockProductos);
    });
});