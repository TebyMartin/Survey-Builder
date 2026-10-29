"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionMatrixRowRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class QuestionMatrixRowRepository {
    create(data) {
        return prisma.questionMatrixRow.create({
            data,
        });
    }
    update(id, data) {
        return prisma.questionMatrixRow.update({
            where: { id },
            data,
        });
    }
    delete(id) {
        return prisma.questionMatrixRow.delete({
            where: {
                id,
            },
        });
    }
    async reorder(questionId, from, to) {
        return prisma.$transaction(async (tx) => {
            const current = await tx.questionMatrixRow.findFirst({
                where: {
                    questionId,
                    order: from,
                },
            });
            const target = await tx.questionMatrixRow.findFirst({
                where: {
                    questionId,
                    order: to,
                },
            });
            if (!current || !target) {
                throw new Error("Fila no encontrada");
            }
            // Valor temporal para evitar romper la restricción UNIQUE
            await tx.questionMatrixRow.update({
                where: { id: current.id },
                data: {
                    order: -1,
                },
            });
            await tx.questionMatrixRow.update({
                where: { id: target.id },
                data: {
                    order: from,
                },
            });
            await tx.questionMatrixRow.update({
                where: { id: current.id },
                data: {
                    order: to,
                },
            });
            return true;
        });
    }
}
exports.QuestionMatrixRowRepository = QuestionMatrixRowRepository;
