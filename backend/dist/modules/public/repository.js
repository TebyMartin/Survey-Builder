"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PublicRepository {
    async findSurveyByToken(token) {
        return prisma.survey.findFirst({
            where: {
                publicToken: token,
                status: "PUBLISHED",
                deletedAt: null,
            },
            include: {
                sections: {
                    orderBy: {
                        order: "asc",
                    },
                    include: {
                        questions: {
                            orderBy: {
                                order: "asc",
                            },
                            include: {
                                options: {
                                    orderBy: {
                                        order: "asc",
                                    },
                                },
                                matrixRows: {
                                    orderBy: {
                                        order: "asc",
                                    },
                                },
                                // ==========================================
                                // CAMPOS DE PREGUNTA COMPUESTA
                                // ==========================================
                                compositeFields: {
                                    orderBy: {
                                        order: "asc",
                                    },
                                    include: {
                                        options: {
                                            orderBy: {
                                                order: "asc",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
}
exports.PublicRepository = PublicRepository;
