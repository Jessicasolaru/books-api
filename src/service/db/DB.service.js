import { dbConfig } from "../../config/db.config.js";
import { initBook } from "../../models/Book.model.js";
import { initAuthor } from "../../models/Author.model.js";
import { initBookAuthor } from "../../models/BookAuthor.model.js";
import { defineAssociation } from "../../models/associations/BookAuthor.association.js";
import { DBError } from "../../utils/errors.util.js";
import { Logger } from "../../utils/logger.js";

export class DB {
  static logger = new Logger("DATABASE");

  static async init() {
    try {
      this.logger.info("Inicializando Base de Datos");

      this.logger.debug("Autenticando en DB...");
      await dbConfig.authenticate();
      this.logger.debug("Autenticado con éxito");

      // Primero inicializa los modelos
      this.initModels(dbConfig);

      // Luego define las asociaciones (requiere que los modelos ya existan)
      this.initAssociations();

      this.logger.info("Sincronizando con la base de datos...");
      await dbConfig.sync({ alter: true });
      this.logger.info("Sincronización completada ✅");
    } catch (error) {
      this.logger.error("No pudimos conectarnos a la base de datos", error);
      process.exit(1);
    }
  }

  static initModels(config) {
    try {
      this.logger.info("Inicializando modelos...");

      initBook(config);
      this.logger.debug("Modelo Book inicializado");

      initAuthor(config);
      this.logger.debug("Modelo Author inicializado");

      initBookAuthor(config);
      this.logger.debug("Modelo BookAuthor inicializado");
    } catch (error) {
      this.logger.error(`Error al inicializar los modelos: ${error.message}`);
      throw new DBError("Error al inicializar los modelos");
    }
  }

  static initAssociations() {
    try {
      this.logger.info("Definiendo asociaciones...");

      // Delega al archivo externo de asociaciones
      defineAssociation();

      this.logger.debug("Asociaciones definidas con éxito");
    } catch (error) {
      this.logger.error(`Error al definir asociaciones: ${error.message}`);
      throw new DBError("Error al definir asociaciones");
    }
  }
}
