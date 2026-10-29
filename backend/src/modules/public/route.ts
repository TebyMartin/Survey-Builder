import { Router } from "express";
import { PublicController } from "./controller";

const router = Router();
const controller = new PublicController();

router.get("/surveys/:token", controller.getSurvey.bind(controller));
router.post(
  "/surveys/:token/start",
  controller.startSubmission.bind(controller),
);

router.patch(
  "/submissions/:id/answers",
  controller.saveAnswers.bind(controller),
);

router.patch(
  "/submissions/:id/complete",
  controller.completeSubmission.bind(controller),
);
export default router;
