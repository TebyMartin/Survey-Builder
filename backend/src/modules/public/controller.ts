import { Request, Response, NextFunction } from "express";
import { PublicService } from "./service";
import { SubmissionService } from "../submissions/service";

const service = new PublicService();
const submissionService = new SubmissionService();

export class PublicController {
  // =========================================================
  // OBTENER ENCUESTA
  // =========================================================

  async getSurvey(
    req: Request<{ token: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const survey = await service.getSurvey(req.params.token);

      res.json(survey);
    } catch (error) {
      next(error);
    }
  }

  // =========================================================
  // INICIAR SUBMISSION
  // =========================================================

  async startSubmission(
    req: Request<{ token: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const survey = await service.findByPublicToken(req.params.token);

      const submission = await submissionService.create({
        surveyId: survey.id,
        organizationId: survey.organizationId,
        ipAddress: req.ip,
        deviceInfo: req.headers["user-agent"],
      });

      res.status(201).json(submission);
    } catch (error) {
      next(error);
    }
  }

  // =========================================================
  // GUARDAR RESPUESTAS
  // =========================================================

  async saveAnswers(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id as string;
      console.log(
        "🔥 ANSWERS RECIBIDAS:",
        JSON.stringify(req.body.answers, null, 2),
      );
      const submission = await submissionService.getSubmissionOrganization(id);

      if (!submission) {
        throw new Error("La submission no existe");
      }

      await submissionService.saveAnswers(
        id,
        req.body.answers,
        submission.survey.organizationId,
      );

      res.json({
        message: "Respuestas guardadas",
      });
    } catch (error) {
      next(error);
    }
  }

  // =========================================================
  // COMPLETAR SUBMISSION
  // =========================================================

  async completeSubmission(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const submission = await submissionService.getSubmissionOrganization(
        req.params.id,
      );

      if (!submission) {
        throw new Error("La submission no existe");
      }

      const completedSubmission = await submissionService.complete(
        req.params.id,
        submission.survey.organizationId,
      );

      res.json(completedSubmission);
    } catch (error) {
      next(error);
    }
  }
}
