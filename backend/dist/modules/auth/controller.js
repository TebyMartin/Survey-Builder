"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const service_1 = require("./service");
const service = new service_1.AuthService();
class AuthController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await service.login(email, password);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async me(req, res, next) {
        try {
            const user = await service.me(req.user.id);
            res.json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            const result = await service.register(req.body);
            res.status(201).json({
                message: "Registro realizado correctamente",
                token: result.token,
                user: {
                    id: result.user.id,
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                    email: result.user.email,
                    role: result.user.role,
                    organizationId: result.user.organization.id,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
