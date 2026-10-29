import { QuestionType } from "@prisma/client";
import { z } from "zod";

const questionTypesWithOptions = [
  QuestionType.RADIO,
  QuestionType.CHECKBOX,
  QuestionType.SELECT,
  QuestionType.MULTISELECT,
] as const;

const compositeFieldTypes = [
  QuestionType.SHORT_TEXT,
  QuestionType.LONG_TEXT,
  QuestionType.NUMBER,
  QuestionType.EMAIL,
  QuestionType.PHONE,
  QuestionType.DATE,
  QuestionType.TIME,
  QuestionType.DATETIME,
  QuestionType.RADIO,
  QuestionType.CHECKBOX,
  QuestionType.SELECT,
  QuestionType.MULTISELECT,
  QuestionType.SCALE,
  QuestionType.NPS,
] as const;

const optionSchema = z.object({
  label: z.string().min(1),
  value: z.string(),
  isOther: z.boolean().optional(),
});

const compositeFieldSchema = z
  .object({
    label: z.string().min(1, "El campo debe tener un título"),

    type: z.enum(compositeFieldTypes, {
      error: "Tipo de campo compuesto inválido",
    }),

    placeholder: z.string().optional(),

    helpText: z.string().optional(),

    required: z.boolean().default(false),

    minLength: z.number().nullable().optional(),

    maxLength: z.number().nullable().optional(),

    minValue: z.number().nullable().optional(),

    maxValue: z.number().nullable().optional(),

    defaultValue: z.string().nullable().optional(),

    options: z.array(optionSchema).optional(),
  })
  .superRefine((field, ctx) => {
    const needsOptions = questionTypesWithOptions.includes(
      field.type as (typeof questionTypesWithOptions)[number],
    );

    if (needsOptions && (!field.options || field.options.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Este tipo de campo requiere al menos una opción.",
      });
    }

    if (!needsOptions && field.options?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Este tipo de campo no debe tener opciones.",
      });
    }
  });

export const builderSchema = z
  .object({
    title: z.string().min(1, "La pregunta debe tener un título"),

    type: z.nativeEnum(QuestionType, {
      error: "Tipo de pregunta inválido",
    }),

    placeholder: z.string().optional(),

    helpText: z.string().optional(),

    required: z.boolean(),

    isRepeatable: z.boolean().optional().default(false),

    minLength: z.number().nullable().optional(),

    maxLength: z.number().nullable().optional(),

    minValue: z.number().nullable().optional(),

    maxValue: z.number().nullable().optional(),

    defaultValue: z.string().nullable().optional(),

    options: z.array(optionSchema).optional(),

    compositeFields: z.array(compositeFieldSchema).optional(),
  })
  .superRefine((question, ctx) => {
    const needsOptions = questionTypesWithOptions.includes(
      question.type as (typeof questionTypesWithOptions)[number],
    );

    // -----------------------------------------
    // PREGUNTAS NORMALES CON OPCIONES
    // -----------------------------------------

    if (needsOptions && (!question.options || question.options.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Este tipo de pregunta requiere al menos una opción.",
      });
    }

    if (!needsOptions && question.options?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Este tipo de pregunta no debe tener opciones.",
      });
    }

    // -----------------------------------------
    // PREGUNTA COMPOSITE
    // -----------------------------------------

    if (question.type === QuestionType.COMPOSITE) {
      if (!question.compositeFields || question.compositeFields.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["compositeFields"],
          message: "Una pregunta compleja debe tener al menos 2 campos.",
        });
      }

      if (question.options?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Una pregunta compleja no debe tener opciones directamente.",
        });
      }
    } else if (question.isRepeatable) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["isRepeatable"],
        message: "Solo las preguntas compuestas pueden tener filas repetibles.",
      });
    }

    // -----------------------------------------
    // LAS PREGUNTAS NORMALES NO DEBEN TENER
    // CAMPOS COMPOSITE
    // -----------------------------------------

    if (
      question.type !== QuestionType.COMPOSITE &&
      question.compositeFields?.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["compositeFields"],
        message: "Este tipo de pregunta no debe tener campos complejos.",
      });
    }
  });
