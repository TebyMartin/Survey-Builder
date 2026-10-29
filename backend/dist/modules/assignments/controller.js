"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentsController = void 0;
const service_1 = require("./service");
const mapper_1 = require("./mapper");
class AssignmentsController {
    service = new service_1.AssignmentsService();
    // =========================================================
    // OBTENER TODAS LAS ASIGNACIONES
    // =========================================================
    async findAll(req, res) {
        const assignments = await this.service.findAll(req.user.organizationId);
        res.json((0, mapper_1.toAssignmentsResponse)(assignments));
    }
    // =========================================================
    // OBTENER UNA ASIGNACIÓN
    // =========================================================
    async findById(req, res) {
        const id = req.params.id;
        const assignment = await this.service.findById(id, req.user.organizationId);
        res.json((0, mapper_1.toAssignmentResponse)(assignment));
    }
    // =========================================================
    // CREAR ASIGNACIÓN
    // =========================================================
    async create(req, res, next) {
        try {
            const assignment = await this.service.create(req.body, req.user.organizationId);
            res.status(201).json(assignment);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // ELIMINAR ASIGNACIÓN
    // =========================================================
    async delete(req, res, next) {
        try {
            const id = req.params.id;
            await this.service.delete(id, req.user.organizationId);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // MIS ASIGNACIONES
    // =========================================================
    async myAssignments(req, res) {
        const assignments = await this.service.myAssignments(req.user.id, req.user.organizationId);
        res.json((0, mapper_1.toAssignmentsResponse)(assignments));
    }
    // =========================================================
    // DETALLE DE ASIGNACIÓN
    // =========================================================
    async detail(req, res, next) {
        try {
            const id = req.params.id;
            const assignment = await this.service.findById(id, req.user.organizationId);
            if (req.user.role === "INTERVIEWER" &&
                assignment.userId !== req.user.id) {
                res.status(403).json({
                    message: "No tenés permiso para acceder a esta asignación.",
                });
                return;
            }
            res.json((0, mapper_1.toAssignmentDetailResponse)(assignment));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AssignmentsController = AssignmentsController;
