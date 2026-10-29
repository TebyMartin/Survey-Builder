import { PrismaClient, SubmissionStatus } from "@prisma/client";

const prisma = new PrismaClient();

export class SubmissionRepository {
  // =========================================================
  // CREAR SUBMISSION
  // =========================================================

  async create(data: {
    surveyId: string;
    assignmentId?: string;
    interviewerId?: string;
    organizationId: string;
    latitude?: number;
    longitude?: number;
    ipAddress?: string;
    deviceInfo?: string;
  }) {
    // Verificamos nuevamente que la encuesta
    // pertenezca a la organización del usuario.
    const survey = await prisma.survey.findFirst({
      where: {
        id: data.surveyId,
        organizationId: data.organizationId,
        deletedAt: null,
      },
    });

    if (!survey) {
      throw new Error("La encuesta no pertenece a esta organización");
    }

    return prisma.submission.create({
      data: {
        surveyId: data.surveyId,
        assignmentId: data.assignmentId,
        interviewerId: data.interviewerId,
        latitude: data.latitude,
        longitude: data.longitude,
        ipAddress: data.ipAddress,
        deviceInfo: data.deviceInfo,
      },
    });
  }
  // =========================================================
  // GUARDAR RESPUESTAS
  // =========================================================

  async saveAnswers(
    submissionId: string,
    answers: {
      questionId: string;
      value?: string;
      options?: string[];
      matrix?: {
        rowId: string;
        value?: string;
      }[];
      composite?: {
        fieldId: string;
        value?: string;
      }[];
    }[],
    organizationId: string,
  ) {
    const submission = await prisma.submission.findFirst({
      where: {
        id: submissionId,
        survey: {
          organizationId,
          deletedAt: null,
        },
      },
    });

    if (!submission) {
      throw new Error("La encuesta no pertenece a esta organización");
    }

    return prisma.$transaction(async (tx) => {
      for (const answer of answers) {
        const existingAnswer = await tx.answer.findFirst({
          where: {
            submissionId,
            questionId: answer.questionId,
          },
        });

        let savedAnswer;

        if (existingAnswer) {
          savedAnswer = await tx.answer.update({
            where: {
              id: existingAnswer.id,
            },
            data: {
              value:
                answer.matrix?.length ||
                answer.options?.length ||
                answer.composite?.length
                  ? null
                  : answer.value,
            },
          });

          await tx.answerOption.deleteMany({
            where: {
              answerId: existingAnswer.id,
            },
          });

          await tx.answerMatrix.deleteMany({
            where: {
              answerId: existingAnswer.id,
            },
          });
          await tx.compositeAnswer.deleteMany({
            where: {
              answerId: existingAnswer.id,
            },
          });
        } else {
          savedAnswer = await tx.answer.create({
            data: {
              submissionId,
              questionId: answer.questionId,
              value:
                answer.matrix?.length ||
                answer.options?.length ||
                answer.composite?.length
                  ? null
                  : answer.value,
            },
          });
        }

        // =====================================================
        // GUARDAR OPCIONES
        // =====================================================

        if (answer.options?.length) {
          for (const optionId of answer.options) {
            const questionOption = await tx.questionOption.findUnique({
              where: {
                id: optionId,
              },
            });

            if (!questionOption) {
              continue;
            }

            await tx.answerOption.create({
              data: {
                answerId: savedAnswer.id,
                questionOptionId: optionId,

                // Si es "Otro", guardamos el texto escrito
                value: questionOption.isOther ? (answer.value ?? null) : null,
              },
            });
          }
        }

        // =====================================================
        // GUARDAR MATRIZ
        // =====================================================

        if (answer.matrix?.length) {
          console.log(
            "🟠 MATRIX QUE LLEGA AL REPOSITORY:",
            JSON.stringify(answer.matrix, null, 2),
          );
          for (const row of answer.matrix) {
            const matrixRow = await tx.questionMatrixRow.findFirst({
              where: {
                id: row.rowId,
                questionId: answer.questionId,
              },
            });

            if (!matrixRow) {
              continue;
            }
            console.log("🟡 CREANDO ANSWER MATRIX:", {
              answerId: savedAnswer.id,
              rowId: row.rowId,
              value: row.value,
            });
            await tx.answerMatrix.create({
              data: {
                answerId: savedAnswer.id,
                rowId: row.rowId,
                value: row.value ?? null,
              },
            });
          }
        }

        // =====================================================
        // GUARDAR COMPOSITE
        // =====================================================
        if (answer.composite?.length) {
          for (const field of answer.composite) {
            const compositeField = await tx.compositeField.findFirst({
              where: {
                id: field.fieldId,
                questionId: answer.questionId,
              },
            });

            console.log("🟡 REQUIRED DEL CAMPO:", {
              fieldId: compositeField?.id,
              label: compositeField?.label,
              required: compositeField?.required,
            });

            console.log("🔵 COMPOSITE QUE LLEGA AL REPOSITORY:", {
              questionId: answer.questionId,
              fieldId: field.fieldId,
              value: field.value,
            });

            if (!compositeField) {
              continue;
            }

            const createdCompositeAnswer = await tx.compositeAnswer.create({
              data: {
                answerId: savedAnswer.id,
                fieldId: field.fieldId,
                value: field.value ?? null,
              },
            });

            console.log(
              "🟣 COMPOSITE ANSWER GUARDADO:",
              createdCompositeAnswer,
            );
          }
        }
      }

      return true;
    });
  }

  // =========================================================
  // COMPLETAR SUBMISSION
  // =========================================================

  async complete(submissionId: string, organizationId: string) {
    // Verificamos que pertenezca a la organización
    const submission = await prisma.submission.findFirst({
      where: {
        id: submissionId,
        survey: {
          organizationId,
          deletedAt: null,
        },
      },
      include: {
        survey: {
          include: {
            sections: {
              include: {
                questions: {
                  include: {
                    compositeFields: true,
                  },
                },
              },
            },
          },
        },
        answers: {
          include: {
            options: true,
            matrixAnswers: true,
            compositeAnswers: true,
          },
        },
      },
    });

    if (!submission) {
      throw new Error("La encuesta no pertenece a esta organización");
    }
    console.log(
      "🟢 VALIDACIÓN COMPLETE - PREGUNTAS Y RESPUESTAS:",
      JSON.stringify(
        {
          questions: submission.survey.sections.flatMap((section) =>
            section.questions.map((question) => ({
              id: question.id,
              title: question.title,
              type: question.type,
              required: question.required,
              compositeFields: question.compositeFields.map((field) => ({
                id: field.id,
                label: field.label,
                required: field.required,
              })),
            })),
          ),
          answers: submission.answers.map((answer) => ({
            questionId: answer.questionId,
            value: answer.value,
            options: answer.options,
            matrixAnswers: answer.matrixAnswers,
            compositeAnswers: answer.compositeAnswers,
          })),
        },
        null,
        2,
      ),
    );
    // =====================================================
    // VALIDAR PREGUNTAS OBLIGATORIAS
    // =====================================================

    const questions = submission.survey.sections.flatMap(
      (section) => section.questions,
    );

    for (const question of questions) {
      if (!question.required) {
        continue;
      }

      const answer = submission.answers.find(
        (answer) => answer.questionId === question.id,
      );

      // ---------------------------------------------------
      // PREGUNTA COMPOSITE
      // ---------------------------------------------------

      if (question.type === "COMPOSITE") {
        for (const field of question.compositeFields) {
          if (!field.required) {
            continue;
          }

          const compositeAnswer = answer?.compositeAnswers.find(
            (item) => item.fieldId === field.id,
          );

          if (
            !compositeAnswer ||
            compositeAnswer.value === null ||
            compositeAnswer.value === undefined ||
            compositeAnswer.value.trim() === ""
          ) {
            throw new Error(`El campo "${field.label}" es obligatorio`);
          }
        }

        continue;
      }
      // ---------------------------------------------------
      // PREGUNTAS NORMALES
      // ---------------------------------------------------

      const hasValue =
        answer &&
        ((answer.value !== null &&
          answer.value !== undefined &&
          answer.value.trim() !== "") ||
          answer.options.length > 0 ||
          answer.matrixAnswers.length > 0);

      if (!hasValue) {
        throw new Error(`La pregunta "${question.title}" es obligatoria`);
      }
    }

    // =====================================================
    // COMPLETAR SUBMISSION
    // =====================================================

    return prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        status: SubmissionStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }
  // =========================================================
  // OBTENER RESULTADOS
  // =========================================================

  async getResults(surveyId: string, organizationId: string) {
    return prisma.survey.findFirst({
      where: {
        id: surveyId,
        organizationId,
        deletedAt: null,
      },
      include: {
        submissions: {
          include: {
            answers: {
              include: {
                question: {
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
                },
                options: {
                  include: {
                    questionOption: true,
                  },
                },
                matrixAnswers: {
                  include: {
                    row: true,
                  },
                },
                compositeAnswers: {
                  include: {
                    field: true,
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
  // BUSCAR SUBMISSION CON RESPUESTAS
  // =========================================================

  async findSubmissionWithAnswers(
    submissionId: string,
    organizationId: string,
  ) {
    return prisma.submission.findFirst({
      where: {
        id: submissionId,
        survey: {
          organizationId,
          deletedAt: null,
        },
      },
      include: {
        survey: {
          include: {
            sections: {
              include: {
                questions: {
                  include: {
                    compositeFields: {
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
        answers: {
          include: {
            matrixAnswers: {
              include: {
                row: true,
              },
            },

            options: {
              include: {
                questionOption: true,
              },
            },

            compositeAnswers: {
              include: {
                field: true,
              },
            },
          },
        },
      },
    });
  }
  async findSubmissionOrganization(submissionId: string) {
    return prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
      select: {
        survey: {
          select: {
            organizationId: true,
          },
        },
      },
    });
  }
}
