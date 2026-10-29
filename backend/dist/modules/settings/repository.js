"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRepository = void 0;
const app_1 = require("../../app");
class SettingsRepository {
    async getOrganization(organizationId) {
        return app_1.prisma.organization.findUnique({
            where: {
                id: organizationId,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                isActive: true,
                logoUrl: true,
                primaryColor: true,
                secondaryColor: true,
            },
        });
    }
    async updateOrganization(organizationId, data) {
        return app_1.prisma.organization.update({
            where: {
                id: organizationId,
            },
            data,
            select: {
                id: true,
                name: true,
                slug: true,
                isActive: true,
                logoUrl: true,
                primaryColor: true,
                secondaryColor: true,
            },
        });
    }
    async getUser(userId, organizationId) {
        return app_1.prisma.user.findFirst({
            where: {
                id: userId,
                organizationId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
            },
        });
    }
    async updateUser(userId, organizationId, data) {
        return app_1.prisma.user.update({
            where: {
                id: userId,
            },
            data,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
            },
        });
    }
    async updatePassword(userId, password) {
        return app_1.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password,
            },
        });
    }
    async getPassword(userId) {
        return app_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                password: true,
            },
        });
    }
    async getUserById(userId) {
        return app_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
            },
        });
    }
}
exports.SettingsRepository = SettingsRepository;
