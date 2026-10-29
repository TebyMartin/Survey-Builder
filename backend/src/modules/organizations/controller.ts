import { Request, Response, NextFunction } from "express";
import { OrganizationService } from "./service";

const service = new OrganizationService();

export class OrganizationController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const organizations = await service.findAll();

      res.json(organizations);
    } catch (error) {
      next(error);
    }
  }

  async findById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      const organization = await service.findById(id);

      res.json(organization);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, slug } = req.body;

      const organization = await service.create({
        name,
        slug,
      });

      res.status(201).json(organization);
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      const { name, slug, isActive } = req.body;

      const organization = await service.update(id, {
        name,
        slug,
        isActive,
      });

      res.json(organization);
    } catch (error) {
      next(error);
    }
  }

  async deactivate(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      const organization = await service.deactivate(id);

      res.json({
        message: "Organización desactivada correctamente",
        organization,
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await service.delete(id);

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}
