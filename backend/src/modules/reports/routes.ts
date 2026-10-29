import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { ReportsController } from "./controller";
import { authorize } from "../../middlewares/authorize";

const router = Router();

const controller = new ReportsController();

router.get(
  "/:surveyId/dashboard",
  authenticate,
  authorize("ADMIN", "EDITOR", "VIEWER"),
  controller.dashboard.bind(controller),
);

export default router;
