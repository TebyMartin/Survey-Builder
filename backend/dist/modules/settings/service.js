"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const repository_1 = require("./repository");
class SettingsService {
    repository = new repository_1.SettingsRepository();
    async getSettings(userId, organizationId) {
        const [organization, user] = await Promise.all([
            this.repository.getOrganization(organizationId),
            this.repository.getUser(userId, organizationId),
        ]);
        if (!organization) {
            throw new Error("Organización no encontrada");
        }
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return {
            organization,
            user,
        };
    }
    async updateOrganization(organizationId, data) {
        if (data.name !== undefined && !data.name.trim()) {
            throw new Error("El nombre de la organización es obligatorio");
        }
        return this.repository.updateOrganization(organizationId, {
            ...data,
            name: data.name?.trim(),
        });
    }
    async updateUser(userId, organizationId, data) {
        if (data.firstName !== undefined && !data.firstName.trim()) {
            throw new Error("El nombre es obligatorio");
        }
        if (data.lastName !== undefined && !data.lastName.trim()) {
            throw new Error("El apellido es obligatorio");
        }
        if (data.email !== undefined && !data.email.trim()) {
            throw new Error("El email es obligatorio");
        }
        const currentUser = await this.repository.getUser(userId, organizationId);
        if (!currentUser) {
            throw new Error("Usuario no encontrado");
        }
        return this.repository.updateUser(userId, organizationId, {
            ...data,
            firstName: data.firstName?.trim(),
            lastName: data.lastName?.trim(),
            email: data.email?.trim().toLowerCase(),
        });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const userWithPassword = await this.repository.getPassword(userId);
        if (!userWithPassword) {
            throw new Error("Usuario no encontrado");
        }
        const matches = await bcrypt_1.default.compare(currentPassword, userWithPassword.password);
        if (!matches) {
            throw new Error("La contraseña actual es incorrecta");
        }
        if (newPassword.length < 6) {
            throw new Error("La nueva contraseña debe tener al menos 6 caracteres");
        }
        const password = await bcrypt_1.default.hash(newPassword, 10);
        await this.repository.updatePassword(userId, password);
        return {
            message: "Contraseña actualizada correctamente",
        };
    }
}
exports.SettingsService = SettingsService;
