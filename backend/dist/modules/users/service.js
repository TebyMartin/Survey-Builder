"use strict";
// modules/users/service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const repository_1 = require("./repository");
class UsersService {
    repository = new repository_1.UsersRepository();
    async findAll(organizationId) {
        return this.repository.findAll(organizationId);
    }
    async findById(id, organizationId) {
        return this.repository.findById(id, organizationId);
    }
    async create(data, organizationId) {
        if (data.role === "ADMIN") {
            throw new Error("No se pueden crear usuarios administradores");
        }
        const exists = await this.repository.findByEmail(data.email);
        if (exists) {
            throw new Error("El email ya existe.");
        }
        const password = await bcryptjs_1.default.hash(data.password, 10);
        return this.repository.create({
            ...data,
            password,
        }, organizationId);
    }
    async update(id, data, organizationId) {
        if (data.password) {
            data.password = await bcryptjs_1.default.hash(data.password, 10);
        }
        return this.repository.update(id, data, organizationId);
    }
    async delete(id, organizationId) {
        return this.repository.delete(id, organizationId);
    }
    async activate(id, organizationId) {
        return this.repository.activate(id, organizationId);
    }
    async desactivate(id, organizationId) {
        return this.repository.desactivate(id, organizationId);
    }
}
exports.UsersService = UsersService;
