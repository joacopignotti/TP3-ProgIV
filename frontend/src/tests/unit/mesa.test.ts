import { describe, it, expect } from 'vitest';
import { obtenerMesaDesdeURL } from '../../utils/mesa.ts';

describe('obtenerMesaDesdeURL', () => {
    it('devuelve el número de mesa si la query es válida', () => {
        expect(obtenerMesaDesdeURL('?mesa=4')).toBe(4);
    });

    it('devuelve null si no existe la query mesa (retiro en barra)', () => {
        expect(obtenerMesaDesdeURL('')).toBeNull();
    });

    it('devuelve null si la mesa es inválida o negativa', () => {
        expect(obtenerMesaDesdeURL('?mesa=abc')).toBeNull();
        expect(obtenerMesaDesdeURL('?mesa=-2')).toBeNull();
    });
});