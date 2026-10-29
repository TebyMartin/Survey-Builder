"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentsService = void 0;
const repository_1 = require("./repository");
class AssignmentsService {
    repository = new repository_1.AssignmentsRepository();
    // =========================================================
    // OBTENER TODAS
    // =========================================================
    async findAll(organizationId) {
        return this.repository.findAll(organizationId);
    }
    // =========================================================
    // OBTENER POR ID
    // =========================================================
    async findById(id, organizationId) {
        const assignment = await this.repository.findById(id, organizationId);
        if (!assignment) {
            throw new Error("La asignación no existe.");
        }
        return assignment;
    }
    // =========================================================
    // CREAR
    // =========================================================
    async create(data, organizationId) {
        const survey = await this.repository.findSurveyById(data.surveyId, organizationId);
        if (!survey) {
            throw new Error("La encuesta no existe o no pertenece a esta organización.");
        }
        if (survey.status === "ARCHIVED") {
            throw new Error("No se puede asignar una encuesta archivada.");
        }
        if (survey.status === "CLOSED") {
            throw new Error("No se puede asignar una encuesta cerrada.");
        }
        if (survey.status !== "PUBLISHED") {
            throw new Error("Solo se pueden asignar encuestas publicadas.");
        }
        return this.repository.create(data, organizationId);
    }
    // =========================================================
    // ELIMINAR
    // =========================================================
    async delete(id, organizationId) {
        return this.repository.delete(id, organizationId);
    }
    // =========================================================
    // MIS ASIGNACIONES
    // =========================================================
    async myAssignments(userId, organizationId) {
        return this.repository.findByUser(userId, organizationId);
    }
    // =========================================================
    // COMPLETAR ASIGNACIÓN
    // =========================================================
    async completeAssignment(surveyId, userId, organizationId) {
        return this.repository.completeAssignment(surveyId, userId, organizationId);
    }
    // =========================================================
    // AUMENTAR RESPUESTAS COMPLETADAS
    // =========================================================
    async increaseCompletedResponses(id, organizationId) {
        return this.repository.increaseCompletedResponses(id, organizationId);
    }
    // =========================================================
    // ACTUALIZAR OBJETIVO
    // =========================================================
    async updateTargetResponses(id, targetResponses, organizationId) {
        return this.repository.updateTargetResponses(id, targetResponses, organizationId);
    }
    // =========================================================
    // INCREMENTAR RESPUESTAS
    // =========================================================
    async incrementCompletedResponses(surveyId, userId, organizationId) {
        return this.repository.incrementCompletedResponses(surveyId, userId, organizationId);
    }
    // =========================================================
    // ACTUALIZAR ESTADO
    // =========================================================
    async refreshStatus(surveyId, userId, organizationId) {
        return this.repository.refreshStatus(surveyId, userId, organizationId);
    }
}
exports.AssignmentsService = AssignmentsService;
