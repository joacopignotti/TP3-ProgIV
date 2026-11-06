export function obtenerMesaDesdeURL(searchParams: string): number | null {
    const params = new URLSearchParams(searchParams);
    const mesa = params.get('mesa');
    if (!mesa) return null;
    const num = Number(mesa);
    return Number.isInteger(num) && num > 0 ? num : null;
}