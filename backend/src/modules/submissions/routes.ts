import { Router } from "express";
import { SubmissionController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { validate } from "../../validations/validate";
import {
  createSubmissionSchema,
  saveAnswersSchema,
} from "../../validations/submission";
import { idParamSchema } from "../../validations/common.schema";
import { z } from "zod";

const router = Router();
const controller = new SubmissionController();

router.get(
  "/reviews",
  authenticate,
  authorize("SUPERVISOR"),
  controller.findForReview.bind(controller),
);

router.post(
  "/:id/reviews",
  authenticate,
  authorize("SUPERVISOR"),
  validate(idParamSchema, "params"),
  validate(z.object({ comment: z.string().trim().min(1).max(2000) })),
  controller.requestReview.bind(controller),
);

router.patch(
  "/reviews/:reviewId/approve",
  authenticate,
  authorize("SUPERVISOR"),
  validate(z.object({ reviewId: z.string().uuid() }), "params"),
  controller.approveReview.bind(controller),
);

router.post(
  "/",
  authenticate,
  authorize("INTERVIEWER"),
  validate(createSubmissionSchema),
  controller.create.bind(controller),
);

router.patch(
  "/:id/answers",
  authenticate,
  authorize("INTERVIEWER"),
  validate(idParamSchema, "params"),
  validate(saveAnswersSchema),
  controller.saveAnswers.bind(controller),
);

router.patch(
  "/:id/complete",
  authenticate,
  authorize("INTERVIEWER"),
  validate(idParamSchema, "params"),
  controller.complete.bind(controller),
);

export default router;
