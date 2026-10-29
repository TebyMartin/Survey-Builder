// modules/assignments/routes.ts

import { Router } from "express";
import { AssignmentsController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const router = Router();

const controller = new AssignmentsController();
router.get("/", authenticate, controller.findAll.bind(controller));

router.get(
  "/my",
  authenticate,
  authorize("INTERVIEWER"),
  controller.myAssignments.bind(controller),
);

router.get("/:id/detail", authenticate, controller.detail.bind(controller));

router.get("/:id", authenticate, controller.findById.bind(controller));

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "EDITOR"),
  controller.create.bind(controller),
);

router.delete("/:id", authenticate, controller.delete.bind(controller));

export default router;
