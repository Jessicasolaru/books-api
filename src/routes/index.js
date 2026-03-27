import { Router } from "express";
import bookRouter from "./book.routes.js";
import authorRouter from "./author.routes.js";

const router = Router();

// Centraliza todas las rutas de la API en un solo archivo
router.use(bookRouter);
router.use(authorRouter);

export default router;
