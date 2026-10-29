"use strict";
// modules/assignments/routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const router = (0, express_1.Router)();
const controller = new controller_1.AssignmentsController();
router.get("/", authenticate_1.authenticate, controller.findAll.bind(controller));
router.get("/my", authenticate_1.authenticate, (0, authorize_1.authorize)("INTERVIEWER"), controller.myAssignments.bind(controller));
router.get("/:id/detail", authenticate_1.authenticate, controller.detail.bind(controller));
router.get("/:id", authenticate_1.authenticate, controller.findById.bind(controller));
router.post("/", authenticate_1.authenticate, (0, authorize_1.authorize)("ADMIN", "EDITOR"), controller.create.bind(controller));
router.delete("/:id", authenticate_1.authenticate, controller.delete.bind(controller));
exports.default = router;
