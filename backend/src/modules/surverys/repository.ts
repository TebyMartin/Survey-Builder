import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SurveyRepository {
  // =========================================================
  // RESTAURAR
  // =========================================================

  async restore(id: string, organizationId: string) {
    return prisma.survey.updateMany({
      where: {
        id,
        organizationId,
      },
      data: {
        status: "PUBLISHED",
      },
    });
  }

  // =========================================================
  // ARCHIVAR
  // =========================================================

  async archive(id: string, organizationId: string) {
    return prisma.survey.updateMany({
      where: {
        id,
        organizationId,
      },
      data: {
        status: "ARCHIVED",
      },
    });
  }

  // =========================================================
  // RESULTADOS
  // =========================================================

  async getResults(surveyId: string, organizationId: string) {
    return prisma.survey.findFirst({
      where: {
        id: surveyId,
        organizationId,
      },
      include: {
        submissions: {
          include: {
            answers: {
              include: {
                question: {
                  include: {
                    options: true,
                  },
                },
                options: {
                  include: {
                    questionOption: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // =========================================================
  // CREAR
  // =========================================================

  async create(data: {
    title: string;
    description?: string;
    estimatedTime?: number;
    allowAnonymous?: boolean;
    isTemplate?: boolean;
    organizationId: string;
    createdById: string;
  }) {
    return prisma.survey.create({
      data,
    });
  }

  // =========================================================
  // LISTAR POR ORGANIZACIÓN
  // =========================================================

  async findAll(organizationId: string) {
    return prisma.survey.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            sections: true,
            submissions: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  // =========================================================
  // BUSCAR POR ID + ORGANIZACIÓN
  // =========================================================

  async findById(id: string, organizationId: string) {
    return prisma.survey.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });
  }

  // =========================================================
  // ACTUALIZAR BUILDER
  // =========================================================

  async updateBuilder(surveyId: string, data: any) {
    return prisma.$transaction(async (tx) => {
      // 1. Actualizar datos generales

      await tx.survey.update({
        where: {
          id: surveyId,
        },
        data: {
          title: data.title,
          description: data.description,
          version: {
            increment: 1,
          },
        },
      });

      // =====================================================
      // 2. BORRAR RESPUESTAS EXISTENTES
      // =====================================================

      await tx.answerOption.deleteMany({
        where: {
          answer: {
            submission: {
              surveyId,
            },
          },
        },
      });

      await tx.answer.deleteMany({
        where: {
          submission: {
            surveyId,
          },
        },
      });

      // =====================================================
      // 3. BORRAR ESTRUCTURA ANTERIOR
      // =====================================================

      // Borrar opciones de preguntas normales
      await tx.questionOption.deleteMany({
        where: {
          question: {
            section: {
              surveyId,
            },
          },
        },
      });

      // Borrar respuestas de campos compuestos
      await tx.compositeAnswer.deleteMany({
        where: {
          answer: {
            submission: {
              surveyId,
            },
          },
        },
      });

      // Los CompositeFieldOption y CompositeField se eliminan
      // automáticamente al borrar las preguntas gracias a onDelete: Cascade.

      await tx.question.deleteMany({
        where: {
          section: {
            surveyId,
          },
        },
      });

      await tx.section.deleteMany({
        where: {
          surveyId,
        },
      });

      // =====================================================
      // 4. CREAR NUEVA ESTRUCTURA
      // =====================================================

      for (
        let sectionIndex = 0;
        sectionIndex < data.sections.length;
        sectionIndex++
      ) {
        const sectionData = data.sections[sectionIndex];

        const section = await tx.section.create({
          data: {
            surveyId,
            title: sectionData.title,
            description: sectionData.description,
            order: sectionIndex + 1,
          },
        });

        // ===================================================
        // CREAR PREGUNTAS
        // ===================================================

        for (
          let questionIndex = 0;
          questionIndex < sectionData.questions.length;
          questionIndex++
        ) {
          const questionData = sectionData.questions[questionIndex];

          const question = await tx.question.create({
            data: {
              sectionId: section.id,

              title: questionData.title,
              type: questionData.type,

              placeholder: questionData.placeholder,

              helpText: questionData.helpText,

              required: questionData.required ?? false,

              minLength: questionData.minLength,

              maxLength: questionData.maxLength,

              minValue: questionData.minValue,

              maxValue: questionData.maxValue,

              defaultValue: questionData.defaultValue,

              order: questionIndex + 1,

              // IMPORTANTE:
              // Guardamos la condición
              showWhenQuestionId: questionData.showWhenQuestionId ?? null,

              showWhenValue: questionData.showWhenValue ?? null,
            },
          });

          // =================================================
          // CREAR OPCIONES
          // =================================================

          // =================================================
          // CREAR CAMPOS DE PREGUNTA COMPLEJA
          // =================================================

          if (
            questionData.type === "COMPOSITE" &&
            questionData.compositeFields?.length
          ) {
            for (
              let fieldIndex = 0;
              fieldIndex < questionData.compositeFields.length;
              fieldIndex++
            ) {
              const fieldData = questionData.compositeFields[fieldIndex];

              const field = await tx.compositeField.create({
                data: {
                  questionId: question.id,

                  label: fieldData.label,

                  type: fieldData.type,

                  placeholder: fieldData.placeholder,

                  helpText: fieldData.helpText,

                  minLength: fieldData.minLength,

                  maxLength: fieldData.maxLength,

                  minValue: fieldData.minValue,

                  maxValue: fieldData.maxValue,

                  defaultValue: fieldData.defaultValue,

                  required: fieldData.required ?? false,

                  order: fieldIndex + 1,
                },
              });

              // =============================================
              // OPCIONES DEL SUBCAMPO
              // =============================================

              if (fieldData.options?.length) {
                for (
                  let optionIndex = 0;
                  optionIndex < fieldData.options.length;
                  optionIndex++
                ) {
                  const option = fieldData.options[optionIndex];

                  await tx.compositeFieldOption.create({
                    data: {
                      fieldId: field.id,

                      label: option.label,

                      value: option.value,

                      isOther: option.isOther ?? false,

                      isActive: true,

                      order: optionIndex + 1,
                    },
                  });
                }
              }
            }
          }
        }
      }

      // =====================================================
      // 5. DEVOLVER ENCUESTA COMPLETA
      // =====================================================

      return tx.survey.findUnique({
        where: {
          id: surveyId,
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
    });
  }

  // =========================================================
  // BUILDER
  // =========================================================

  async findBuilderById(surveyId: string, organizationId: string) {
    return prisma.survey.findFirst({
      where: {
        id: surveyId,
        organizationId,
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

  // =========================================================
  // PUBLICAR
  // =========================================================

  async publish(id: string, organizationId: string) {
    return prisma.survey.updateMany({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  }

  // =========================================================
  // CERRAR
  // =========================================================

  async close(surveyId: string, organizationId: string) {
    return prisma.survey.updateMany({
      where: {
        id: surveyId,
        organizationId,
        deletedAt: null,
      },
      data: {
        status: "CLOSED",
        endsAt: new Date(),
      },
    });
  }

  // =========================================================
  // BUSCAR PARA PUBLICAR
  // =========================================================

  async findByIdForPublish(surveyId: string, organizationId: string) {
    return prisma.survey.findFirst({
      where: {
        id: surveyId,
        organizationId,
        deletedAt: null,
      },
      include: {
        sections: {
          include: {
            questions: {
              include: {
                options: true,
                matrixRows: true,

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

  // =========================================================
  // BUSCAR SOLAMENTE POR ID
  // =========================================================
  //
  // Lo dejamos por compatibilidad.
  // Para operaciones administrativas nuevas,
  // preferimos findById(id, organizationId).
  //
  // =========================================================

  async findByIdOnly(surveyId: string) {
    return prisma.survey.findUnique({
      where: {
        id: surveyId,
      },
    });
  }

  // =========================================================
  // ESTADO
  // =========================================================

  async findStatusById(surveyId: string, organizationId: string) {
    return prisma.survey.findFirst({
      where: {
        id: surveyId,
        organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
        startsAt: true,
        endsAt: true,
        allowAnonymous: true,
      },
    });
  }

  // =========================================================
  // ELIMINAR
  // =========================================================

  async delete(id: string, organizationId: string) {
    return prisma.survey.updateMany({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // =========================================================
  // DUPLICAR
  // =========================================================

  async duplicate(id: string, userId: string, organizationId: string) {
    const survey = await prisma.survey.findFirst({
      where: {
        id,
        organizationId,
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

    if (!survey) {
      throw new Error("Encuesta no encontrada");
    }

    return prisma.survey.create({
      data: {
        organizationId: organizationId,
        createdById: userId,

        title: survey.title,
        description: survey.description,

        status: "DRAFT",

        version: survey.version + 1,

        allowAnonymous: survey.allowAnonymous,

        estimatedTime: survey.estimatedTime,

        isTemplate: survey.isTemplate,

        sections: {
          create: survey.sections.map((section) => ({
            title: section.title,

            description: section.description,

            order: section.order,

            questions: {
              create: section.questions.map((question) => ({
                title: question.title,

                type: question.type,

                placeholder: question.placeholder,

                helpText: question.helpText,

                required: question.required,

                minLength: question.minLength,

                maxLength: question.maxLength,

                minValue: question.minValue,

                maxValue: question.maxValue,

                defaultValue: question.defaultValue,

                order: question.order,

                showWhenQuestionId: question.showWhenQuestionId,

                showWhenValue: question.showWhenValue,

                options: {
                  create: question.options.map((option) => ({
                    label: option.label,

                    value: option.value,

                    isOther: option.isOther,

                    isActive: option.isActive,

                    order: option.order,

                    matrixRows: {
                      create: question.matrixRows.map((row) => ({
                        label: row.label,
                        value: row.value,
                        order: row.order,
                      })),
                    },

                    compositeFields: {
                      create: question.compositeFields.map((field) => ({
                        label: field.label,
                        type: field.type,
                        placeholder: field.placeholder,
                        helpText: field.helpText,
                        minLength: field.minLength,
                        maxLength: field.maxLength,
                        minValue: field.minValue,
                        maxValue: field.maxValue,
                        defaultValue: field.defaultValue,
                        required: field.required,
                        order: field.order,

                        options: {
                          create: field.options.map((option) => ({
                            label: option.label,
                            value: option.value,
                            isOther: option.isOther,
                            isActive: option.isActive,
                            order: option.order,
                          })),
                        },
                      })),
                    },
                  })),
                },
              })),
            },
          })),
        },
      },

      include: {
        sections: {
          include: {
            questions: {
              include: {
                options: true,
                matrixRows: true,

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

  // =========================================================
  // ENCUESTA PÚBLICA
  // =========================================================
  //
  // NO usamos organizationId acá.
  //
  // El token público identifica la encuesta.
  //
  // =========================================================

  async findByPublicToken(token: string) {
    const survey = await prisma.survey.findFirst({
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
    });

    return survey;
  }
}
