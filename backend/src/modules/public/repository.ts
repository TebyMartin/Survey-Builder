import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PublicRepository {
  async findSurveyByToken(token: string) {
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
