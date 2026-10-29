// modules/users/controller.ts

import { Request, Response } from "express";
import { UsersService } from "./service";
import { toUserResponse, toUsersResponse } from "./mapper";

export class UsersController {
  service = new UsersService();

  async findAll(req: Request, res: Response) {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({
        message: "Organización no encontrada",
      });
    }

    const users = await this.service.findAll(organizationId);

    res.json(toUsersResponse(users));
  }

  async findById(req: Request, res: Response) {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({
        message: "Organización no encontrada",
      });
    }

    const user = await this.service.findById(
      req.params.id as string,
      organizationId,
    );

    res.json(toUserResponse(user));
  }

  async create(req: Request, res: Response) {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({
        message: "Organización no encontrada",
      });
    }

    const user = await this.service.create(req.body, organizationId);

    res.json(toUserResponse(user));
  }

  async update(req: Request, res: Response) {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({
        message: "Organización no encontrada",
      });
    }

    const user = await this.service.update(
      req.params.id as string,
      req.body,
      organizationId,
    );

    res.json(toUserResponse(user));
  }

  async activate(req: Request, res: Response) {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({
        message: "Organización no encontrada",
      });
    }

    const user = await this.service.activate(
      req.params.id as string,
      organizationId,
    );

    res.json(toUserResponse(user));
  }

  async desactivate(req: Request, res: Response) {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({
        message: "Organización no encontrada",
      });
    }

    const user = await this.service.desactivate(
      req.params.id as string,
      organizationId,
    );

    res.json(toUserResponse(user));
  }

  async delete(req: Request, res: Response) {
    try {
      const organizationId = req.user?.organizationId;

      if (!organizationId) {
        return res.status(401).json({
          message: "Organización no encontrada",
        });
      }

      await this.service.delete(req.params.id as string, organizationId);

      res.sendStatus(204);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al eliminar el usuario",
      });
    }
  }
}
