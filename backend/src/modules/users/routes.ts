import { Router } from "express";

import { UsersController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const router = Router();

const controller = new UsersController();

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.findAll.bind(controller),
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.findById.bind(controller),
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  controller.create.bind(controller),
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.update.bind(controller),
);

router.patch(
  "/:id/activate",
  authenticate,
  authorize("ADMIN"),
  controller.activate.bind(controller),
);

router.patch(
  "/:id/desactivate",
  authenticate,
  authorize("ADMIN"),
  controller.desactivate.bind(controller),
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  controller.delete.bind(controller),
);

export default router;
