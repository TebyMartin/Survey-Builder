"use strict";
// modules/users/controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const service_1 = require("./service");
const mapper_1 = require("./mapper");
class UsersController {
    service = new service_1.UsersService();
    async findAll(req, res) {
        const organizationId = req.user?.organizationId;
        if (!organizationId) {
            return res.status(401).json({
                message: "Organización no encontrada",
            });
        }
        const users = await this.service.findAll(organizationId);
        res.json((0, mapper_1.toUsersResponse)(users));
    }
    async findById(req, res) {
        const organizationId = req.user?.organizationId;
        if (!organizationId) {
            return res.status(401).json({
                message: "Organización no encontrada",
            });
        }
        const user = await this.service.findById(req.params.id, organizationId);
        res.json((0, mapper_1.toUserResponse)(user));
    }
    async create(req, res) {
        const organizationId = req.user?.organizationId;
        if (!organizationId) {
            return res.status(401).json({
                message: "Organización no encontrada",
            });
        }
        const user = await this.service.create(req.body, organizationId);
        res.json((0, mapper_1.toUserResponse)(user));
    }
    async update(req, res) {
        const organizationId = req.user?.organizationId;
        if (!organizationId) {
            return res.status(401).json({
                message: "Organización no encontrada",
            });
        }
        const user = await this.service.update(req.params.id, req.body, organizationId);
        res.json((0, mapper_1.toUserResponse)(user));
    }
    async activate(req, res) {
        const organizationId = req.user?.organizationId;
        if (!organizationId) {
            return res.status(401).json({
                message: "Organización no encontrada",
            });
        }
        const user = await this.service.activate(req.params.id, organizationId);
        res.json((0, mapper_1.toUserResponse)(user));
    }
    async desactivate(req, res) {
        const organizationId = req.user?.organizationId;
        if (!organizationId) {
            return res.status(401).json({
                message: "Organización no encontrada",
            });
        }
        const user = await this.service.desactivate(req.params.id, organizationId);
        res.json((0, mapper_1.toUserResponse)(user));
    }
    async delete(req, res) {
        try {
            const organizationId = req.user?.organizationId;
            if (!organizationId) {
                return res.status(401).json({
                    message: "Organización no encontrada",
                });
            }
            await this.service.delete(req.params.id, organizationId);
            res.sendStatus(204);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al eliminar el usuario",
            });
        }
    }
}
exports.UsersController = UsersController;
