import { Router } from "express";
import { AuthController } from "./controller";
import { validate } from "../../validations/validate";
import { loginSchema } from "../../validations/auth.schema";
import { authenticate } from "../../middlewares/authenticate";
import { registerSchema } from "./schemas";

const router = Router();
const controller = new AuthController();

router.post("/login", validate(loginSchema), controller.login.bind(controller));
router.get("/me", authenticate, controller.me.bind(controller));
router.post(
  "/register",
  validate(registerSchema),
  controller.register.bind(controller),
);
export default router;
