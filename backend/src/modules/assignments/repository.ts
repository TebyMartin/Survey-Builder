import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AssignmentsRepository {
  // =========================================================
  // BUSCAR ENCUESTA
  // =========================================================

  async findSurveyById(surveyId: string, organizationId?: string) {
    return prisma.survey.findFirst({
      where: {
        id: surveyId,
        ...(organizationId && {
          organizationId,
        }),
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        status: true,
        organizationId: true,
      },
    });
  }

  // =========================================================
  // OBTENER TODAS LAS ASIGNACIONES
  // =========================================================

  async findAll(organizationId: string) {
    return prisma.surveyAssignment.findMany({
      where: {
        survey: {
          organizationId,
          deletedAt: null,
        },
      },

      include: {
        survey: {
          select: {
            id: true,
            title: true,
          },
        },

        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },

      orderBy: {
        assignedAt: "desc",
      },
    });
  }

  // =========================================================
  // BUSCAR ASIGNACIÓN POR ID
  // =========================================================

  async findById(id: string, organizationId: string) {
    return prisma.surveyAssignment.findFirst({
      where: {
        id,
        survey: {
          organizationId,
          deletedAt: null,
        },
      },

      include: {
        survey: {
          include: {
            sections: {
              orderBy: {
                order: "asc",
              },

              include: {
                questions: {
                  include: {
                    options: true,

                    matrixRows: {
                      orderBy: {
                        order: "asc",
                      },
                    },

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

                  orderBy: {
                    order: "asc",
                  },
                },
              },
            },
          },
        },

        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  // =========================================================
  // CREAR ASIGNACIÓN
  // =========================================================

  async create(data: any, organizationId: string) {
    // Verificamos que la encuesta pertenezca
    // a la organización
    const survey = await prisma.survey.findFirst({
      where: {
        id: data.surveyId,
        organizationId,
        deletedAt: null,
      },
    });

    if (!survey) {
      throw new Error("La encuesta no pertenece a esta organización.");
    }

    // Buscamos si ya existe una asignación
    // para la misma encuesta y el mismo usuario.
    const existingAssignment = await prisma.surveyAssignment.findFirst({
      where: {
        surveyId: data.surveyId,
        userId: data.userId,
        status: {
          not: "COMPLETED",
        },
      },
    });

    // Si ya existe y no está completada,
    // aumentamos el objetivo.
    if (existingAssignment) {
      return prisma.surveyAssignment.update({
        where: {
          id: existingAssignment.id,
        },

        data: {
          targetResponses: {
            increment: data.targetResponses,
          },
        },

        include: {
          survey: true,
          user: true,
        },
      });
    }

    // Si no existe una asignación pendiente,
    // creamos una nueva.
    return prisma.surveyAssignment.create({
      data: {
        surveyId: data.surveyId,
        userId: data.userId,
        targetResponses: data.targetResponses,
      },

      include: {
        survey: true,
        user: true,
      },
    });
  }

  // =========================================================
  // ELIMINAR ASIGNACIÓN
  // =========================================================

  async delete(id: string, organizationId: string) {
    // Primero verificamos que pertenezca
    // a la organización.
    const assignment = await prisma.surveyAssignment.findFirst({
      where: {
        id,
        survey: {
          organizationId,
          deletedAt: null,
        },
      },
    });

    if (!assignment) {
      throw new Error(
        "La asignación no existe o no pertenece a esta organización.",
      );
    }

    return prisma.surveyAssignment.delete({
      where: {
        id,
      },
    });
  }

  // =========================================================
  // BUSCAR POR ENCUESTA Y USUARIO
  // =========================================================

  async findBySurveyAndUser(
    surveyId: string,
    userId: string,
    organizationId: string,
  ) {
    return prisma.surveyAssignment.findFirst({
      where: {
        surveyId,
        userId,

        survey: {
          organizationId,
          deletedAt: null,
        },
      },
    });
  }

  // =========================================================
  // ASIGNACIONES DE UN USUARIO
  // =========================================================

  async findByUser(userId: string, organizationId: string) {
    return prisma.surveyAssignment.findMany({
      where: {
        userId,

        survey: {
          organizationId,
          deletedAt: null,
        },
      },

      include: {
        survey: {
          select: {
            id: true,
            title: true,
          },
        },

        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },

      orderBy: {
        assignedAt: "desc",
      },
    });
  }

  // =========================================================
  // COMPLETAR ASIGNACIÓN
  // =========================================================

  async completeAssignment(
    surveyId: string,
    userId: string,
    organizationId: string,
  ) {
    return prisma.surveyAssignment.updateMany({
      where: {
        surveyId,
        userId,

        survey: {
          organizationId,
          deletedAt: null,
        },
      },

      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });
  }

  // =========================================================
  // AUMENTAR RESPUESTAS COMPLETADAS
  // =========================================================

  async increaseCompletedResponses(id: string, organizationId: string) {
    const assignment = await prisma.surveyAssignment.findFirst({
      where: {
        id,

        survey: {
          organizationId,
          deletedAt: null,
        },
      },
    });

    if (!assignment) {
      throw new Error(
        "La asignación no existe o no pertenece a esta organización.",
      );
    }

    const updatedAssignment = await prisma.surveyAssignment.update({
      where: {
        id,
      },

      data: {
        completedResponses: {
          increment: 1,
        },
      },
    });

    if (
      updatedAssignment.completedResponses >= updatedAssignment.targetResponses
    ) {
      return prisma.surveyAssignment.update({
        where: {
          id,
        },

        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
    }

    return updatedAssignment;
  }

  // =========================================================
  // ACTUALIZAR OBJETIVO
  // =========================================================

  async updateTargetResponses(
    id: string,
    targetResponses: number,
    organizationId: string,
  ) {
    const assignment = await prisma.surveyAssignment.findFirst({
      where: {
        id,

        survey: {
          organizationId,
          deletedAt: null,
        },
      },
    });

    if (!assignment) {
      throw new Error(
        "La asignación no existe o no pertenece a esta organización.",
      );
    }

    return prisma.surveyAssignment.update({
      where: {
        id,
      },

      data: {
        targetResponses,

        // Si vuelve a necesitar entrevistas,
        // vuelve a quedar pendiente.
        status: "PENDING",
        completedAt: null,
      },
    });
  }

  // =========================================================
  // INCREMENTAR RESPUESTAS
  // =========================================================

  async incrementCompletedResponses(
    surveyId: string,
    userId: string,
    organizationId: string,
  ) {
    return prisma.surveyAssignment.updateMany({
      where: {
        surveyId,
        userId,

        survey: {
          organizationId,
          deletedAt: null,
        },
      },

      data: {
        completedResponses: {
          increment: 1,
        },
      },
    });
  }

  // =========================================================
  // ACTUALIZAR ESTADO
  // =========================================================

  async refreshStatus(
    surveyId: string,
    userId: string,
    organizationId: string,
  ) {
    const assignment = await prisma.surveyAssignment.findFirst({
      where: {
        surveyId,
        userId,

        survey: {
          organizationId,
          deletedAt: null,
        },
      },
    });

    if (!assignment) {
      return;
    }

    if (assignment.completedResponses >= assignment.targetResponses) {
      return prisma.surveyAssignment.update({
        where: {
          id: assignment.id,
        },

        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
    }

    return prisma.surveyAssignment.update({
      where: {
        id: assignment.id,
      },

      data: {
        status: "PENDING",
        completedAt: null,
      },
    });
  }

  // =========================================================
  // BUSCAR ASIGNACIÓN SIMPLE
  // =========================================================

  async findByIdSimple(id: string, organizationId: string) {
    return prisma.surveyAssignment.findFirst({
      where: {
        id,

        survey: {
          organizationId,
          deletedAt: null,
        },
      },
    });
  }
}
