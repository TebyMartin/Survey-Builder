import { z } from "zod";

export const createSubmissionSchema = z.object({
  surveyId: z.string().uuid("Survey inválida"),
  assignmentId: z.string().uuid("Assignment inválido"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const saveAnswersSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),

      value: z.string().optional(),

      options: z.array(z.string().uuid()).optional(),

      matrix: z
        .array(
          z.object({
            rowId: z.string().uuid(),
            value: z.string().optional(),
          }),
        )
        .optional(),

      composite: z
        .array(
          z.object({
            fieldId: z.string().uuid(),
            value: z.string().optional(),
          }),
        )
        .optional(),
    }),
  ),
});
