import jsPDF from "jspdf";
import type { ReportDashboard } from "../../../types/report";

export function drawCover(
  doc: jsPDF,
  survey: NonNullable<ReportDashboard["survey"]>,
) {
  doc.setFillColor(103, 58, 183);
  doc.rect(0, 0, 210, 297, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFontSize(34);
  doc.setFont("helvetica", "bold");
  doc.text("Survey Builder", 105, 70, {
    align: "center",
  });

  doc.setFontSize(22);
  doc.setFont("helvetica", "normal");

  doc.text("Reporte de resultados", 105, 95, {
    align: "center",
  });

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");

  doc.text(survey.title, 105, 145, {
    align: "center",
  });

  doc.setFontSize(14);

  doc.text(new Date().toLocaleDateString("es-AR"), 105, 170, {
    align: "center",
  });

  doc.setFontSize(12);

  doc.text("Generado automáticamente por Survey Builder", 105, 260, {
    align: "center",
  });

  doc.addPage();
}
