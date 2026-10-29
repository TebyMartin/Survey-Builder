import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class QuestionRepository {
  async create(data: {
    sectionId: string;
    title: string;
    type: any;
    order: number;
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    description?: string;
    isRepeatable?: boolean;
  }) {
    const lastQuestion = await prisma.question.findFirst({
      where: {
        sectionId: data.sectionId,
      },
      orderBy: {
        order: "desc",
      },
    });

    const nextOrder = lastQuestion ? lastQuestion.order + 1 : 0;

    return prisma.question.create({
      data: {
        ...data,
        order: nextOrder,
      },
    });
  }
  async update(
    id: string,
    data: {
      title?: string;
      type?: any;
      placeholder?: string;
      helpText?: string;
      required?: boolean;
      description?: string;
      isRepeatable?: boolean;

      compositeFields?: {
        id?: string;
        label: string;
        type: any;
        placeholder?: string;
        helpText?: string;
        required?: boolean;
        minLength?: number | null;
        maxLength?: number | null;
        minValue?: number | null;
        maxValue?: number | null;
        defaultValue?: string | null;
        options?: {
          id?: string;
          label: string;
          value?: string;
          isOther?: boolean;
          isActive?: boolean;
          order: number;
        }[];
        order: number;
      }[];
    },
  ) {
    const { compositeFields, ...questionData } = data;

    return prisma.$transaction(async (tx) => {
      const question = await tx.question.update({
        where: {
          id,
        },
        data: questionData,
      });

      if (compositeFields !== undefined) {
        // Eliminamos los campos que ya no vienen
        await tx.compositeField.deleteMany({
          where: {
            questionId: id,
            id: {
              notIn: compositeFields
                .filter((field) => field.id)
                .map((field) => field.id as string),
            },
          },
        });

        for (const field of compositeFields) {
          let savedField;

          if (field.id) {
            savedField = await tx.compositeField.update({
              where: {
                id: field.id,
              },
              data: {
                label: field.label,
                type: field.type,
                placeholder: field.placeholder,
                helpText: field.helpText,
                required: field.required ?? false,
                minLength: field.minLength,
                maxLength: field.maxLength,
                minValue: field.minValue,
                maxValue: field.maxValue,
                defaultValue: field.defaultValue,
                order: field.order,
              },
            });
          } else {
            savedField = await tx.compositeField.create({
              data: {
                questionId: id,
                label: field.label,
                type: field.type,
                placeholder: field.placeholder,
                helpText: field.helpText,
                required: field.required ?? false,
                minLength: field.minLength,
                maxLength: field.maxLength,
                minValue: field.minValue,
                maxValue: field.maxValue,
                defaultValue: field.defaultValue,
                order: field.order,
              },
            });
          }

          if (field.options !== undefined) {
            await tx.compositeFieldOption.deleteMany({
              where: {
                fieldId: savedField.id,
              },
            });

            if (field.options.length) {
              await tx.compositeFieldOption.createMany({
                data: field.options.map((option) => ({
                  fieldId: savedField.id,
                  label: option.label,
                  value: option.value,
                  isOther: option.isOther ?? false,
                  isActive: option.isActive ?? true,
                  order: option.order,
                })),
              });
            }
          }
        }
      }

      return tx.question.findUnique({
        where: {
          id,
        },
        include: {
          options: true,
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
      });
    });
  }

  async delete(id: string) {
    return prisma.question.delete({
      where: {
        id,
      },
    });
  }
  async reorder(
    questions: {
      id: string;
      order: number;
    }[],
  ) {
    if (questions.length === 0) {
      return;
    }

    const ids = questions.map((question) => question.id);
    const orders = questions.map((question) => question.order);

    if (
      new Set(ids).size !== ids.length ||
      new Set(orders).size !== orders.length ||
      orders.some((order) => !Number.isInteger(order) || order < 0) ||
      Math.max(...orders) !== orders.length - 1
    ) {
      throw new Error("El orden de las preguntas no es válido.");
    }

    return prisma.$transaction(async (transaction) => {
      const currentQuestions = await transaction.question.findMany({
        where: { id: { in: ids } },
        select: { id: true, sectionId: true, order: true },
      });

      if (currentQuestions.length !== questions.length) {
        throw new Error("No se encontraron todas las preguntas a reordenar.");
      }

      const sectionId = currentQuestions[0].sectionId;
      const sectionQuestions = await transaction.question.findMany({
        where: { sectionId },
        select: { id: true, order: true },
      });

      if (
        sectionQuestions.length !== questions.length ||
        sectionQuestions.some((question) => !ids.includes(question.id))
      ) {
        throw new Error(
          "El orden debe incluir todas las preguntas de una misma sección.",
        );
      }

      const temporaryOrder = Math.max(
        ...sectionQuestions.map((question) => question.order),
        -1,
      );

      for (const [index, question] of questions.entries()) {
        await transaction.question.update({
          where: { id: question.id },
          data: { order: temporaryOrder + index + 1 },
        });
      }

      for (const question of questions) {
        await transaction.question.update({
          where: { id: question.id },
          data: { order: question.order },
        });
      }
    });
  }
  async findById(id: string) {
    return prisma.question.findUnique({
      where: {
        id,
      },
      include: {
        options: true,
      },
    });
  }
  async duplicate(question: any) {
    return prisma.$transaction(async (tx) => {
      await tx.question.updateMany({
        where: {
          sectionId: question.sectionId,
          order: {
            gt: question.order,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });

      return tx.question.create({
        data: {
          sectionId: question.sectionId,

          title: `${question.title} (copia)`,

          type: question.type,

          placeholder: question.placeholder,

          helpText: question.helpText,

          required: question.required,
          isRepeatable: question.isRepeatable,

          order: question.order + 1,

          options: {
            create: question.options.map((option: any) => ({
              label: option.label,
              value: option.value,
              isOther: option.isOther,
              order: option.order,
            })),
          },
        },

        include: {
          options: true,
        },
      });
    });
  }
  async increaseOrderAfter(sectionId: string, order: number) {
    return prisma.question.updateMany({
      where: {
        sectionId,
        order: {
          gt: order,
        },
      },
      data: {
        order: {
          increment: 1,
        },
      },
    });
  }
}
