"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const service_1 = require("./service");
const service = new service_1.OrganizationService();
class OrganizationController {
    async findAll(req, res, next) {
        try {
            const organizations = await service.findAll();
            res.json(organizations);
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const { id } = req.params;
            const organization = await service.findById(id);
            res.json(organization);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const { name, slug } = req.body;
            const organization = await service.create({
                name,
                slug,
            });
            res.status(201).json(organization);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, slug, isActive } = req.body;
            const organization = await service.update(id, {
                name,
                slug,
                isActive,
            });
            res.json(organization);
        }
        catch (error) {
            next(error);
        }
    }
    async deactivate(req, res, next) {
        try {
            const { id } = req.params;
            const organization = await service.deactivate(id);
            res.json({
                message: "Organización desactivada correctamente",
                organization,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await service.delete(id);
            res.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrganizationController = OrganizationController;
