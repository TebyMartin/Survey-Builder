"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUsersSchema = void 0;
const zod_1 = require("zod");
exports.assignUsersSchema = zod_1.z.object({
    surveyId: zod_1.z.string().uuid(),
    userIds: zod_1.z.array(zod_1.z.string().uuid()).min(1),
});
