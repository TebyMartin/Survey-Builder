"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const service_1 = require("./service");
class SettingsController {
    service = new service_1.SettingsService();
    async get(req, res, next) {
        try {
            const result = await this.service.getSettings(req.user.id, req.user.organizationId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async updateOrganization(req, res, next) {
        try {
            const organization = await this.service.updateOrganization(req.user.organizationId, req.body);
            res.json(organization);
        }
        catch (error) {
            next(error);
        }
    }
    async updateUser(req, res, next) {
        try {
            const user = await this.service.updateUser(req.user.id, req.user.organizationId, req.body);
            res.json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            const result = await this.service.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SettingsController = SettingsController;
