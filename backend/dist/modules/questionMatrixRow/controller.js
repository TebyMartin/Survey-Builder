"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionMatrixRowController = void 0;
const service_1 = require("./service");
const service = new service_1.QuestionMatrixRowService();
class QuestionMatrixRowController {
    async create(req, res) {
        const row = await service.create(req.body);
        res.status(201).json(row);
    }
    async update(req, res, next) {
        const row = await service.update(req.params.id, req.body);
        res.json(row);
    }
    async delete(req, res, next) {
        await service.delete(req.params.id);
        res.sendStatus(204);
    }
    async reorder(req, res) {
        const { questionId, from, to } = req.body;
        const result = await service.reorder(questionId, from, to);
        res.json(result);
    }
}
exports.QuestionMatrixRowController = QuestionMatrixRowController;
