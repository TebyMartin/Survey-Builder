"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SubmissionRepository {
    // =========================================================
    // CREAR SUBMISSION
    // =========================================================
    async create(data) {
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
        return prisma.$transaction(async (transaction) => {
            await transaction.$queryRaw `
        SELECT "id"
        FROM "surveys"
        WHERE "id" = ${data.surveyId}
        FOR UPDATE
      `;
            const latestSubmission = await transaction.submission.aggregate({
                where: { surveyId: data.surveyId },
                _max: { formNumber: true },
            });
            return transaction.submission.create({
                data: {
                    formNumber: (latestSubmission._max.formNumber ?? 0) + 1,
                    surveyId: data.surveyId,
                    assignmentId: data.assignmentId,
                    interviewerId: data.interviewerId,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    ipAddress: data.ipAddress,
                    deviceInfo: data.deviceInfo,
                },
            });
        });
    }
    async findForReview(organizationId) {
        return prisma.submission.findMany({
            where: {
                status: client_1.SubmissionStatus.COMPLETED,
                interviewerId: { not: null },
                survey: { organizationId, deletedAt: null },
            },
            include: {
                survey: { select: { id: true, title: true } },
                interviewer: {
                    select: { id: true, firstName: true, lastName: true },
                },
                answers: {
                    include: {
                        question: {
                            include: {
                                options: true,
                                matrixRows: { orderBy: { order: "asc" } },
                                compositeFields: {
                                    orderBy: { order: "asc" },
                                    include: { options: true },
                                },
                            },
                        },
                        options: { include: { questionOption: true } },
                        matrixAnswers: { include: { row: true } },
                        compositeAnswers: { include: { field: true } },
                    },
                },
                reviews: {
                    orderBy: { requestedAt: "desc" },
                    include: {
                        supervisor: {
                            select: { id: true, firstName: true, lastName: true },
                        },
                    },
                },
            },
            orderBy: [{ completedAt: "desc" }, { formNumber: "desc" }],
        });
    }
    async requestReview(submissionId, supervisorId, organizationId, comment) {
        return prisma.$transaction(async (transaction) => {
            await transaction.$queryRaw `
        SELECT "id"
        FROM "submissions"
        WHERE "id" = ${submissionId}
        FOR UPDATE
      `;
            const submission = await transaction.submission.findFirst({
                where: {
                    id: submissionId,
                    status: client_1.SubmissionStatus.COMPLETED,
                    interviewerId: { not: null },
                    survey: { organizationId, deletedAt: null },
                },
                select: { id: true },
            });
            if (!submission) {
                throw new Error("No se encontró una entrevista completada para revisar.");
            }
            const activeReview = await transaction.submissionReview.findFirst({
                where: {
                    submissionId,
                    status: "CHANGES_REQUESTED",
                },
                select: { id: true },
            });
            if (activeReview) {
                throw new Error("Esta entrevista ya tiene una corrección pendiente.");
            }
            return transaction.submissionReview.create({
                data: {
                    submissionId,
                    supervisorId,
                    comment,
                },
                include: {
                    supervisor: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                },
            });
        });
    }
    async approveReview(reviewId, organizationId) {
        const review = await prisma.submissionReview.findFirst({
            where: {
                id: reviewId,
                status: "UPDATED",
                submission: {
                    survey: { organizationId, deletedAt: null },
                },
            },
            select: { id: true },
        });
        if (!review) {
            throw new Error("Solo se pueden aprobar entrevistas ya modificadas.");
        }
        const updated = await prisma.submissionReview.updateMany({
            where: { id: reviewId, status: "UPDATED" },
            data: { status: "APPROVED", resolvedAt: new Date() },
        });
        if (updated.count !== 1) {
            throw new Error("La revisión cambió mientras se intentaba aprobar.");
        }
        return prisma.submissionReview.findUniqueOrThrow({
            where: { id: reviewId },
        });
    }
    async markLatestReviewUpdated(submissionId) {
        const latestReview = await prisma.submissionReview.findFirst({
            where: { submissionId, status: "CHANGES_REQUESTED" },
            orderBy: { requestedAt: "desc" },
            select: { id: true },
        });
        if (!latestReview) {
            return;
        }
        await prisma.submissionReview.update({
            where: { id: latestReview.id },
            data: { status: "UPDATED" },
        });
    }
    // =========================================================
    // GUARDAR RESPUESTAS
    // =========================================================
    async saveAnswers(submissionId, answers, organizationId, interviewerId) {
        const submission = await prisma.submission.findFirst({
            where: {
                id: submissionId,
                ...(interviewerId ? { interviewerId } : {}),
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
                            value: answer.matrix?.length ||
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
                }
                else {
                    savedAnswer = await tx.answer.create({
                        data: {
                            submissionId,
                            questionId: answer.questionId,
                            value: answer.matrix?.length ||
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
                    console.log("🟠 MATRIX QUE LLEGA AL REPOSITORY:", JSON.stringify(answer.matrix, null, 2));
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
                        console.log("🟣 COMPOSITE ANSWER GUARDADO:", createdCompositeAnswer);
                    }
                }
            }
            return true;
        });
    }
    // =========================================================
    // COMPLETAR SUBMISSION
    // =========================================================
    async complete(submissionId, organizationId, interviewerId) {
        // Verificamos que pertenezca a la organización
        const submission = await prisma.submission.findFirst({
            where: {
                id: submissionId,
                ...(interviewerId ? { interviewerId } : {}),
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
        console.log("🟢 VALIDACIÓN COMPLETE - PREGUNTAS Y RESPUESTAS:", JSON.stringify({
            questions: submission.survey.sections.flatMap((section) => section.questions.map((question) => ({
                id: question.id,
                title: question.title,
                type: question.type,
                required: question.required,
                compositeFields: question.compositeFields.map((field) => ({
                    id: field.id,
                    label: field.label,
                    required: field.required,
                })),
            }))),
            answers: submission.answers.map((answer) => ({
                questionId: answer.questionId,
                value: answer.value,
                options: answer.options,
                matrixAnswers: answer.matrixAnswers,
                compositeAnswers: answer.compositeAnswers,
            })),
        }, null, 2));
        // =====================================================
        // VALIDAR PREGUNTAS OBLIGATORIAS
        // =====================================================
        const questions = submission.survey.sections.flatMap((section) => section.questions);
        for (const question of questions) {
            if (!question.required) {
                continue;
            }
            const answer = submission.answers.find((answer) => answer.questionId === question.id);
            // ---------------------------------------------------
            // PREGUNTA COMPOSITE
            // ---------------------------------------------------
            if (question.type === "COMPOSITE") {
                for (const field of question.compositeFields) {
                    if (!field.required) {
                        continue;
                    }
                    const compositeAnswer = answer?.compositeAnswers.find((item) => item.fieldId === field.id);
                    if (!compositeAnswer ||
                        compositeAnswer.value === null ||
                        compositeAnswer.value === undefined ||
                        compositeAnswer.value.trim() === "") {
                        throw new Error(`El campo "${field.label}" es obligatorio`);
                    }
                }
                continue;
            }
            // ---------------------------------------------------
            // PREGUNTAS NORMALES
            // ---------------------------------------------------
            const hasValue = answer &&
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
                status: client_1.SubmissionStatus.COMPLETED,
                completedAt: new Date(),
            },
        });
    }
    // =========================================================
    // OBTENER RESULTADOS
    // =========================================================
    async getResults(surveyId, organizationId) {
        return prisma.survey.findFirst({
            where: {
                id: surveyId,
                organizationId,
                deletedAt: null,
            },
            include: {
                submissions: {
                    include: {
                        interviewer: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
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
    async findSubmissionWithAnswers(submissionId, organizationId, interviewerId) {
        return prisma.submission.findFirst({
            where: {
                id: submissionId,
                ...(interviewerId ? { interviewerId } : {}),
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
    async findSubmissionOrganization(submissionId) {
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
exports.SubmissionRepository = SubmissionRepository;
