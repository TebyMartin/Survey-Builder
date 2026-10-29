"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionController = void 0;
const service_1 = require("./service");
const service = new service_1.SectionService();
class SectionController {
    async create(req, res) {
        try {
            const { surveyId, title, description } = req.body;
            const section = await service.create({
                surveyId,
                title,
                description,
            });
            res.status(201).json(section);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al crear la sección",
            });
        }
    }
    async update(req, res) {
        try {
            const section = await service.update(req.params.id, req.body);
            res.json(section);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al actualizar la sección",
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
                message: "Error al eliminar la sección",
            });
        }
    }
    async duplicate(req, res) {
        try {
            const section = await service.duplicate(req.params.id);
            res.status(201).json(section);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al duplicar la sección",
            });
        }
    }
    async reorder(req, res) {
        try {
            const sections = await service.reorder(req.body);
            res.json(sections);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al reordenar las secciones",
            });
        }
    }
}
exports.SectionController = SectionController;
