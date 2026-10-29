import { Request, Response, NextFunction } from "express";
import { AuthService } from "./service";

const service = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await service.login(email, password);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await service.me(req.user!.id);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
  async register(req: Request, res: Response, next: NextFunction) {
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
    } catch (error) {
      next(error);
    }
  }
}
