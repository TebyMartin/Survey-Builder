"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSurveySchema = void 0;
const zod_1 = require("zod");
exports.createSurveySchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(3, "El título debe tener al menos 3 caracteres")
        .max(200, "El título no puede superar los 200 caracteres"),
    description: zod_1.z
        .string()
        .trim()
        .max(2000, "La descripción no puede superar los 500 caracteres")
        .optional(),
});
