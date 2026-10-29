"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE, PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
exports.default = corsOptions;
