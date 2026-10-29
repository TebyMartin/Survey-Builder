import { Router } from "express";
import { DashboardController } from "./controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const router = Router();

const controller = new DashboardController();

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "EDITOR", "VIEWER"),
  controller.getStats.bind(controller),
);

export default router;
