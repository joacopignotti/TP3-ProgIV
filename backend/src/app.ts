import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { crearCatalogo } from "./data/catalogo.js";
import { NotFoundError, ValidationError } from "./errors/index.js";
import { makePedidosRouter } from "./routes/pedidos.js";
import { makeProductosRouter } from "./routes/productos.js";
import { makeReportesRouter } from "./routes/reportes.js";
import { PedidoService } from "./services/PedidoService.js";
import { ProductoService } from "./services/ProductoService.js";
import { ReporteService } from "./services/ReporteService.js";

const manejarErrores: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ValidationError) res.status(400).json({ error: err.message });
  else if (err instanceof NotFoundError) res.status(404).json({ error: err.message });
  else if (err instanceof SyntaxError) res.status(400).json({ error: "JSON inválido" });
  else res.status(500).json({ error: "Error interno del servidor" });
};

export function crearApp() {
  const productoService = new ProductoService(crearCatalogo());
  const pedidoService = new PedidoService(productoService);
  const reporteService = new ReporteService(pedidoService, productoService);
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/productos", makeProductosRouter(productoService));
  app.use("/pedidos", makePedidosRouter(pedidoService));
  app.use("/reportes", makeReportesRouter(reporteService));

  // Sólo disponibles durante pruebas; nunca en el modo normal de Docker.
  if (process.env.NODE_ENV === "test") {
    app.post("/__test__/reset", (_req, res) => {
      pedidoService.limpiar();
      res.sendStatus(204);
    });
    app.post("/__test__/seed", (_req, res) => {
      pedidoService.crear([{ productoId: 1, cantidad: 2 }], null);
      pedidoService.crear([{ productoId: 19, cantidad: 1 }], 4);
      res.status(201).json({ message: "Datos de prueba creados" });
    });
  }
  app.use(manejarErrores);
  return app;
}
