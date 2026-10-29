import { Router } from "express";
import { QuestionController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

// Instancia del controlador
const controller = new QuestionController();

// routes.ts (Asegúrate de colocar reorder ANTES de cualquier /:id)
router.post(
  "/:id/duplicate",
  authenticate,
  controller.duplicate.bind(controller),
);
router.patch("/reorder", authenticate, controller.reorder.bind(controller)); // <-- Asegúrate que no choque con otras firmas
router.patch("/:id", authenticate, controller.update.bind(controller));
router.delete("/:id", authenticate, controller.delete.bind(controller));
router.post("/", authenticate, controller.create.bind(controller));

export default router;
