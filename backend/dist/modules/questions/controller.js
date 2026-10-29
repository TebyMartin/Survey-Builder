"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = void 0;
const service_1 = require("./service");
const service = new service_1.QuestionService();
class QuestionController {
    async create(req, res) {
        try {
            const question = await service.create(req.body);
            res.status(201).json(question);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al crear la pregunta",
            });
        }
    }
    async update(req, res) {
        try {
            const question = await service.update(req.params.id, req.body);
            res.json(question);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al actualizar la pregunta",
            });
        }
    }
    async delete(req, res) {
        try {
            await service.delete(req.params.id);
            res.sendStatus(204);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al eliminar la pregunta",
            });
        }
    }
    async reorder(req, res) {
        try {
            await service.reorder(req.body.questions);
            res.json({
                message: "Orden actualizado",
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al actualizar el orden",
            });
        }
    }
    async duplicate(req, res) {
        try {
            const question = await service.duplicate(req.params.id);
            res.status(201).json(question);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al duplicar la pregunta",
            });
        }
    }
}
exports.QuestionController = QuestionController;
