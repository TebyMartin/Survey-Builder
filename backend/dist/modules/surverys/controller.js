"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyController = void 0;
const service_1 = require("./service");
const service = new service_1.SurveyService();
class SurveyController {
    // =========================================================
    // CREAR ENCUESTA
    // =========================================================
    async create(req, res, next) {
        try {
            const { title, description, estimatedTime, allowAnonymous, isTemplate } = req.body;
            const survey = await service.create({
                title,
                description,
                estimatedTime,
                allowAnonymous,
                isTemplate,
                organizationId: req.user.organizationId,
                createdById: req.user.id,
            });
            res.status(201).json(survey);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // OBTENER TODAS LAS ENCUESTAS
    // =========================================================
    async findAll(req, res, next) {
        try {
            const surveys = await service.findAll(req.user.organizationId);
            res.json(surveys);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // OBTENER ENCUESTA POR ID
    // =========================================================
    async findById(req, res, next) {
        try {
            const id = req.params.id;
            const survey = await service.findById(id, req.user.organizationId);
            res.json(survey);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // ACTUALIZAR BUILDER
    // =========================================================
    async updateBuilder(req, res, next) {
        try {
            const id = req.params.id;
            const survey = await service.updateBuilder(id, req.user.organizationId, req.body);
            res.json(survey);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // OBTENER BUILDER
    // =========================================================
    async findBuilderById(req, res, next) {
        try {
            const id = req.params.id;
            const survey = await service.findBuilderById(id, req.user.organizationId);
            res.json(survey);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // OBTENER RESULTADOS
    // =========================================================
    async getResults(req, res, next) {
        try {
            const id = req.params.id;
            const results = await service.getResults(id, req.user.organizationId);
            res.json(results);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // PUBLICAR
    // =========================================================
    async publish(req, res, next) {
        try {
            const id = req.params.id;
            const survey = await service.publish(id, req.user.organizationId);
            res.json(survey);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // CERRAR
    // =========================================================
    async close(req, res, next) {
        try {
            const id = req.params.id;
            const survey = await service.close(id, req.user.organizationId);
            res.json(survey);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // ELIMINAR
    // =========================================================
    async delete(req, res, next) {
        try {
            const id = req.params.id;
            await service.delete(id, req.user.organizationId);
            res.json({
                message: "Encuesta eliminada correctamente",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // DUPLICAR
    // =========================================================
    async duplicate(req, res, next) {
        try {
            const id = req.params.id;
            const survey = await service.duplicate(id, req.user.id, req.user.organizationId);
            res.json(survey);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // ARCHIVAR
    // =========================================================
    async archive(req, res, next) {
        try {
            const id = req.params.id;
            const survey = await service.archive(id, req.user.organizationId);
            res.json(survey);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // RESTAURAR
    // =========================================================
    async restore(req, res, next) {
        try {
            const id = req.params.id;
            const survey = await service.restore(id, req.user.organizationId);
            res.json(survey);
        }
        catch (error) {
            next(error);
        }
    }
    // =========================================================
    // ENCUESTA PÚBLICA
    // =========================================================
    async findPublic(req, res, next) {
        try {
            console.log("🔥 FIND PUBLIC EJECUTADO:", req.params.token);
            const survey = await service.findPublicSurvey(req.params.token);
            res.json(survey);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SurveyController = SurveyController;
