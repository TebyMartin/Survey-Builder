import { z } from "zod";

export const createSurveySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(200, "El título no puede superar los 200 caracteres"),

  description: z
    .string()
    .trim()
    .max(2000, "La descripción no puede superar los 500 caracteres")
    .optional(),
});
