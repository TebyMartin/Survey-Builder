"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionController = void 0;
const service_1 = require("./service");
const service = new service_1.SubmissionService();
class SubmissionController {
    reorder;
    async findForReview(req, res, next) {
        try {
            const submissions = await service.findForReview(req.user.organizationId);
            res.json(submissions);
        }
        catch (error) {
            next(error);
        }
    }
    async requestReview(req, res, next) {
        try {
            const review = await service.requestReview(req.params.id, req.user.id, req.user.organizationId, req.body.comment);
            res.status(201).json(review);
        }
        catch (error) {
            next(error);
        }
    }
    async approveReview(req, res, next) {
        try {
            const review = await service.approveReview(req.params.reviewId, req.user.organizationId);
            res.json(review);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const submission = await service.create({
                surveyId: req.body.surveyId,
                assignmentId: req.body.assignmentId,
                interviewerId: req.user?.id,
                organizationId: req.user.organizationId,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                ipAddress: req.ip,
                deviceInfo: req.headers["user-agent"],
            });
            res.status(201).json(submission);
        }
        catch (error) {
            next(error);
        }
    }
    async saveAnswers(req, res, next) {
        console.log("🟢 BODY SAVE ANSWERS:", JSON.stringify(req.body, null, 2));
        try {
            const { id } = req.params;
            const { answers } = req.body;
            await service.saveAnswers(id, answers, req.user.organizationId, req.user.id);
            res.status(200).json({
                message: "Respuestas guardadas correctamente",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async complete(req, res, next) {
        try {
            const { id } = req.params;
            const submission = await service.complete(id, req.user.organizationId, req.user.id);
            res.json(submission);
        }
        catch (error) {
            next(error);
        }
    }
    async getResults(req, res, next) {
        try {
            const { id } = req.params;
            const results = await service.getResults(id, req.user.organizationId);
            res.json(results);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SubmissionController = SubmissionController;
