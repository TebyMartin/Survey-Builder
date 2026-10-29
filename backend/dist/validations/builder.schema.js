"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builderSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const questionTypesWithOptions = [
    client_1.QuestionType.RADIO,
    client_1.QuestionType.CHECKBOX,
    client_1.QuestionType.SELECT,
    client_1.QuestionType.MULTISELECT,
];
const compositeFieldTypes = [
    client_1.QuestionType.SHORT_TEXT,
    client_1.QuestionType.LONG_TEXT,
    client_1.QuestionType.NUMBER,
    client_1.QuestionType.EMAIL,
    client_1.QuestionType.PHONE,
    client_1.QuestionType.DATE,
    client_1.QuestionType.TIME,
    client_1.QuestionType.DATETIME,
    client_1.QuestionType.RADIO,
    client_1.QuestionType.CHECKBOX,
    client_1.QuestionType.SELECT,
    client_1.QuestionType.MULTISELECT,
    client_1.QuestionType.SCALE,
    client_1.QuestionType.NPS,
];
const optionSchema = zod_1.z.object({
    label: zod_1.z.string().min(1),
    value: zod_1.z.string(),
    isOther: zod_1.z.boolean().optional(),
});
const compositeFieldSchema = zod_1.z
    .object({
    label: zod_1.z.string().min(1, "El campo debe tener un título"),
    type: zod_1.z.enum(compositeFieldTypes, {
        error: "Tipo de campo compuesto inválido",
    }),
    placeholder: zod_1.z.string().optional(),
    helpText: zod_1.z.string().optional(),
    required: zod_1.z.boolean().default(false),
    minLength: zod_1.z.number().nullable().optional(),
    maxLength: zod_1.z.number().nullable().optional(),
    minValue: zod_1.z.number().nullable().optional(),
    maxValue: zod_1.z.number().nullable().optional(),
    defaultValue: zod_1.z.string().nullable().optional(),
    options: zod_1.z.array(optionSchema).optional(),
})
    .superRefine((field, ctx) => {
    const needsOptions = questionTypesWithOptions.includes(field.type);
    if (needsOptions && (!field.options || field.options.length === 0)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["options"],
            message: "Este tipo de campo requiere al menos una opción.",
        });
    }
    if (!needsOptions && field.options?.length) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["options"],
            message: "Este tipo de campo no debe tener opciones.",
        });
    }
});
exports.builderSchema = zod_1.z
    .object({
    title: zod_1.z.string().min(1, "La pregunta debe tener un título"),
    type: zod_1.z.nativeEnum(client_1.QuestionType, {
        error: "Tipo de pregunta inválido",
    }),
    placeholder: zod_1.z.string().optional(),
    helpText: zod_1.z.string().optional(),
    required: zod_1.z.boolean(),
    minLength: zod_1.z.number().nullable().optional(),
    maxLength: zod_1.z.number().nullable().optional(),
    minValue: zod_1.z.number().nullable().optional(),
    maxValue: zod_1.z.number().nullable().optional(),
    defaultValue: zod_1.z.string().nullable().optional(),
    options: zod_1.z.array(optionSchema).optional(),
    compositeFields: zod_1.z.array(compositeFieldSchema).optional(),
})
    .superRefine((question, ctx) => {
    const needsOptions = questionTypesWithOptions.includes(question.type);
    // -----------------------------------------
    // PREGUNTAS NORMALES CON OPCIONES
    // -----------------------------------------
    if (needsOptions && (!question.options || question.options.length === 0)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["options"],
            message: "Este tipo de pregunta requiere al menos una opción.",
        });
    }
    if (!needsOptions && question.options?.length) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["options"],
            message: "Este tipo de pregunta no debe tener opciones.",
        });
    }
    // -----------------------------------------
    // PREGUNTA COMPOSITE
    // -----------------------------------------
    if (question.type === client_1.QuestionType.COMPOSITE) {
        if (!question.compositeFields || question.compositeFields.length < 2) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ["compositeFields"],
                message: "Una pregunta compleja debe tener al menos 2 campos.",
            });
        }
        if (question.options?.length) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ["options"],
                message: "Una pregunta compleja no debe tener opciones directamente.",
            });
        }
    }
    // -----------------------------------------
    // LAS PREGUNTAS NORMALES NO DEBEN TENER
    // CAMPOS COMPOSITE
    // -----------------------------------------
    if (question.type !== client_1.QuestionType.COMPOSITE &&
        question.compositeFields?.length) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["compositeFields"],
            message: "Este tipo de pregunta no debe tener campos complejos.",
        });
    }
});
