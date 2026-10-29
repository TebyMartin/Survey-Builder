import { Request, Response } from "express";
import { QuestionOptionService } from "./service";

const service = new QuestionOptionService();

export class QuestionOptionController {
  async create(req: Request, res: Response) {
    const option = await service.create(req.body);

    res.status(201).json(option);
  }

  async update(req: Request<{ id: string }>, res: Response) {
    const option = await service.update(req.params.id, req.body);

    res.json(option);
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    await service.delete(req.params.id);

    res.sendStatus(204);
  }

  async reorder(req: Request, res: Response) {
    const { questionId, from, to } = req.body;
    console.log(req.body);
    const result = await service.reorder(questionId, from, to);

    res.json(result);
  }
}
