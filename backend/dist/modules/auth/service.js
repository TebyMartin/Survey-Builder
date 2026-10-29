"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const repository_1 = require("./repository");
class AuthService {
    repository = new repository_1.AuthRepository();
    async login(email, password) {
        const user = await this.repository.findUserByEmail(email);
        console.log("Usuario encontrado:", user);
        if (!user) {
            throw new Error("Credenciales inválidas");
        }
        const passwordMatches = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatches) {
            throw new Error("Credenciales inválidas");
        }
        await this.repository.updateLastLogin(user.id);
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return {
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        };
    }
    async register(data) {
        const exists = await this.repository.findUserByEmail(data.email);
        if (exists) {
            throw new Error("El email ya está registrado");
        }
        const password = await bcrypt_1.default.hash(data.password, 10);
        const slug = data.organizationName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        const user = await this.repository.register({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password,
            organizationName: data.organizationName,
            organizationSlug: slug,
        });
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return {
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                organization: {
                    id: user.organization.id,
                    name: user.organization.name,
                    slug: user.organization.slug,
                },
            },
        };
    }
    async me(userId) {
        const user = await this.repository.findUserById(userId);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt,
            organization: {
                id: user.organization.id,
                name: user.organization.name,
                slug: user.organization.slug,
            },
        };
    }
}
exports.AuthService = AuthService;
