import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class QuestionMatrixRowRepository {
  create(data: {
    questionId: string;
    label: string;
    value?: string;
    order: number;
  }) {
    return prisma.questionMatrixRow.create({
      data,
    });
  }

  update(
    id: string,
    data: {
      label?: string;
      value?: string;
      order?: number;
    },
  ) {
    return prisma.questionMatrixRow.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return prisma.questionMatrixRow.delete({
      where: {
        id,
      },
    });
  }

  async reorder(questionId: string, from: number, to: number) {
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
