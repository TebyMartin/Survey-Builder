"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authenticate_1 = require("../../middlewares/authenticate");
const router = (0, express_1.Router)();
const controller = new controller_1.OrganizationController();
// Listar organizaciones
router.get("/", authenticate_1.authenticate, controller.findAll.bind(controller));
// Obtener organización
router.get("/:id", authenticate_1.authenticate, controller.findById.bind(controller));
// Crear organización
router.post("/", authenticate_1.authenticate, controller.create.bind(controller));
// Editar organización
router.put("/:id", authenticate_1.authenticate, controller.update.bind(controller));
// Desactivar organización
router.patch("/:id/deactivate", authenticate_1.authenticate, controller.deactivate.bind(controller));
router.delete("/:id", authenticate_1.authenticate, controller.delete.bind(controller));
exports.default = router;
