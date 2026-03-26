import { Book } from "../models/Book.model.js";
import { Author } from "../models/Author.model.js";
import { NotFoundError, BookError } from "../utils/errors.util.js";
import { Logger } from "../utils/logger.js";

export class BookService {
  static logger = new Logger("BOOK_SERVICE");

  // Crear un libro nuevo
  static async create(data) {
    try {
      this.logger.info("Creando nuevo libro...");
      const book = await Book.create(data);
      this.logger.debug("Libro creado con éxito", { book });
      return book;
    } catch (error) {
      this.logger.error(`Error al crear el libro: ${error.message}`);
      throw new BookError("Error al crear el libro", error.message, 400);
    }
  }

  // Obtener todos los libros, incluyendo sus autores
  static async findAll() {
    try {
      this.logger.info("Obteniendo todos los libros...");
      const books = await Book.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        include: [
          {
            model: Author,
            as: "authors", // alias definido en la asociación
            attributes: ["id", "name", "nationality"],
            through: { attributes: ["role"] }, // incluye el campo role de la tabla intermedia
          },
        ],
      });
      this.logger.info(`${books.length} libros encontrados`);
      return books;
    } catch (error) {
      this.logger.error(`Error al obtener los libros: ${error.message}`);
      throw new BookError("Error al obtener los libros");
    }
  }

  // Obtener un libro por su ID
  static async findById(id) {
    try {
      this.logger.info(`Buscando libro con id: ${id}`);
      const book = await Book.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        include: [
          {
            model: Author,
            as: "authors",
            attributes: ["id", "name", "nationality"],
            through: { attributes: ["role"] },
          },
        ],
      });

      if (!book) {
        this.logger.warn(`Libro con id: ${id} no encontrado`);
        throw new NotFoundError(`Libro con id: ${id} no encontrado`);
      }

      this.logger.debug("Libro encontrado", { book });
      return book;
    } catch (error) {
      this.logger.error(`Error al buscar el libro: ${error.message}`);
      // Si ya es un NotFoundError lo relanzamos tal cual
      if (error instanceof NotFoundError) throw error;
      throw new BookError("Error al buscar el libro");
    }
  }

  // Actualizar un libro por su ID
  static async update(id, newData) {
    try {
      this.logger.info(`Actualizando libro con id: ${id}`);

      const book = await Book.findByPk(id);
      if (!book) {
        throw new NotFoundError(`Libro con id: ${id} no encontrado`);
      }

      await book.update(newData);
      this.logger.debug("Libro actualizado con éxito");

      // Retornamos el libro actualizado sin timestamps
      const updated = await Book.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      });
      return updated;
    } catch (error) {
      this.logger.error(`Error al actualizar el libro: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new BookError("Error al actualizar el libro", error.message, 400);
    }
  }

  // Eliminar un libro (soft delete gracias a paranoid: true)
  static async delete(id) {
    try {
      this.logger.info(`Eliminando libro con id: ${id}`);

      const book = await Book.findByPk(id);
      if (!book) {
        throw new NotFoundError(`Libro con id: ${id} no encontrado`);
      }

      await book.destroy();
      this.logger.info("Libro eliminado con éxito (soft delete)");
    } catch (error) {
      this.logger.error(`Error al eliminar el libro: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new BookError("Error al eliminar el libro");
    }
  }

  // Agregar un autor a un libro (relación muchos a muchos)
  static async addAuthor(bookId, authorId, role = "autor") {
    try {
      this.logger.info(`Asociando autor ${authorId} al libro ${bookId}`);

      const book = await Book.findByPk(bookId);
      if (!book)
        throw new NotFoundError(`Libro con id: ${bookId} no encontrado`);

      const author = await Author.findByPk(authorId);
      if (!author)
        throw new NotFoundError(`Autor con id: ${authorId} no encontrado`);

      // addAuthor viene de la asociación belongsToMany
      await book.addAuthor(author, { through: { role } });
      this.logger.info("Autor asociado al libro con éxito");

      // Retornamos el libro completo con sus autores
      return await BookService.findById(bookId);
    } catch (error) {
      this.logger.error(`Error al asociar autor: ${error.message}`);
      if (error instanceof NotFoundError) throw error;
      throw new BookError("Error al asociar el autor al libro");
    }
  }
}
