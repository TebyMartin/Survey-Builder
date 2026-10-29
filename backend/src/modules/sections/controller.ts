import { Request, Response } from "express";
import { SectionService } from "./service";

const service = new SectionService();

export class SectionController {
  async create(req: Request, res: Response) {
    try {
      const { surveyId, title, description } = req.body;

      const section = await service.create({
        surveyId,
        title,
        description,
      });

      res.status(201).json(section);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al crear la sección",
      });
    }
  }

  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const section = await service.update(req.params.id, req.body);

      res.json(section);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al actualizar la sección",
      });
    }
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      await service.delete(req.params.id);

      res.sendStatus(204);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al eliminar la sección",
      });
    }
  }
  async duplicate(req: Request<{ id: string }>, res: Response) {
    try {
      const section = await service.duplicate(req.params.id);

      res.status(201).json(section);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al duplicar la sección",
      });
    }
  }
  async reorder(req: Request<{ id: string }>, res: Response) {
    try {
      const sections = await service.reorder(req.body);

      res.json(sections);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al reordenar las secciones",
      });
    }
  }
}
