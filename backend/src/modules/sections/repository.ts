import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SectionRepository {
  async create(data: {
    surveyId: string;
    title: string;
    description?: string;
  }) {
    const lastSection = await prisma.section.findFirst({
      where: {
        surveyId: data.surveyId,
      },
      orderBy: {
        order: "desc",
      },
    });

    const nextOrder = lastSection ? lastSection.order + 1 : 0;

    return prisma.section.create({
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
      description?: string;
    },
  ) {
    return prisma.section.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.section.delete({
      where: {
        id,
      },
    });
  }
  async findById(id: string) {
    return prisma.section.findUnique({
      where: {
        id,
      },
      include: {
        questions: {
          include: {
            options: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }

  async duplicate(id: string) {
    const section = await this.findById(id);

    if (!section) {
      throw new Error("Sección no encontrada");
    }

    return prisma.section.create({
      data: {
        surveyId: section.surveyId,
        title: `${section.title} (copia)`,
        description: section.description,
        order: section.order + 1,

        questions: {
          create: section.questions.map((question) => ({
            title: question.title,
            type: question.type,
            required: question.required,
            placeholder: question.placeholder,
            helpText: question.helpText,
            order: question.order,

            options: {
              create: question.options.map((option) => ({
                label: option.label,
                value: option.value,
                order: option.order,
              })),
            },
          })),
        },
      },

      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }
  async reorder(
    sections: {
      id: string;
      order: number;
    }[],
  ) {
    return prisma.$transaction(
      sections.map((section) =>
        prisma.section.update({
          where: {
            id: section.id,
          },
          data: {
            order: section.order,
          },
        }),
      ),
    );
  }
}
