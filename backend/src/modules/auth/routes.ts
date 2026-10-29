import { Router } from "express";
import { AuthController } from "./controller";

import { authenticate } from "../../middlewares/authenticate";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.login.bind(controller));
router.get("/me", authenticate, controller.me.bind(controller));
router.post(
  "/register",

  controller.register.bind(controller),
);
export default router;
