import { Router } from "express";
import { SubmissionController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";
import { validate } from "../../validations/validate";
import {
  createSubmissionSchema,
  saveAnswersSchema,
} from "../../validations/submission";
import { idParamSchema } from "../../validations/common.schema";

const router = Router();
const controller = new SubmissionController();

router.post(
  "/",
  authenticate,
  validate(createSubmissionSchema),
  controller.create.bind(controller),
);

router.patch(
  "/:id/answers",
  authenticate,
  validate(idParamSchema, "params"),
  validate(saveAnswersSchema),
  controller.saveAnswers.bind(controller),
);

router.patch(
  "/:id/complete",
  authenticate,
  validate(idParamSchema, "params"),
  controller.complete.bind(controller),
);

export default router;
