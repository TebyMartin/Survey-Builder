"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const app_1 = require("../../app");
class AuthRepository {
    findByEmail(email) {
        throw new Error("Method not implemented.");
    }
    async findUserByEmail(email) {
        return app_1.prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                organization: true,
            },
        });
    }
    async createOrganizationAndUser(data) {
        const slug = data.organizationName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
        return app_1.prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: {
                    name: data.organizationName,
                    slug: `${slug}-${Date.now()}`,
                },
            });
            const user = await tx.user.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    role: "ADMIN",
                    organizationId: organization.id,
                },
                include: {
                    organization: true,
                },
            });
            return user;
        });
    }
    async findUserById(id) {
        return app_1.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                organization: true,
            },
        });
    }
    async updateLastLogin(userId) {
        return app_1.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                lastLoginAt: new Date(),
            },
        });
    }
    async register(data) {
        return app_1.prisma.$transaction(async (tx) => {
            // Buscar un slug disponible
            let slug = data.organizationSlug;
            let counter = 1;
            while (await tx.organization.findUnique({ where: { slug } })) {
                slug = `${data.organizationSlug}-${counter}`;
                counter++;
            }
            // Crear organización
            const organization = await tx.organization.create({
                data: {
                    name: data.organizationName,
                    slug,
                },
            });
            // Crear administrador asociado a esa organización
            const user = await tx.user.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    role: "ADMIN",
                    organizationId: organization.id,
                },
                include: {
                    organization: true,
                },
            });
            return user;
        });
    }
}
exports.AuthRepository = AuthRepository;
