import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { SettingsController } from "./constroller";

const router = Router();

const controller = new SettingsController();

router.use(authenticate);

router.get("/", authorize("ADMIN"), controller.get.bind(controller));

router.patch(
  "/organization",
  authorize("ADMIN"),
  controller.updateOrganization.bind(controller),
);

router.patch(
  "/user",
  authorize("ADMIN"),
  controller.updateUser.bind(controller),
);

router.patch(
  "/password",
  authorize("ADMIN"),
  controller.changePassword.bind(controller),
);

export default router;
