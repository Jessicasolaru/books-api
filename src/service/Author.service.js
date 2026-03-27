import { Author } from "../models/Author.model.js";
import { Book } from "../models/Book.model.js";
import { NotFoundError, AuthorError } from "../utils/errors.util.js";
import { Logger } from "../utils/logger.js";

export class AuthorService {
  static logger = new Logger("AUTHOR_SERVICE");

  // Crear un autor nuevo
  static async create(data) {
    try {
      this.logger.info("Creando nuevo autor...");
      const author = await Author.create(data);
      this.logger.debug("Autor creado con éxito", { author });
      return author;
    } catch (error) {
      this.logger.error(`Error al crear el autor: ${error.message}`);
      // Si es un error de validación de Sequelize lo retornamos como 400
      if (error.name === "SequelizeValidationError") {
        throw new AuthorError(
          error.errors.map((e) => e.message).join(", "),
          error.message,
          400,
        );
      }
      throw new AuthorError("Error al crear el autor", error.message, 500);
    }
  }

  // Obtener todos los autores incluyendo sus libros
  static async findAll() {
    try {
      this.logger.info("Obteniendo todos los autores...");
      const authors = await Author.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        include: [
          {
            model: Book,
            as: "books", // alias definido en la asociación
            attributes: ["id", "title", "genre"],
            through: { attributes: ["role"] }, // incluye el rol de la tabla intermedia
          },
        ],
      });
      this.logger.info(`${authors.length} autores encontrados`);
      return authors;
    } catch (error) {
      this.logger.error(`Error al obtener los autores: ${error.message}`);
      throw new AuthorError("Error al obtener los autores");
    }
  }

  // Obtener un autor por su ID
  static async findById(id) {
    try {
      this.logger.info(`Buscando autor con id: ${id}`);
      const author = await Author.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        include: [
          {
            model: Book,
            as: "books",
            attributes: ["id", "title", "genre"],
            through: { attributes: ["role"] },
          },
        ],
      });

      if (!author) {
        this.logger.warn(`Autor con id: ${id} no encontrado`);
        throw new NotFoundError(`Autor con id: ${id} no encontrado`);
      }

      this.logger.debug("Autor encontrado", { author });
      return author;
    } catch (error) {
      this.logger.error(`Error al buscar el autor: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new AuthorError("Error al buscar el autor");
    }
  }

  // Actualizar un autor por su ID
  static async update(id, newData) {
    try {
      this.logger.info(`Actualizando autor con id: ${id}`);

      const author = await Author.findByPk(id);
      if (!author) {
        throw new NotFoundError(`Autor con id: ${id} no encontrado`);
      }

      await author.update(newData);
      this.logger.debug("Autor actualizado con éxito");

      const updated = await Author.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      });
      return updated;
    } catch (error) {
      this.logger.error(`Error al actualizar el autor: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      if (error.name === "SequelizeValidationError") {
        throw new AuthorError(
          error.errors.map((e) => e.message).join(", "),
          error.message,
          400,
        );
      }
      throw new AuthorError("Error al actualizar el autor", error.message, 500);
    }
  }

  // Eliminar un autor (soft delete)
  static async delete(id) {
    try {
      this.logger.info(`Eliminando autor con id: ${id}`);

      const author = await Author.findByPk(id);
      if (!author) {
        throw new NotFoundError(`Autor con id: ${id} no encontrado`);
      }

      await author.destroy();
      this.logger.info("Autor eliminado con éxito (soft delete)");
    } catch (error) {
      this.logger.error(`Error al eliminar el autor: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new AuthorError("Error al eliminar el autor");
    }
  }
}
