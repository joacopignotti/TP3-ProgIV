/**
 * Mesas habilitadas para el TP3. Si se define MESAS_VALIDAS, usar una
 * lista separada por comas (ejemplo: "1,2,3,4,7,10").
 * En ausencia de configuración se usa un INVENTARIO DE DEMOSTRACIÓN de 20 mesas.
 * Ajustar esta lista a las mesas reales antes de una instalación comercial.
 */
const mesasDemo = Array.from({ length: 20 }, (_, i) => i + 1);

export function obtenerMesasValidas(): ReadonlySet<number> {
  const configuracion = process.env.MESAS_VALIDAS;
  if (configuracion === undefined || configuracion.trim() === "") {
    return new Set(mesasDemo);
  }
  const numeros = configuracion.split(",").map((x) => Number(x.trim()));
  if (numeros.some((n) => !Number.isSafeInteger(n) || n < 1)) {
    throw new Error("MESAS_VALIDAS debe contener números enteros positivos separados por comas");
  }
  return new Set(numeros);
}
