import { Request, Response, NextFunction } from "express";
import { ReportsService } from "./service";

const service = new ReportsService();

export function buildSubmissionCsv(submissions: any[]) {
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "";
    return parsedDate.toISOString();
  };

  type CsvColumn = {
    header: string;
    getValue: (submission: any) => string | number;
  };

  const columns: CsvColumn[] = [
    { header: "submission_id", getValue: (submission) => submission.id ?? "" },
    {
      header: "interview_number",
      getValue: (submission) => submission.formNumber ?? "",
    },
    {
      header: "interviewer_id",
      getValue: (submission) => submission.interviewerId ?? "",
    },
    {
      header: "interviewer_name",
      getValue: (submission) =>
        submission.interviewer
          ? `${submission.interviewer.firstName} ${submission.interviewer.lastName}`.trim()
          : "",
    },
    {
      header: "survey_id",
      getValue: (submission) => submission.surveyId ?? "",
    },
    {
      header: "assignment_id",
      getValue: (submission) => submission.assignmentId ?? "",
    },
    {
      header: "interview_date",
      getValue: (submission) =>
        formatDate(submission.completedAt ?? submission.startedAt),
    },
    {
      header: "status",
      getValue: (submission) => submission.status ?? "",
    },
    {
      header: "status_label",
      getValue: (submission) => {
        switch (submission.status) {
          case "COMPLETED":
            return "Completada";
          case "IN_PROGRESS":
            return "Incompleta";
          case "ABANDONED":
            return "Abandonada";
          default:
            return submission.status ?? "";
        }
      },
    },
    {
      header: "location_status",
      getValue: (submission) => {
        const { latitude, longitude } = submission;
        if (latitude == null || longitude == null) return "COORDINATES_MISSING";
        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          return "COORDINATES_INVALID";
        }
        return "COORDINATES_AVAILABLE";
      },
    },
    {
      header: "latitude",
      getValue: (submission) =>
        submission.latitude !== null && submission.latitude !== undefined
          ? String(submission.latitude)
          : "",
    },
    {
      header: "longitude",
      getValue: (submission) =>
        submission.longitude !== null && submission.longitude !== undefined
          ? String(submission.longitude)
          : "",
    },
  ];

  const escapeCsv = (value: unknown) => {
    const text = String(value ?? "");
    return /[;,"\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };

  const headerRow = columns.map((column) => escapeCsv(column.header)).join(";");
  const dataRows = submissions.map((submission) =>
    columns
      .map((column) => escapeCsv(column.getValue(submission)))
      .join(";"),
  );

  return [headerRow, ...dataRows].join("\r\n");
}

export class ReportsController {
  async submissionExport(
    req: Request<{ surveyId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const exportData = await service.submissionExport(
        req.params.surveyId,
        req.user!.organizationId,
      ) as { survey: any; submissions: any[] };

      const csv = buildSubmissionCsv(exportData.submissions);

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
