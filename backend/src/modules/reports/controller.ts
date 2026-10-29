import { Request, Response, NextFunction } from "express";
import { ReportsService } from "./service";

const service = new ReportsService();

export class ReportsController {
  async submissionExport(
    req: Request<{ surveyId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const submissions = await service.submissionExport(
        req.params.surveyId,
        req.user!.organizationId,
      );
      const headers = [
        "Formulario N.º",
        "Fecha",
        "Encuestador/a",
        "Encuestador/a ID",
        "Encuesta ID",
        "Asignación ID",
        "Latitud",
        "Longitud",
        "Estado",
      ];
      const escapeCsv = (value: string | number | null) =>
        `"${String(value ?? "").replaceAll('"', '""')}"`;
      const rows = submissions.map((submission) => [
        submission.formNumber,
        (submission.completedAt ?? submission.startedAt).toLocaleString(
          "es-AR",
          { timeZone: "America/Argentina/Buenos_Aires" },
        ),
        submission.interviewer
          ? `${submission.interviewer.firstName} ${submission.interviewer.lastName}`
          : "",
        submission.interviewerId,
        submission.surveyId,
        submission.assignmentId,
        submission.latitude,
        submission.longitude,
        submission.status,
      ]);
      const csv = [
        headers.map(escapeCsv).join(","),
        ...rows.map((row) => row.map(escapeCsv).join(",")),
      ].join("\r\n");

      res
        .type("text/csv")
        .setHeader(
          "Content-Disposition",
          `attachment; filename="survey-${req.params.surveyId}-submissions.csv"`,
        )
        .send(`\uFEFF${csv}`);
    } catch (error) {
      next(error);
    }
  }

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
