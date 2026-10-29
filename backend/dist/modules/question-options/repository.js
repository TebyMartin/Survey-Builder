"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionOptionRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class QuestionOptionRepository {
    create(data) {
        return prisma.questionOption.create({
            data,
        });
    }
    update(id, data) {
        return prisma.questionOption.update({
            where: { id },
            data,
        });
    }
    delete(id) {
        return prisma.questionOption.delete({
            where: {
                id,
            },
        });
    }
    async reorder(questionId, from, to) {
        return prisma.$transaction(async (tx) => {
            const current = await tx.questionOption.findFirst({
                where: {
                    questionId,
                    order: from,
                },
            });
            const target = await tx.questionOption.findFirst({
                where: {
                    questionId,
                    order: to,
                },
            });
            if (!current || !target) {
                throw new Error("Opción no encontrada");
            }
            // Valor temporal para evitar romper la restricción UNIQUE
            await tx.questionOption.update({
                where: { id: current.id },
                data: {
                    order: -1,
                },
            });
            await tx.questionOption.update({
                where: { id: target.id },
                data: {
                    order: from,
                },
            });
            await tx.questionOption.update({
                where: { id: current.id },
                data: {
                    order: to,
                },
            });
            return true;
        });
    }
}
exports.QuestionOptionRepository = QuestionOptionRepository;
