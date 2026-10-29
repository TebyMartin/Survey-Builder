"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class OrganizationRepository {
    async findAll() {
        return prisma.organization.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                name: "asc",
            },
            include: {
                _count: {
                    select: {
                        users: true,
                        surveys: true,
                    },
                },
            },
        });
    }
    async findById(id) {
        return prisma.organization.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        users: true,
                        surveys: true,
                    },
                },
            },
        });
    }
    async findBySlug(slug) {
        return prisma.organization.findUnique({
            where: { slug },
        });
    }
    async create(data) {
        return prisma.organization.create({
            data: {
                name: data.name,
                slug: data.slug,
            },
        });
    }
    async update(id, data) {
        return prisma.organization.update({
            where: { id },
            data,
        });
    }
    async deactivate(id) {
        return prisma.organization.update({
            where: { id },
            data: {
                isActive: false,
            },
        });
    }
    async delete(id) {
        return prisma.organization.delete({
            where: { id },
        });
    }
}
exports.OrganizationRepository = OrganizationRepository;
