import { dbConfig } from "../../config/db.config.js";
import { Book, initBook } from "../../models/Book.model.js";
import { Author, initAuthor } from "../../models/Author.model.js";
import { BookAuthor, initBookAuthor } from "../../models/BookAuthor.model.js";
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

      // Inicializa los modelos
      this.initModels(dbConfig);

      // Define las asociaciones DESPUÉS de inicializar los modelos
      this.initAssociations();

      this.logger.info("Sincronizando con la base de datos...");
      // alter:true actualiza las tablas si cambian los modelos, sin borrar datos
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

      // Relación muchos a muchos: Book <-> Author a través de BookAuthor
      Book.belongsToMany(Author, {
        through: BookAuthor, // tabla intermedia
        foreignKey: "bookId",
        otherKey: "authorId",
        as: "authors", // alias para usar en queries
      });

      Author.belongsToMany(Book, {
        through: BookAuthor,
        foreignKey: "authorId",
        otherKey: "bookId",
        as: "books", // alias para usar en queries
      });

      this.logger.debug("Asociaciones definidas con éxito");
    } catch (error) {
      this.logger.error(`Error al definir asociaciones: ${error.message}`);
      throw new DBError("Error al definir asociaciones");
    }
  }
}
