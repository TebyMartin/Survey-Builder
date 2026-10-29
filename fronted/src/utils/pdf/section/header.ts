import jsPDF from "jspdf";
import type { ReportDashboard } from "../../../types/report";

export function drawHeader(
  doc: jsPDF,
  survey: NonNullable<ReportDashboard["survey"]>,
) {
  doc.setFillColor(103, 58, 183);

  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(20);

  doc.text(survey.title, 14, 16);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(10);

  doc.text(`Generado: ${new Date().toLocaleString("es-AR")}`, 14, 26);

  doc.text("Survey Builder", 196, 26, {
    align: "right",
  });

  doc.setTextColor(0);

  return 45;
}
