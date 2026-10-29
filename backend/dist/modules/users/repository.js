"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UsersRepository {
    findAll(organizationId) {
        return prisma.user.findMany({
            where: {
                organizationId,
                role: {
                    not: "ADMIN",
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
                lastLoginAt: true,
                createdAt: true,
            },
        });
    }
    findById(id, organizationId) {
        return prisma.user.findFirst({
            where: {
                id,
                organizationId,
            },
        });
    }
    findByEmail(email) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    create(data, organizationId) {
        return prisma.user.create({
            data: {
                ...data,
                organizationId,
            },
        });
    }
    update(id, data, organizationId) {
        return prisma.user.updateMany({
            where: {
                id,
                organizationId,
            },
            data,
        });
    }
    desactivate(id, organizationId) {
        return prisma.user.updateMany({
            where: {
                id,
                organizationId,
            },
            data: {
                isActive: false,
            },
        });
    }
    activate(id, organizationId) {
        return prisma.user.updateMany({
            where: {
                id,
                organizationId,
            },
            data: {
                isActive: true,
            },
        });
    }
    async delete(id, organizationId) {
        return prisma.user.deleteMany({
            where: {
                id,
                organizationId,
            },
        });
    }
}
exports.UsersRepository = UsersRepository;
