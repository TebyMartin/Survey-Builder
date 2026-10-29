"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionOptionController = void 0;
const service_1 = require("./service");
const service = new service_1.QuestionOptionService();
class QuestionOptionController {
    async create(req, res) {
        const option = await service.create(req.body);
        res.status(201).json(option);
    }
    async update(req, res) {
        const option = await service.update(req.params.id, req.body);
        res.json(option);
    }
    async delete(req, res) {
        await service.delete(req.params.id);
        res.sendStatus(204);
    }
    async reorder(req, res) {
        const { questionId, from, to } = req.body;
        console.log(req.body);
        const result = await service.reorder(questionId, from, to);
        res.json(result);
    }
}
exports.QuestionOptionController = QuestionOptionController;
