import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { QuestionOptionController } from "./controller";

const router = Router();

const controller = new QuestionOptionController();
router.patch("/reorder", authenticate, controller.reorder.bind(controller));
router.post("/", authenticate, controller.create.bind(controller));

router.patch("/:id", authenticate, controller.update.bind(controller));

router.delete("/:id", authenticate, controller.delete.bind(controller));

export default router;
