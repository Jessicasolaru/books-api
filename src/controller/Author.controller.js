import { AuthorService } from "../service/Author.service.js";

export class AuthorController {
  // POST /api/v1/authors
  static async create(req, res, next) {
    try {
      const data = await AuthorService.create(req.body);
      res.status(201).json({
        message: "Autor creado con éxito",
        statusCode: 201,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/authors
  static async findAll(req, res, next) {
    try {
      const data = await AuthorService.findAll();
      res.status(200).json({
        message: "Autores obtenidos con éxito",
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/authors/:id
  static async findById(req, res, next) {
    try {
      const data = await AuthorService.findById(req.params.id);
      res.status(200).json({
        message: "Autor encontrado con éxito",
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/v1/authors/:id
  static async update(req, res, next) {
    try {
      const data = await AuthorService.update(req.params.id, req.body);
      res.status(200).json({
        message: "Autor actualizado con éxito",
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/v1/authors/:id
  static async delete(req, res, next) {
    try {
      await AuthorService.delete(req.params.id);
      res.status(200).json({
        message: "Autor eliminado con éxito",
        statusCode: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}
