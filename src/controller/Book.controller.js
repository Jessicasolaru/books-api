import { BookService } from "../service/Book.service.js";

export class BookController {
  // POST /api/v1/books
  static async create(req, res, next) {
    try {
      const data = await BookService.create(req.body);
      res.status(201).json({
        message: "Libro creado con éxito",
        statusCode: 201,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/books
  static async findAll(req, res, next) {
    try {
      const data = await BookService.findAll();
      res.status(200).json({
        message: "Libros obtenidos con éxito",
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/books/:id
  static async findById(req, res, next) {
    try {
      const data = await BookService.findById(req.params.id);
      res.status(200).json({
        message: "Libro encontrado con éxito",
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/v1/books/:id
  static async update(req, res, next) {
    try {
      const data = await BookService.update(req.params.id, req.body);
      res.status(200).json({
        message: "Libro actualizado con éxito",
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/v1/books/:id
  static async delete(req, res, next) {
    try {
      await BookService.delete(req.params.id);
      res.status(200).json({
        message: "Libro eliminado con éxito",
        statusCode: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/books/:bookId/authors/:authorId
  static async addAuthor(req, res, next) {
    try {
      const { bookId, authorId } = req.params;
      const { role } = req.body;
      const data = await BookService.addAuthor(bookId, authorId, role);
      res.status(200).json({
        message: "Autor asociado al libro con éxito",
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
