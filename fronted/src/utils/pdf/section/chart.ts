import jsPDF from "jspdf";

export function drawChart(doc: jsPDF, y: number, chart: string | null) {
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  doc.text("Respuestas por día", 14, y);

  if (chart) {
    doc.addImage(chart, "PNG", 14, y + 6, 180, 85, undefined, "FAST");

    return y + 100;
  }

  // Si por alguna razón no pudo capturarse el gráfico
  doc.setDrawColor(180);

  doc.roundedRect(14, y + 5, 180, 70, 3, 3);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text("No fue posible exportar el gráfico.", 55, y + 40);

  return y + 85;
}
