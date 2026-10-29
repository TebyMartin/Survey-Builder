import { Router } from "express";

import { OrganizationController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

const controller = new OrganizationController();

// Listar organizaciones
router.get("/", authenticate, controller.findAll.bind(controller));

// Obtener organización
router.get("/:id", authenticate, controller.findById.bind(controller));

// Crear organización
router.post("/", authenticate, controller.create.bind(controller));

// Editar organización
router.put("/:id", authenticate, controller.update.bind(controller));

// Desactivar organización
router.patch(
  "/:id/deactivate",
  authenticate,
  controller.deactivate.bind(controller),
);
router.delete("/:id", authenticate, controller.delete.bind(controller));
export default router;
