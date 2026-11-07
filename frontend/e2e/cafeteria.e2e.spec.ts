import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';

test.beforeEach(async ({ request }) => {
    const resetRes = await request.post(`${API_URL}/__test__/reset`);
    expect(resetRes.ok()).toBeTruthy();

    const seedRes = await request.post(`${API_URL}/__test__/seed`);
    expect(seedRes.ok()).toBeTruthy();
    });

    test.describe('Flujo E2E - Cafetería Origen', () => {
    test('Recorrido feliz: selección de productos, carrito y confirmación de pedido', async ({ page }) => {
        // 1. Navegar simulando Mesa 4
        await page.goto('/?mesa=4');

        // 2. Esperar a que la app y los productos carguen
        await expect(page.getByRole('heading', { name: /cafetería origen/i })).toBeVisible();

        // 3. Seleccionar Bebida y Tamaño
        await page.getByRole('combobox', { name: /bebida/i }).selectOption({ index: 1 });
        await page.getByRole('combobox', { name: /tamaño/i }).selectOption({ index: 1 });

        // 4. Seleccionar Origen (Radio button de Colombia)
        const radioColombia = page.getByLabel(/colombia/i).or(page.getByRole('radio', { name: /colombia/i }));
        await radioColombia.first().check();

        // 5. Agregar el café seleccionado
        await page.getByRole('button', { name: 'Agregar', exact: true }).click();

        // 6. Agregar un producto de pastelería
        const btnAgregarPasteleria = page.getByRole('button', { name: /agregar al carrito/i }).first();
        await btnAgregarPasteleria.click();

        // 7. Confirmar pedido en el carrito
        const btnConfirmar = page.getByRole('button', { name: /confirmar pedido/i });
        await expect(btnConfirmar).toBeEnabled();
        await btnConfirmar.click();

        // 8. Validar mensaje de éxito
        await expect(page.getByText(/pedido confirmado/i)).toBeVisible();
    });

    test('Caso de error: no permite confirmar si el carrito está vacío', async ({ page }) => {
        await page.goto('/?mesa=4');

        await expect(page.getByText(/tu carrito está vacío/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /confirmar pedido/i })).not.toBeAttached();
    });
});