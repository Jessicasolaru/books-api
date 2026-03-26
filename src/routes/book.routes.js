import { Router } from "express";
import { BookController } from "../controller/Book.controller.js";

const router = Router();

router.post("/books", BookController.create);
router.get("/books", BookController.findAll);
router.get("/books/:id", BookController.findById);
router.put("/books/:id", BookController.update);
router.delete("/books/:id", BookController.delete);

// Ruta especial para asociar un autor a un libro (muchos a muchos)
router.post("/books/:bookId/authors/:authorId", BookController.addAuthor);

export default router;
