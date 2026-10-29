import { Request, Response } from "express";
import { QuestionService } from "./service";
import { log } from "node:console";

const service = new QuestionService();

export class QuestionController {
  async create(req: Request, res: Response) {
    try {
      const question = await service.create(req.body);

      res.status(201).json(question);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al crear la pregunta",
      });
    }
  }
  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const question = await service.update(req.params.id, req.body);

      res.json(question);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al actualizar la pregunta",
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
        message: "Error al eliminar la pregunta",
      });
    }
  }
  async reorder(req: Request, res: Response) {
    try {
      await service.reorder(req.body.questions);

      res.json({
        message: "Orden actualizado",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al actualizar el orden",
      });
    }
  }
  async duplicate(req: Request<{ id: string }>, res: Response) {
    try {
      const question = await service.duplicate(req.params.id);

      res.status(201).json(question);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al duplicar la pregunta",
      });
    }
  }
}
