"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class QuestionRepository {
    async create(data) {
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
    async update(id, data) {
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
                                .map((field) => field.id),
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
                    }
                    else {
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
    async delete(id) {
        return prisma.question.delete({
            where: {
                id,
            },
        });
    }
    async reorder(questions) {
        return prisma.$transaction(questions.map((question) => prisma.question.update({
            where: {
                id: question.id,
            },
            data: {
                order: question.order,
            },
        })));
    }
    async findById(id) {
        return prisma.question.findUnique({
            where: {
                id,
            },
            include: {
                options: true,
            },
        });
    }
    async duplicate(question) {
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
                    order: question.order + 1,
                    options: {
                        create: question.options.map((option) => ({
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
    async increaseOrderAfter(sectionId, order) {
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
exports.QuestionRepository = QuestionRepository;
