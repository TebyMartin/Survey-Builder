"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authenticate_1 = require("../../middlewares/authenticate");
const router = (0, express_1.Router)();
// Instancia del controlador
const controller = new controller_1.QuestionController();
// routes.ts (Asegúrate de colocar reorder ANTES de cualquier /:id)
router.post("/:id/duplicate", authenticate_1.authenticate, controller.duplicate.bind(controller));
router.patch("/reorder", authenticate_1.authenticate, controller.reorder.bind(controller)); // <-- Asegúrate que no choque con otras firmas
router.patch("/:id", authenticate_1.authenticate, controller.update.bind(controller));
router.delete("/:id", authenticate_1.authenticate, controller.delete.bind(controller));
router.post("/", authenticate_1.authenticate, controller.create.bind(controller));
exports.default = router;
