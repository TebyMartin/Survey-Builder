import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class QuestionOptionRepository {
  create(data: {
    questionId: string;
    label: string;
    value?: string;
    order: number;
    isOther?: boolean;
  }) {
    return prisma.questionOption.create({
      data,
    });
  }

  update(
    id: string,
    data: {
      label?: string;
      value?: string;
      order?: number;
      isOther?: boolean;
    },
  ) {
    return prisma.questionOption.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return prisma.questionOption.delete({
      where: {
        id,
      },
    });
  }

  async reorder(questionId: string, from: number, to: number) {
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
