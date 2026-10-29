import jsPDF from "jspdf";
import type { ReportStats } from "../../../types/report";

export function drawStats(doc: jsPDF, y: number, stats: ReportStats) {
  const cards = [
    ["Respuestas", stats.totalResponses],
    ["Completadas", stats.completed],
    ["En progreso", stats.inProgress],
    ["Tiempo", `${stats.averageTime}s`],
  ];

  let x = 14;

  cards.forEach(([title, value]) => {
    doc.setDrawColor(220);
    doc.roundedRect(x, y, 42, 22, 3, 3);

    doc.setFontSize(10);
    doc.text(String(title), x + 4, y + 7);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(String(value), x + 4, y + 17);

    x += 46;
  });

  return y + 30;
}
