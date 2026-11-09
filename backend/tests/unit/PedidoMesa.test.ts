
import { describe, it, expect } from 'vitest';
import { Pedido } from '../../src/models/Pedido.js';

describe('Pedido con mesa', () => {
  const items = [{ productoId: 1, cantidad: 2 }];

  it('debería guardar el mesaId recibido', () => {
    const pedido = new Pedido(1, items, 'pendiente', 10040, 4);

    expect(pedido.mesaId).toBe(4);
  });

  it('debería tener mesaId null si no se indica mesa (retiro en la barra)', () => {
    const pedido = new Pedido(1, items, 'pendiente', 10040);

    expect(pedido.mesaId).toBeNull();
  });

  it('debería incluir el mesaId en el JSON', () => {
    const pedido = new Pedido(1, items, 'pendiente', 10040, 4);

    expect(pedido.toJSON()).toEqual({
      id: 1,
      items,
      estado: 'pendiente',
      total: 10040,
      mesaId: 4,
    });
  });
});
