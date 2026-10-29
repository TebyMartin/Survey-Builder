import { Request, Response, NextFunction } from "express";
import { ReportsService } from "./service";

const service = new ReportsService();

export class ReportsController {
  async dashboard(
    req: Request<{ surveyId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const surveyId = req.params.surveyId;

      const organizationId = req.user!.organizationId;

      const data = await service.dashboard(surveyId, organizationId);

      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
