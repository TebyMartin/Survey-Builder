import html2canvas from "html2canvas";

export async function getChartImage() {
  const element = document.getElementById("responses-chart");

  if (!element) return null;

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
  });

  return canvas.toDataURL("image/png");
}
