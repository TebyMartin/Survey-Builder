"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicService = void 0;
const repository_1 = require("./repository");
const public_builder_1 = require("./public.builder");
const NotFoundError_1 = require("../../error/NotFoundError");
const repository = new repository_1.PublicRepository();
const builder = new public_builder_1.PublicBuilder();
class PublicService {
    async findByPublicToken(token) {
        const survey = await repository.findSurveyByToken(token);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return survey;
    }
    async getSurvey(token) {
        const survey = await repository.findSurveyByToken(token);
        if (!survey) {
            throw new NotFoundError_1.NotFoundError("Encuesta no encontrada");
        }
        return builder.build(survey);
    }
}
exports.PublicService = PublicService;
