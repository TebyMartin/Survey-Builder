import jsPDF from "jspdf";

export function drawFooter(doc: jsPDF) {
  const pages = doc.getNumberOfPages();

  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);

    doc.setDrawColor(220);

    doc.line(14, 287, 196, 287);

    doc.setFontSize(9);

    doc.setTextColor(120);

    doc.text(`Página ${i} de ${pages}`, 196, 293, {
      align: "right",
    });

    doc.text("Survey Builder", 14, 293);
  }
}
