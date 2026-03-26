import { Router } from "express";
import { AuthorController } from "../controller/Author.controller.js";

const router = Router();

router.post("/authors", AuthorController.create);
router.get("/authors", AuthorController.findAll);
router.get("/authors/:id", AuthorController.findById);
router.put("/authors/:id", AuthorController.update);
router.delete("/authors/:id", AuthorController.delete);

export default router;
