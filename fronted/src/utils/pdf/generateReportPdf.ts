import jsPDF from "jspdf";
import { getChartImage } from "./chartImage";
import { drawHeader } from "./section/header";
import { drawStats } from "./section/stats";
import { drawChart } from "./section/chart";
import { drawQuestions } from "./section/questions";
import { drawFooter } from "./section/footer";
import { drawCover } from "./section/cover";
import type { ReportDashboard } from "../../types/report";

export async function generateReportPdf(data: ReportDashboard) {
  if (!data.survey) {
    throw new Error("No se encontró la encuesta para generar el reporte.");
  }

  const doc = new jsPDF();

  drawCover(doc, data.survey);

  let y = drawHeader(doc, data.survey);

  y = drawStats(doc, y, data.stats);

  const chart = await getChartImage();

  y = drawChart(doc, y, chart);

  drawQuestions(doc, y, data.questionSummaries);

  drawFooter(doc);

  doc.save(`${data.survey.title}.pdf`);
}
