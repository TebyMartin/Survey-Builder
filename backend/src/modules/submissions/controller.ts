import { Request, Response, NextFunction } from "express";
import { SubmissionService } from "./service";

const service = new SubmissionService();

export class SubmissionController {
  reorder: any;

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const submission = await service.create({
        surveyId: req.body.surveyId,
        assignmentId: req.body.assignmentId,
        interviewerId: req.user?.id,
        organizationId: req.user!.organizationId,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        ipAddress: req.ip,
        deviceInfo: req.headers["user-agent"],
      });

      res.status(201).json(submission);
    } catch (error) {
      next(error);
    }
  }

  async saveAnswers(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    console.log("🟢 BODY SAVE ANSWERS:", JSON.stringify(req.body, null, 2));
    try {
      const { id } = req.params;
      const { answers } = req.body;

      await service.saveAnswers(id, answers, req.user!.organizationId);

      res.status(200).json({
        message: "Respuestas guardadas correctamente",
      });
    } catch (error) {
      next(error);
    }
  }

  async complete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      const submission = await service.complete(id, req.user!.organizationId);

      res.json(submission);
    } catch (error) {
      next(error);
    }
  }

  async getResults(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      const results = await service.getResults(id, req.user!.organizationId);

      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}
