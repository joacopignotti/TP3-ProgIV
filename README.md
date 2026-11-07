# ☕ Cafetería Origen — Trabajo Práctico 3

**Programación IV — Tecnicatura Universitaria en Programación**

## Descripción del proyecto

Cafetería Origen es una aplicación web que permite consultar el menú de una cafetería, seleccionar productos, agregarlos a un carrito y confirmar pedidos.

El sistema está dividido en un frontend desarrollado con React y TypeScript y una API REST desarrollada con Node.js, Express y TypeScript.

El proyecto incorpora pruebas automatizadas, desarrollo guiado por tests (TDD), validación de datos, control de versiones con Git y ejecución mediante Docker Compose.

## Tecnologías utilizadas

### Backend

* Node.js

* Express

* TypeScript

* Vitest

* API REST

### Frontend

* React

* TypeScript

* Vite

* Zod

* React Context API

* `useReducer`

### Testing

* Vitest

* React Testing Library

* Testing Library User Event

* MSW 2 (Mock Service Worker)

* Playwright (pruebas E2E)

### Herramientas

* Git y GitHub

* Docker

* Docker Compose

## Estructura general

```
TP3-ProgIV/
├── backend/
│   ├── src/
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── e2e/
│   │   └── cafeteria.e2e.spec.ts
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── reducers/
│   │   ├── schemas/
│   │   └── tests/
│   │       ├── unit/
│   │       ├── components/
│   │       └── integration/
│   ├── playwright.config.ts
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── docker-compose.yaml
└── README.md

```

## Ejecución con Docker Compose

Esta es la forma recomendada de levantar la aplicación completa en un entorno local.

### Requisitos

* Docker Desktop instalado y en ejecución.

* Docker Compose disponible.

### Levantar la aplicación

Desde la raíz del proyecto:

```
docker compose up --build -d

```

El comando construye y levanta dos contenedores:

| Servicio | Tecnología | Dirección | 
| ----- | ----- | ----- | 
| Backend | Express + TypeScript | http://localhost:3000 | 
| Frontend | React + Vite | http://localhost:5173 | 

### Verificar los contenedores

```
docker compose ps

```

### Consultar los registros

```
docker compose logs -f

```

### Detener la aplicación

```
docker compose down

```

### Comprobación

Al abrir `http://localhost:5173`, el usuario puede consultar el menú, agregar productos al carrito y confirmar un pedido.

La API se encuentra disponible en `http://localhost:3000`.

El endpoint `GET /productos` devuelve un catálogo de 20 productos en la configuración comprobada durante el desarrollo.

## Ejecución sin Docker

### Backend

Desde la carpeta `backend`:

```
npm install
npm run dev

```

La API quedará disponible en `http://localhost:3000`.

### Frontend

Desde la carpeta `frontend`:

```
npm install
npm run dev

```

Abrir:

`http://localhost:5173`

El cliente HTTP utiliza la variable de entorno `VITE_API_URL`. Si no está definida, utiliza:

`http://localhost:3000`

## Funcionalidades implementadas

### Menú

* Consultar los productos disponibles mediante `GET /productos`.

* Visualizar cafés expresos, cafés filtrados y productos de pastelería.

* Seleccionar bebida, tamaño y origen del café.

* Mostrar estados de carga, éxito y error.

* Validar la respuesta de la API mediante Zod (discriminated unions).

### Carrito

* Agregar productos.

* Aumentar cantidades.

* Disminuir cantidades.

* Eliminar productos.

* Calcular el total orientativo.

* Conservar los productos cuando la confirmación del pedido falla.

* Vaciar el carrito cuando el pedido se confirma correctamente.

### Pedidos

* Enviar pedidos mediante `POST /pedidos`.

* Enviar los identificadores de productos y sus cantidades.

* Permitir pedidos para retiro en barra o asignación de mesa (`mesaId`).

* Mostrar confirmación cuando el servidor acepta el pedido.

* Mostrar mensajes de error cuando la API rechaza la solicitud.

* Permitir reintentar después de un error HTTP 400 o 500.

## Contrato HTTP utilizado por el frontend

### GET /productos

Obtiene el catálogo de productos disponibles.

**Respuesta exitosa:** HTTP 200 con un arreglo de productos.

El frontend valida la estructura de la respuesta mediante `ListadoProductosSchema` de Zod.

### POST /pedidos

Permite registrar un pedido.

**Ejemplo de solicitud:**

```
{
  "items": [
    {
      "productoId": 1,
      "cantidad": 2
    }
  ],
  "mesaId": 4
}

```

**Respuesta exitosa:** HTTP 201 con los datos del pedido creado.

**Posibles errores:** solicitudes inválidas (HTTP 400) o errores internos del servidor (HTTP 500).

En caso de error, el frontend informa el problema y conserva los productos del carrito.

### GET /pedidos/:id

Permite consultar un pedido por su identificador.

La estructura exacta de respuesta y los códigos de error se mantienen sincronizados con la implementación del backend.

## Estrategia de testing

El proyecto utiliza pruebas automatizadas para verificar el comportamiento de las distintas partes de la aplicación.

### 1. Tests unitarios

Se utilizan para comprobar funciones y reglas de negocio de forma aislada.

Entre las funcionalidades verificadas en el frontend se encuentran:

* Agregar productos al carrito.

* Aumentar y disminuir cantidades.

* Eliminar productos.

* Calcular el total.

* Validaciones y utilidades del frontend (manejo de mesa y estado de cliente).

### 2. Tests de componentes

Se utilizan React Testing Library y Vitest para verificar la interfaz y las interacciones del usuario.

Se prueban componentes como:

* `App`

* `Carrito`

* `CarritoContext`

* `SelectorCafe`

* `Pasteleria`

### 3. Tests de integración — MSW 2

Se utiliza MSW 2 para interceptar solicitudes HTTP y simular respuestas de la API sin necesitar el backend en ejecución.

**Integración del menú:**

1. Carga exitosa de productos mediante HTTP 200.

2. Manejo de un error HTTP 500.

3. Manejo de errores de conexión.

4. Rechazo de respuestas que incumplen el contrato de Zod.

**Integración de pedidos:**

1. Confirmación exitosa de un pedido mediante HTTP 201.

2. Verificación de los identificadores y cantidades enviados.

3. Conservación del carrito ante un error HTTP 400.

4. Reintento de confirmación después de un error HTTP 500.

### 4. Tests End-to-End — Playwright

Las pruebas End-to-End están ubicadas en `frontend/e2e/cafeteria.e2e.spec.ts` para evitar colisiones con el runner de Vitest. Se conectan contra la API REST real del backend para verificar el flujo completo del cliente.

**Preparación del entorno de pruebas:**
En el gancho `beforeEach`, el test interactúa directamente con los endpoints de prueba de la API (`POST /__test__/reset` y `POST /__test__/seed`) para garantizar un estado limpio e idéntico antes de cada escenario.

**Escenarios implementados:**

1. **Flujo feliz:** Simula el ingreso mediante código QR en la Mesa 4 (`/?mesa=4`), valida el encabezado de la cafetería, configura un café expreso mediano de origen Colombia, agrega productos de pastelería, verifica el resumen en el carrito y efectúa la confirmación exitosa del pedido.

2. **Validación de carrito vacío:** Verifica que si el usuario navega a la mesa sin ítems seleccionados, el sistema inhabilite y no adjunte el botón de confirmación de pedido.

**Ejecución de los tests E2E:**

1. Asegurar que el backend esté ejecutándose en `http://localhost:3000`:

   ```
   cd backend
   npm run dev
   
   ```

2. Desde la carpeta `frontend`, ejecutar Playwright:

   ```
   npx playwright test
   
   ```

3. (Opcional) Ejecutar en modo interfaz gráfica interactiva:

   ```
   npx playwright test --ui
   
   ```

### Resumen de resultados de pruebas

| Tipo de pruebas | Herramienta | Resultado | 
| ----- | ----- | ----- | 
| Pruebas Unitarias | Vitest | Aprobadas | 
| Componentes de UI | React Testing Library + Vitest | Aprobadas | 
| Integración (API Mocks) | MSW 2 + Vitest | 7 aprobadas | 
| Pruebas End-to-End (E2E) | Playwright | 2 aprobadas | 
| **Total Suite Frontend** | **Vitest + Playwright** | **40 pruebas aprobadas (100%)** | 

### Ejecutar las pruebas del frontend

Desde la carpeta `frontend`:

```
npm test

```

Ejecutar únicamente los tests de integración del menú:

```
npx vitest run src/tests/integration/Menu.integration.test.tsx

```

Ejecutar únicamente los tests de integración de pedidos:

```
npx vitest run src/tests/integration/Pedido.integration.test.tsx

```

### Verificar la compilación

```
npm run build

```

Este comando ejecuta las comprobaciones de TypeScript y genera la versión de producción mediante Vite.

## Desarrollo guiado por tests (TDD)

Durante el desarrollo se utilizó el ciclo:

**ROJO → VERDE → REFACTOR**

* **ROJO:** escribir un test que falle porque todavía no existe la funcionalidad.

* **VERDE:** implementar el código necesario para que el test apruebe.

* **REFACTOR:** mejorar la estructura sin modificar el comportamiento.

### Ejemplo: confirmación de pedidos

Se trabajó mediante commits independientes:

| Etapa | Commit | 
| ----- | ----- | 
| ROJO | `574520a` | 
| VERDE | `0208db6` | 
| REFACTOR | `e74017d` | 

En el refactor se separaron las responsabilidades del contexto del carrito, el proveedor y el hook `useCarrito`, manteniendo los tests aprobados.

## Control de versiones

El proyecto utiliza Git y GitHub para gestionar los cambios.

Los desarrollos se realizan en ramas de trabajo y se integran mediante Pull Requests.

La rama compartida de integración del equipo es `dev`.

## Verificación funcional realizada

Durante la verificación final se comprobó que:

* Ambos contenedores de Docker Compose se construyen y ejecutan simultáneamente.

* El backend responde correctamente a `GET /productos`.

* El frontend muestra el catálogo obtenido desde Express con tipado en discriminated unions.

* El usuario puede agregar y modificar productos en el carrito.

* Un pedido se confirma correctamente contra la API real.

* Las 38 pruebas unitarias/componentes/integración (Vitest/MSW 2) aprueban al 100%.

* Las 2 pruebas E2E (Playwright) aprueban al 100%.

* La compilación de producción (`npm run build`) finaliza sin errores de TypeScript.
