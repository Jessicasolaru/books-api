import express, { urlencoded } from "express";
import cors from "cors";
import { env } from "../../config/env.config.js";
import { Logger } from "../../utils/logger.js";
import { httpLogger } from "../../middleware/logger.middleware.js";
import { errorHandler } from "../../middleware/error.middleware.js";
import { DB } from "../db/DB.service.js";
import bookRouter from "../../routes/book.routes.js";
import authorRouter from "../../routes/author.routes.js";

const { server } = env;

export class Server {
  static app = express();
  static environment = server.environment;
  static port = server.port;
  static logger = new Logger("SERVER");

  static async bootstrap(config = {}) {
    server.environment === "PROD"
      ? this.logger.info("Servidor inicializando en Producción")
      : this.logger.info("Servidor inicializando en modo Desarrollo");

    // Habilita CORS para todas las rutas
    this.app.use(cors());

    // Permite recibir JSON en el body de las peticiones
    this.app.use(express.json());

    if (config.multiFormat) {
      this.logger.info("Habilitando form-urlencoded");
      this.app.use(urlencoded({ extended: true }));
    }

    if (config.loggerPerformance) {
      this.logger.info("Habilitando logger de performance HTTP");
      this.app.use(httpLogger);
    }

    // Rutas de la API
    this.app.use("/api/v1", bookRouter);
    this.app.use("/api/v1", authorRouter);

    // Middleware de manejo de errores (siempre al final)
    this.app.use(errorHandler);

    try {
      await DB.init();
      this.app.listen(this.port, () => {
        this.logger.info(
          `✅ Servidor corriendo en http://localhost:${this.port}`,
        );
      });
    } catch (error) {
      this.logger.error(`Error al inicializar el servidor: ${error.message}`);
      throw new Error("Error al arrancar el servidor");
    }
  }
}
