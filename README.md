# Cafetería Origen — Menú de Mesa (TP3)

Aplicación web para la toma de pedidos en mesa mediante escaneo de código QR en la Cafetería Origen. El proyecto incluye la actualización del Backend REST desarrollado en el Parcial I e implementa el Frontend en React utilizando Vite, TypeScript y una suite de pruebas automatizadas siguiendo la metodología TDD (Rojo -> Verde -> Refactor).

## Stack Tecnológico

* Node.js (v20.12.2 / v20+)
* TypeScript (modo estricto, "strict": true)
* Backend: Express, SQLite
* Frontend: React, Vite (v7), SASS, Bootstrap
* Validación: Zod (v4)
* Testing Unitario y Componentes: Vitest (v3), React Testing Library, jsdom (v25.0.1)
* Testing de Integración: MSW (v2)
* Testing End-to-End: Playwright

## Instalación

1. Clonar el repositorio e ingresar a la carpeta raíz del proyecto.
2. Instalar dependencias en el backend:
   ```bash
   cd backend
   npm install
   ```
3. Instalar dependencias en el frontend:
   ```bash
   cd ../frontend
   npm install
   ```

## Ejecución en Desarrollo

### Servidor Backend
Desde la carpeta `backend`:
```bash
npm run dev
```
El backend quedará escuchando en `http://localhost:3000`.

### Cliente Frontend
Desde la carpeta `frontend`:
```bash
npm run dev
```
La aplicación web se ejecutará en `http://localhost:5173`.

---

## Comandos de Testing

### Frontend (`/frontend`)

* `npm test`: Ejecuta la suite completa de pruebas unitarias, de componentes e integración mediante Vitest en una sola pasada (sin requerir el backend levantado).
* `npm run test:watch`: Ejecuta Vitest en modo interactivo (watch).
* `npm run test:e2e`: Ejecuta las pruebas End-to-End con Playwright sobre frontend y backend reales.

### Backend (`/backend`)

* `npm test`: Ejecuta los tests unitarios y de integración del servidor HTTP.

---

## Estructura del Proyecto

```text
TP3-ProgIV/
├── backend/
│   ├── src/
│   │   ├── data/            # Datos en memoria (catalogo.ts)
│   │   ├── models/          # Modelos de dominio (Producto, Cafe, Pedido, etc.)
│   │   ├── routes/          # Rutas y controladores (productos, pedidos, reportes)
│   │   ├── services/        # Lógica de negocio (ProductoService, PedidoService)
│   │   └── app.ts           # Configuración de Express y CORS
│   └── tests/               # Tests unitarios, integración y e2e del backend
└── frontend/
    ├── src/
    │   ├── api/             # Cliente HTTP centralizado (client.ts)
    │   ├── components/      # Componentes UI (SelectorCafe, Pasteleria, Carrito)
    │   ├── context/         # Estado global (CarritoContext.tsx)
    │   ├── reducers/        # Lógica del estado (carritoReducer.ts)
    │   ├── schemas/         # Validación de contratos Zod (producto.schema.ts)
    │   ├── utils/           # Funciones puras (mesa.ts, format.ts)
    │   └── tests/           # Suite de pruebas frontend
    │       ├── unit/        # Pruebas unitarias de funciones puras y reducers
    │       ├── components/  # Pruebas de renderizado e interacción de componentes
    │       └── integration/ # Pruebas de integración con MSW 2
    └── e2e/                 # Pruebas End-to-End con Playwright
```

---

## Contrato de la API

La comunicación entre el Frontend y el Backend se rige por las siguientes especificaciones y esquemas de validación Zod.

### 1. Obtener Productos
* Endpoint: `GET /productos`
* Respuesta `200 OK`: Arreglo de productos.

Ejemplo de respuesta:
```json
[
  {
    "id": 5,
    "tipo": "expreso",
    "nombre": "Expreso Mediano",
    "tamano": "Mediano",
    "gramos": 27,
    "variedad": "Colombia",
    "precio": 7360
  },
  {
    "id": 19,
    "tipo": "pasteleria",
    "nombre": "Muffin de chocolate",
    "precio": 2500
  }
]
```

Esquema Zod de validación en Frontend:
```typescript
import { z } from 'zod';

export const ProductoSchema = z.object({
  id: z.number(),
  tipo: z.enum(['expreso', 'filtrado', 'pasteleria']),
  nombre: z.string(),
  tamano: z.string().optional(),
  gramos: z.number().optional(),
  variedad: z.string().optional(),
  precio: z.number()
});

export const ListadoProductosSchema = z.array(ProductoSchema);

export type Producto = z.infer<typeof ProductoSchema>;
```

### 2. Crear Pedido
* Endpoint: `POST /pedidos`
* Cuerpo de la petición (`mesaId` opcional, si no se envía o es inválido equivale a retiro por barra):
```json
{
  "mesaId": 4,
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ]
}
```
* Respuesta `201 Created`:
```json
{
  "id": 102,
  "mesaId": 4,
  "estado": "pendiente",
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ],
  "total": 17220
}
```

### 3. Consultar Estado de Pedido
* Endpoint: `GET /pedidos/:id`
* Respuesta `200 OK`:
```json
{
  "id": 102,
  "mesaId": 4,
  "estado": "en_preparacion",
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ],
  "total": 17220
}
```

### 4. Formato Estándar de Errores
Cualquier error devuelto por la API responde con código HTTP 4xx o 5xx y la siguiente estructura JSON:
```json
{
  "error": "Mensaje descriptivo del error"
}
```

---

## Flujo de Trabajo TDD y Commits

El desarrollo de cada funcionalidad respeta estrictamente el ciclo Red -> Green -> Refactor:
1. **Commit Rojo:** Contiene la prueba automatizada que falla antes de implementar la funcionalidad.
   * Ejemplo: `test: agrega prueba unitaria para lectura de mesa desde url (rojo)`
2. **Commit Verde:** Contiene el código fuente que hace pasar la prueba en verde.
   * Ejemplo: `feat: implementa obtencion de mesa desde parametros url (verde)`