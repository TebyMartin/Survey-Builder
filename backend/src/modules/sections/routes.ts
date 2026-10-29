import { Router } from "express";
import { SectionController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

const controller = new SectionController();

router.post("/", authenticate, controller.create.bind(controller));
router.post(
  "/:id/duplicate",
  authenticate,
  controller.duplicate.bind(controller),
);
router.patch("/reorder", authenticate, controller.reorder.bind(controller));
router.patch("/:id", authenticate, controller.update.bind(controller));

router.delete("/:id", authenticate, controller.delete.bind(controller));

export default router;
