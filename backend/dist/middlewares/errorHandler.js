"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../error/AppError");
function errorHandler(error, req, res, next) {
    console.error(error);
    if (error instanceof AppError_1.AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
        });
    }
    return res.status(500).json({
        message: "Error interno del servidor",
    });
}
