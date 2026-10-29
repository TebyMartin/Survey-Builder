import { Request, Response, NextFunction } from "express";
import { SettingsService } from "./service";

export class SettingsController {
  private service = new SettingsService();

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.getSettings(
        req.user!.id,
        req.user!.organizationId,
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateOrganization(req: Request, res: Response, next: NextFunction) {
    try {
      const organization = await this.service.updateOrganization(
        req.user!.organizationId,
        req.body,
      );

      res.json(organization);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.service.updateUser(
        req.user!.id,
        req.user!.organizationId,
        req.body,
      );

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.changePassword(
        req.user!.id,
        req.body.currentPassword,
        req.body.newPassword,
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
