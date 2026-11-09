# ☕ Cafetería Origen — Trabajo Práctico 3

**Programación IV — Tecnicatura Universitaria en Programación — UTN FRBB**

## Descripción del proyecto

Cafetería Origen es una aplicación web para realizar pedidos desde el menú de una cafetería. El cliente puede acceder mediante un código QR asociado a una mesa, elegir cafés y productos de pastelería, administrar un carrito, confirmar su pedido y consultar su estado sin recargar la página.

El proyecto está organizado en dos aplicaciones: un **frontend React + TypeScript** y una **API REST Node.js + Express + TypeScript**. Incluye validaciones, pruebas automatizadas, un flujo de trabajo con TDD, control de versiones con Git y ejecución con Docker Compose.

## Tecnologías utilizadas

| Área | Tecnologías |
|---|---|
| Backend | Node.js, Express, TypeScript, Vitest |
| Frontend | React, TypeScript (`strict`), Vite 7, Zod 4, Context API, `useReducer` |
| Estilos | Bootstrap 5 personalizado con SASS/SCSS y estilos CSS propios |
| Pruebas frontend | Vitest 3, React Testing Library, User Event, MSW 2 |
| Pruebas E2E | Playwright con Chromium |
| Herramientas | Git, GitHub, Docker, Docker Compose |

Los colores y variables de Bootstrap se definen en `frontend/src/styles/tema.scss` **antes** de importar Bootstrap. Se mantienen estilos propios para la identidad visual de la cafetería.

## Estructura general

```text
TP3-ProgIV/
├── backend/
│   ├── src/
│   │   ├── config/mesas.ts
│   │   ├── models/
│   │   ├── services/
│   │   └── routes/
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── e2e/cafeteria.e2e.spec.ts
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── reducers/
│   │   ├── schemas/
│   │   ├── styles/tema.scss
│   │   └── tests/
│   │       ├── unit/
│   │       ├── components/
│   │       └── integration/
│   ├── playwright.config.ts
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yaml
├── docker-compose.e2e.yaml
└── README.md
```

## Ejecución con Docker Compose

**Requisitos:** Docker Desktop iniciado y Docker Compose disponible.

Desde la raíz del repositorio:

```powershell
docker compose up --build -d
```

| Servicio | URL local |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |

Comandos útiles:

```powershell
docker compose ps          # Verificar servicios
docker compose logs -f     # Consultar registros
docker compose down        # Detener y quitar contenedores
```

Para probar el acceso por QR, abrir `http://localhost:5173/?mesa=4`. Sin el parámetro `mesa`, el pedido es **para retirar en barra**.

## Ejecución sin Docker

Se necesita Node.js y npm. En dos terminales distintas:

**Terminal 1 — Backend:**

```powershell
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend:**

```powershell
cd frontend
npm install
npm run dev
```

El cliente HTTP del frontend utiliza `VITE_API_URL` para localizar la API. Si no está definida, toma `http://localhost:3000`.

## Funcionalidades implementadas

### 1. Mesa desde código QR

- La URL `/?mesa=N` identifica la mesa y la muestra en el encabezado.
- Si falta `?mesa` o su valor no tiene un formato válido, la selección del frontend corresponde a **retiro en barra** (`mesaId: null`).
- Al confirmar, el backend valida que la mesa indicada exista en el inventario configurado. Las mesas inexistentes se rechazan con HTTP 400.

### 2. Menú obtenido desde la API

- Los productos se cargan con `GET /productos`.
- Durante la carga aparece un indicador.
- Ante errores de red, errores HTTP o una respuesta incompatible con el esquema Zod, se informa el problema y se ofrece un botón para reintentar.
- El estado del menú se modela como una unión discriminada: **cargando**, **error** o **listo**.

### 3. Personalización del café

- Bebida: **expreso** o **filtrado**.
- Tamaño: **Pocillo**, **Mediano** o **Taza grande**.
- Origen: **Colombia**, **Etiopía** o **Brasil**.
- Cada origen presenta su descripción (acidez, cuerpo y notas) y el precio que informa la API para la combinación elegida.
- El botón para agregar queda deshabilitado hasta completar las tres selecciones.

### 4. Pastelería

- Se ofrecen **muffin de chocolate** y **porción de torta selva negra**, con precios obtenidos de la API y botones para agregarlos al carrito.

### 5. Carrito

- Permite agregar productos, sumar y restar cantidades y eliminar ítems.
- Muestra cantidad, subtotal por ítem y un total **orientativo**.
- No permite confirmar pedidos con el carrito vacío.
- Se implementa con **React Context API** y un **reducer puro**.

### 6. Confirmación del pedido

- Se envía `POST /pedidos` con `mesaId` (opcional) y la lista de ítems.
- Cuando la API responde correctamente, se muestran el **número de pedido**, **estado** y **total definitivo** devueltos por el servidor.
- El carrito se vacía únicamente después de la confirmación exitosa.

### 7. Seguimiento del pedido

- Después de confirmar, el cliente puede consultar `GET /pedidos/:id` desde la misma pantalla.
- La interfaz actualiza la información del pedido **sin recargar la página**.
- El botón consulta el estado actual; no modifica por sí mismo el estado en el backend.

### 8. Manejo de errores

- Si la API rechaza el pedido, se muestra el mensaje informado por el servidor.
- Los ítems del carrito se conservan para permitir la corrección o el reintento.

### 9. Diseño para celular

- La interfaz está preparada para pantallas móviles de **375 px** de ancho.
- Se verificó visualmente el menú y se comprobó ausencia de desplazamiento horizontal en la vista probada. Conviene repetir esta comprobación con el carrito y la confirmación visibles.

## Contrato HTTP de la API

**Dirección local de referencia:** `http://localhost:3000`.

| Método y ruta | Uso | Resultado esperado |
|---|---|---|
| `GET /productos` | Consultar catálogo | `200`, listado de productos |
| `GET /productos/:id` | Consultar un producto | `200`, producto; `404` si no existe |
| `POST /pedidos` | Confirmar un pedido | `201`, pedido creado; `400` si los datos son inválidos |
| `GET /pedidos/:id` | Consultar estado y detalle | `200`, pedido; `404` si no existe |

### Productos

Cada producto expone su **tipo** (`expreso`, `filtrado` o `pasteleria`) y **precio** calculado por el backend mediante la lógica del dominio. El frontend no recalcula esos precios.

Ejemplo ilustrativo de producto de café:

```json
{
  "id": 5,
  "tipo": "expreso",
  "nombre": "Expreso Mediano",
  "tamanio": "Mediano",
  "gramosCafe": 27,
  "variedad": {
    "nombre": "Colombia",
    "descripcion": "Acidez media, cuerpo equilibrado y notas cítricas y florales"
  },
  "precio": 7360
}
```

### Confirmación — `POST /pedidos`

Ejemplo de cuerpo para la mesa 4:

```json
{
  "mesaId": 4,
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ]
}
```

Para **retiro en barra**, `mesaId` puede omitirse o enviarse como `null`. El servidor asigna el identificador, calcula el total y crea el pedido con estado inicial **`pendiente`**. No se debe enviar ni calcular el total definitivo desde el frontend.

### Seguimiento — `GET /pedidos/:id`

Devuelve los datos del pedido solicitado, incluyendo su **identificador**, **estado**, **ítems**, **total** y **mesa** cuando corresponde. El frontend valida la respuesta con Zod antes de utilizarla.

### Errores

Las respuestas de error utilizan el formato:

```json
{ "error": "mensaje descriptivo" }
```

- Solicitudes inválidas, ítems incorrectos o mesa inexistente: **HTTP 400**.
- Recursos no encontrados: **HTTP 404**.
- Fallos inesperados del servidor: **HTTP 500**.

Los mensajes de error se presentan al cliente sin borrar el carrito.

### Mesas válidas

La validación está en `backend/src/config/mesas.ts`.

- Sin configuración adicional, la aplicación usa un **inventario de demostración de las mesas 1 a 20**.
- La variable de entorno `MESAS_VALIDAS` permite definir otra lista de mesas, separadas por comas (por ejemplo, `MESAS_VALIDAS=1,2,3,4,7,10`).
- Una mesa fuera del inventario se rechaza al crear el pedido. Este inventario de ejemplo debe adaptarse si el proyecto se utiliza en un establecimiento real.

### Persistencia

En esta versión del TP3, los pedidos se conservan **en memoria del backend**. Al reiniciar el proceso o el contenedor, se pierden los pedidos anteriores. No hay base de datos persistente en este alcance.

## Estrategia de testing

Se utilizan pruebas unitarias, de componentes, de integración y End-to-End (E2E).

### Tests del backend

Desde `backend/`:

```powershell
npm test
npm run build
```

Los tests comprueban reglas de negocio y endpoints, incluyendo validaciones de pedidos, productos y mesas.

### Tests del frontend

Desde `frontend/`:

```powershell
npx vitest run
npm run build
```

Los tests de componentes utilizan React Testing Library y User Event. Los tests de integración utilizan **MSW 2** (`http` y `HttpResponse`) para simular HTTP sin depender del backend.

Se verifican, entre otros escenarios:

- Carga correcta del menú, errores HTTP, fallos de conexión y respuestas inválidas para Zod.
- Selección de café, pastelería y operaciones del carrito.
- Confirmación correcta de pedidos y datos enviados a la API.
- Conservación del carrito cuando la API rechaza un pedido.
- Lectura de `?mesa=4`, confirmación y consulta posterior de `GET /pedidos/:id`.

### Tests End-to-End con Playwright

El archivo `frontend/e2e/cafeteria.e2e.spec.ts` prueba el sistema con **navegador real y API real**.

Los dos escenarios implementados son:

1. **Recorrido feliz:** acceso a la mesa 4, selección de productos, carrito y confirmación del pedido.
2. **Carrito vacío:** comprobación de que no se permite confirmar sin productos.

Los E2E requieren el backend en **modo de pruebas** (`NODE_ENV=test`), porque antes de cada escenario utilizan `POST /__test__/reset` y `POST /__test__/seed` para disponer de datos reproducibles. Estos endpoints no deben habilitarse en un entorno normal o de producción.

**Ejecución verificada en Windows/PowerShell:**

Desde la raíz del repositorio:

```powershell
docker compose -f docker-compose.yaml -f docker-compose.e2e.yaml up --build -d
```

Luego, desde `frontend/`:

```powershell
cd frontend
npx playwright install chromium
npx playwright test
```

Opcionalmente:

```powershell
npx playwright show-report
npx playwright test --ui
```

Para restaurar el entorno normal al terminar, desde la raíz:

```powershell
cd ..
docker compose down
docker compose up --build -d
```

### Resultados comprobados antes de la entrega

| Suite | Herramientas | Resultado |
|---|---|---:|
| Backend unitarios e integración | Vitest | **127 aprobados** |
| Frontend unitarios, componentes e integración | Vitest + Testing Library + MSW 2 | **40 aprobados** |
| E2E en navegador | Playwright + Chromium | **2 aprobados** |
| **Total** | | **169 aprobados** |

También se verificó que `npm run build` finaliza correctamente en **backend** y **frontend**, y que ambos servicios levantan con Docker Compose. Las advertencias de deprecación de SASS/Bootstrap no impidieron compilar. Durante `npm ci` se informaron vulnerabilidades de dependencias que requieren revisión por separado.

## Desarrollo guiado por tests (TDD)

Se siguió el ciclo **ROJO → VERDE → REFACTOR**:

1. **ROJO:** escribir un test que falle porque la funcionalidad todavía no está implementada.
2. **VERDE:** agregar el código mínimo necesario para aprobarlo.
3. **REFACTOR:** mejorar la estructura manteniendo los tests en verde.

Ejemplo documentado para la confirmación de pedidos:

| Etapa | Commit |
|---|---|
| ROJO | `574520a` |
| VERDE | `0208db6` |
| REFACTOR | `e74017d` |

Durante el refactor se separaron las responsabilidades del contexto del carrito, su proveedor y el hook `useCarrito`.

## Control de versiones

El equipo trabaja con Git y GitHub, utilizando ramas de desarrollo y Pull Requests para integrar cambios en `dev`.

La rama `MateoBarrera` incorpora ajustes del menú QR, contrato de API, Bootstrap con SASS, validación de mesas y pruebas; entre ellos, el commit `2c93689`.

## Alcance y observaciones

- La aplicación está enfocada en la **vista del cliente**. No incluye un panel de administración para el dueño del café; no es un requisito de las nueve funcionalidades del menú.
- La consulta del estado muestra la información almacenada por el backend; si no existe un proceso que cambie el estado, el pedido permanecerá como `pendiente`.
- El carrito calcula importes orientativos, mientras que el **total confirmado** siempre proviene de la API.
- La validación de mesas utiliza un inventario de demostración configurable.
