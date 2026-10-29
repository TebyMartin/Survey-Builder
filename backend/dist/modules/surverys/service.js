"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyService = void 0;
const repository_1 = require("./repository");
const result_builder_1 = require("./result.builder");
const NotFoundError_1 = require("../../error/NotFoundError");
const repository = new repository_1.SurveyRepository();
const resultBuilder = new result_builder_1.ResultBuilder();
class SurveyService {
    // =========================================================
    // CREAR
    // =========================================================
    async create(data) {
        return repository.create(data);
    }
    // =========================================================
    // LISTAR POR ORGANIZACIÓN
    // =========================================================
    async findAll(organizationId) {
        const surveys = await repository.findAll(organizationId);
        return surveys.map((survey) => ({
            id: survey.id,
            publicToken: survey.publicToken,
            title: survey.title,
            description: survey.description,
            status: survey.status,
            version: survey.version,
            sections: survey._count.sections,
            responses: survey._count.submissions,
            updatedAt: survey.updatedAt,
            publishedAt: survey.publishedAt,
        }));
    }
    // =========================================================
    // BUSCAR POR ID
    // =========================================================
    async findById(id, organizationId) {
        const survey = await repository.findById(id, organizationId);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return survey;
    }
    // =========================================================
    // ACTUALIZAR BUILDER
    // =========================================================
    async updateBuilder(surveyId, organizationId, data) {
        const survey = await repository.findById(surveyId, organizationId);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        if (survey.status === "PUBLISHED") {
            throw new Error("La encuesta ya está publicada");
        }
        if (survey.status === "CLOSED") {
            throw new Error("La encuesta está cerrada y no puede modificarse.");
        }
        return repository.updateBuilder(surveyId, data);
    }
    // =========================================================
    // OBTENER BUILDER
    // =========================================================
    async findBuilderById(surveyId, organizationId) {
        const survey = await repository.findBuilderById(surveyId, organizationId);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return survey;
    }
    // =========================================================
    // RESULTADOS
    // =========================================================
    async getResults(surveyId, organizationId) {
        const survey = await repository.getResults(surveyId, organizationId);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return resultBuilder.build(survey);
    }
    // =========================================================
    // PUBLICAR
    // =========================================================
    async publish(id, organizationId) {
        const survey = await repository.findById(id, organizationId);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return repository.publish(id, organizationId);
    }
    // =========================================================
    // CERRAR
    // =========================================================
    async close(surveyId, organizationId) {
        const survey = await repository.findById(surveyId, organizationId);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return repository.close(surveyId, organizationId);
    }
    // =========================================================
    // ELIMINAR
    // =========================================================
    async delete(id, organizationId) {
        const survey = await repository.findById(id, organizationId);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return repository.delete(id, organizationId);
    }
    // =========================================================
    // DUPLICAR
    // =========================================================
    async duplicate(id, userId, organizationId) {
        const survey = await repository.findById(id, organizationId);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return repository.duplicate(id, userId, organizationId);
    }
    // =========================================================
    // ARCHIVAR
    // =========================================================
    async archive(id, organizationId) {
        const survey = await repository.findById(id, organizationId);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return repository.archive(id, organizationId);
    }
    // =========================================================
    // RESTAURAR
    // =========================================================
    async restore(id, organizationId) {
        const survey = await repository.findById(id, organizationId);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return repository.restore(id, organizationId);
    }
    // =========================================================
    // ENCUESTA PÚBLICA
    // =========================================================
    async findPublicSurvey(token) {
        const survey = await repository.findByPublicToken(token);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return survey;
    }
}
exports.SurveyService = SurveyService;
