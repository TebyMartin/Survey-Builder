import { Router } from "express";
import { SurveyController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";
import { validate } from "../../validations/validate";

import { createSurveySchema } from "../../validations/survey.schema";
import { idParamSchema } from "../../validations/common.schema";
import { builderSchema } from "../../validations/builder.schema";
import { authorize } from "../../middlewares/authorize";

const router = Router();
const controller = new SurveyController();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "EDITOR"),
  validate(createSurveySchema),
  controller.create.bind(controller),
);

router.get("/", authenticate, controller.findAll.bind(controller));

router.get(
  "/:id",
  authenticate,
  validate(idParamSchema, "params"),
  controller.findById.bind(controller),
);
router.patch(
  "/:id/publish",
  authenticate,
  authorize("ADMIN", "EDITOR"),
  validate(idParamSchema, "params"),
  controller.publish.bind(controller),
);
router.get(
  "/:id/builder",
  authenticate,
  validate(idParamSchema, "params"),
  controller.findBuilderById.bind(controller),
);
router.patch(
  "/:id/restore",
  authenticate,
  authorize("ADMIN", "EDITOR"),
  controller.restore.bind(controller),
);
router.patch(
  "/:id/archive",
  authenticate,
  authorize("ADMIN", "EDITOR"),
  controller.archive.bind(controller),
);
router.patch(
  "/:id/close",
  authenticate,
  authorize("ADMIN", "EDITOR"),
  validate(idParamSchema, "params"),
  controller.close.bind(controller),
);

router.get(
  "/:id/results",
  authenticate,
  validate(idParamSchema, "params"),
  controller.getResults.bind(controller),
);

router.put(
  "/:id/builder",
  authenticate,
  authorize("ADMIN", "EDITOR"),
  validate(idParamSchema, "params"),
  validate(builderSchema),
  controller.updateBuilder.bind(controller),
);
router.delete("/:id", authenticate, controller.delete.bind(controller));
router.post(
  "/:id/duplicate",
  authenticate,
  controller.duplicate.bind(controller),
);

router.get("/public/surveys/:token", controller.findPublic.bind(controller));

export default router;
