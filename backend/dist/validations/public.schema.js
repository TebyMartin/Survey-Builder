"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicTokenSchema = void 0;
const zod_1 = require("zod");
exports.publicTokenSchema = zod_1.z.object({
    token: zod_1.z.string().min(10),
});
