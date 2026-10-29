"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAnswersSchema = exports.createSubmissionSchema = void 0;
const zod_1 = require("zod");
exports.createSubmissionSchema = zod_1.z.object({
    surveyId: zod_1.z.string().uuid("Survey inválida"),
    assignmentId: zod_1.z.string().uuid("Assignment inválido"),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
});
exports.saveAnswersSchema = zod_1.z.object({
    answers: zod_1.z.array(zod_1.z.object({
        questionId: zod_1.z.string().uuid(),
        value: zod_1.z.string().optional(),
        options: zod_1.z.array(zod_1.z.string().uuid()).optional(),
        matrix: zod_1.z
            .array(zod_1.z.object({
            rowId: zod_1.z.string().uuid(),
            value: zod_1.z.string().optional(),
        }))
            .optional(),
        composite: zod_1.z
            .array(zod_1.z.object({
            fieldId: zod_1.z.string().uuid(),
            value: zod_1.z.string().optional(),
        }))
            .optional(),
    })),
});
