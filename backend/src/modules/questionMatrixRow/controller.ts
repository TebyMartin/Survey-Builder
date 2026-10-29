import { NextFunction, Request, Response } from "express";
import { QuestionMatrixRowService } from "./service";

const service = new QuestionMatrixRowService();

export class QuestionMatrixRowController {
  async create(req: Request, res: Response) {
    const row = await service.create(req.body);

    res.status(201).json(row);
  }

  async update(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    const row = await service.update(req.params.id, req.body);

    res.json(row);
  }

  async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    await service.delete(req.params.id);

    res.sendStatus(204);
  }

  async reorder(req: Request, res: Response) {
    const { questionId, from, to } = req.body;

    const result = await service.reorder(questionId, from, to);

    res.json(result);
  }
}
