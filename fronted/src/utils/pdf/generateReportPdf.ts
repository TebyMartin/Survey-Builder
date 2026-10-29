import jsPDF from "jspdf";
import { getChartImage } from "./chartImage";
import { drawHeader } from "./section/header";
import { drawStats } from "./section/stats";
import { drawChart } from "./section/chart";
import { drawQuestions } from "./section/questions";
import { drawFooter } from "./section/footer";
import { drawCover } from "./section/cover";

export async function generateReportPdf(data: any) {
  const doc = new jsPDF();

  drawCover(doc, data);

  let y = drawHeader(doc, data.survey);

  y = drawStats(doc, y, data.stats);

  const chart = await getChartImage();

  y = drawChart(doc, y, chart);

  console.log(
    "QUESTION SUMMARIES:",
    JSON.stringify(data.questionSummaries, null, 2),
  );

  y = drawQuestions(doc, y, data.questionSummaries);

  drawFooter(doc);

  doc.save(`${data.survey.title}.pdf`);
}
