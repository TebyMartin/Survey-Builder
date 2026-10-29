import jsPDF from "jspdf";
import type {
  ChoiceQuestionSummary,
  CompositeFieldBaseSummary,
  CompositeQuestionSummary,
  MatrixQuestionSummary,
  QuestionSummary,
} from "../../../types/report";

const PAGE_HEIGHT = 297;

const MARGIN_X = 14;
const CONTENT_WIDTH = 182;

const TOP_MARGIN = 20;
const BOTTOM_MARGIN = 20;

const PURPLE = [103, 58, 183] as const;
const TEXT_COLOR = [0, 0, 0] as const;
const LIGHT_BG = [250, 250, 250] as const;
const BORDER = [220, 220, 220] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getQuestionTitle(question: QuestionSummary): string {
  return String(question.title || "Pregunta sin título");
}

function getAnswers(question: QuestionSummary): unknown[] {
  return question.answers;
}

function getAnswerLabel(answer: unknown): string {
  if (answer === null || answer === undefined) {
    return "Sin respuesta";
  }

  if (typeof answer === "string" || typeof answer === "number") {
    return String(answer);
  }

  if (!isRecord(answer)) {
    return "Sin respuesta";
  }

  const labelKeys = [
    "label",
    "value",
    "text",
    "answer",
    "option",
    "name",
    "title",
  ];
  const label = labelKeys
    .map((key) => answer[key])
    .find(
      (value): value is string | number =>
        typeof value === "string" || typeof value === "number",
    );

  return label === undefined ? "Sin respuesta" : String(label);
}

function drawNewPage(doc: jsPDF, questionTitle: string): number {
  doc.addPage();

  const y = TOP_MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...PURPLE);

  const titleLines = doc.splitTextToSize(questionTitle, CONTENT_WIDTH - 12);

  doc.text(titleLines, 20, y + 8);

  const titleHeight = Math.max(titleLines.length, 1) * 6;

  return y + 8 + titleHeight + 10;
}

/**
 * ============================================================
 * DIBUJAR UNA BARRA DE PORCENTAJE
 * ============================================================
 */
function drawPercentageRow(
  doc: jsPDF,
  y: number,
  label: string,
  count: number,
  total: number,
): number {
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);

  const labelLines = doc.splitTextToSize(label, 42);

  const rowHeight = Math.max(labelLines.length, 1) * 6 + 5;

  if (y + rowHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
    return y;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_COLOR);

  doc.text(labelLines, 22, y);

  // Barra gris
  doc.setFillColor(230, 230, 230);

  doc.roundedRect(70, y - 3, 90, 4, 2, 2, "F");

  // Barra violeta
  doc.setFillColor(...PURPLE);

  const barWidth = 90 * (percent / 100);

  if (barWidth > 0) {
    doc.roundedRect(70, y - 3, barWidth, 4, 2, 2, "F");
  }

  // Porcentaje
  doc.setTextColor(...TEXT_COLOR);

  doc.text(`${count} (${percent}%)`, 165, y);

  return y + rowHeight;
}

/**
 * ============================================================
 * MATRIX
 * ============================================================
 */
function drawMatrix(
  doc: jsPDF,
  y: number,
  question: MatrixQuestionSummary,
  title: string,
): number {
  const rows = question.answers ?? [];

  if (rows.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_COLOR);

    doc.text("Sin respuestas registradas", 22, y);

    return y + 12;
  }

  rows.forEach((matrixRow) => {
    const rowLabel = matrixRow.label || "Fila";
    const values = matrixRow.values;

    /*
     * NOMBRE DE LA FILA
     */
    if (y + 15 > PAGE_HEIGHT - BOTTOM_MARGIN) {
      y = drawNewPage(doc, title);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...TEXT_COLOR);

    const rowLabelLines = doc.splitTextToSize(
      String(rowLabel),
      CONTENT_WIDTH - 20,
    );

    doc.text(rowLabelLines, 22, y);

    y += Math.max(rowLabelLines.length, 1) * 6 + 5;

    /*
     * RESPUESTAS DE LA FILA
     */
    if (values.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);

      doc.text("Sin respuestas", 28, y);

      y += 10;
      return;
    }

    const total = matrixRow.answered;

    values.forEach((valueData) => {
      const value = valueData.value;

      const count = valueData.count;

      if (y + 12 > PAGE_HEIGHT - BOTTOM_MARGIN) {
        y = drawNewPage(doc, title);
      }

      y = drawPercentageRow(doc, y, value, count, total);
    });

    y += 6;
  });

  return y + 8;
}

/**
 * ============================================================
 * COMPOSITE - NÚMERO
 * ============================================================
 */
function drawCompositeNumber(
  doc: jsPDF,
  y: number,
  field: CompositeFieldBaseSummary,
): number {
  const average = field.average;
  const min = field.min;
  const max = field.max;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_COLOR);

  doc.text(
    `Promedio: ${
      average !== undefined && average !== null
        ? Number(average).toFixed(1)
        : "-"
    }`,
    25,
    y,
  );

  doc.text(`Mínimo: ${min ?? "-"}`, 90, y);

  doc.text(`Máximo: ${max ?? "-"}`, 140, y);

  y += 8;

  const values = field.values.filter(
    (value): value is number => typeof value === "number",
  );

  if (values.length > 0) {
    const counts: Record<string, number> = {};

    values.forEach((value) => {
      const key = String(value);

      counts[key] = (counts[key] ?? 0) + 1;
    });

    const total = values.length;

    Object.entries(counts).forEach(([value, count]) => {
      if (y + 10 > PAGE_HEIGHT - BOTTOM_MARGIN) {
        doc.addPage();
        y = TOP_MARGIN;
      }

      y = drawPercentageRow(doc, y, value, Number(count), total);
    });
  }

  return y + 6;
}

/**
 * ============================================================
 * COMPOSITE - OPCIONES
 * ============================================================
 */
function isCompositeChoiceValue(
  value: unknown,
): value is { value: string; count: number } {
  return (
    isRecord(value) &&
    typeof value.value === "string" &&
    typeof value.count === "number"
  );
}

function isChoiceQuestion(
  question: QuestionSummary,
): question is ChoiceQuestionSummary {
  return [
    "RADIO",
    "CHECKBOX",
    "SELECT",
    "MULTISELECT",
    "SCALE",
  ].includes(question.type);
}

function drawCompositeOptions(
  doc: jsPDF,
  y: number,
  field: CompositeFieldBaseSummary,
): number {
  const values = field.values.filter(isCompositeChoiceValue);

  if (values.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);

    doc.text("Sin respuestas", 25, y);

    return y + 10;
  }

  const total = values.reduce((acc, item) => acc + item.count, 0);

  values.forEach((item) => {
    if (y + 12 > PAGE_HEIGHT - BOTTOM_MARGIN) {
      doc.addPage();
      y = TOP_MARGIN;
    }

    y = drawPercentageRow(
      doc,
      y,
      item.value,
      item.count,
      total,
    );
  });

  return y + 6;
}

/**
 * ============================================================
 * COMPOSITE - TEXTO / EMAIL / FECHA
 * ============================================================
 */
function drawCompositeText(
  doc: jsPDF,
  y: number,
  field: CompositeFieldBaseSummary,
): number {
  const values = field.values.filter(
    (value): value is string => typeof value === "string",
  );

  if (values.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);

    doc.text("Sin respuestas", 25, y);

    return y + 10;
  }

  values.forEach((value) => {
    const text = value;

    const lines = doc.splitTextToSize(`• ${text}`, CONTENT_WIDTH - 25);

    const height = Math.max(lines.length, 1) * 6;

    if (y + height > PAGE_HEIGHT - BOTTOM_MARGIN) {
      doc.addPage();
      y = TOP_MARGIN;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_COLOR);

    doc.text(lines, 25, y);

    y += height + 2;
  });

  return y + 6;
}

/**
 * ============================================================
 * COMPOSITE
 * ============================================================
 */
function drawComposite(
  doc: jsPDF,
  y: number,
  question: CompositeQuestionSummary,
  title: string,
): number {
  const fields = question.answers ?? [];

  if (fields.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_COLOR);

    doc.text("Sin respuestas registradas", 22, y);

    return y + 12;
  }

  fields.forEach((field) => {
    const fieldLabel = field.label || "Campo";

    /*
     * Comprobar espacio para el nombre
     * del campo
     */
    if (y + 15 > PAGE_HEIGHT - BOTTOM_MARGIN) {
      y = drawNewPage(doc, title);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...PURPLE);

    const fieldLabelLines = doc.splitTextToSize(
      String(fieldLabel),
      CONTENT_WIDTH - 20,
    );

    doc.text(fieldLabelLines, 22, y);

    y += Math.max(fieldLabelLines.length, 1) * 6 + 5;

    const fieldType = String(field.type ?? "").toUpperCase();

    /*
     * NUMBER
     */
    if (fieldType === "NUMBER") {
      y = drawCompositeNumber(doc, y, field);
    } else if (

    /*
     * SELECT / RADIO / SCALE /
     * CHECKBOX / MULTISELECT
     */
      fieldType === "SELECT" ||
      fieldType === "RADIO" ||
      fieldType === "SCALE" ||
      fieldType === "CHECKBOX" ||
      fieldType === "MULTISELECT"
    ) {
      y = drawCompositeOptions(doc, y, field);
    } else {

    /*
     * TEXT / EMAIL / DATE / OTROS
     */
      y = drawCompositeText(doc, y, field);
    }

    /*
     * Separador entre campos
     */
    doc.setDrawColor(...BORDER);

    doc.line(MARGIN_X + 8, y, MARGIN_X + CONTENT_WIDTH - 8, y);

    y += 8;
  });

  return y + 5;
}

/**
 * ============================================================
 * PREGUNTAS
 * ============================================================
 */
export function drawQuestions(
  doc: jsPDF,
  initialY: number,
  questions: QuestionSummary[],
): number {
  let y = initialY;

  questions.forEach((question) => {
    const title = getQuestionTitle(question);
    const answers = getAnswers(question);

    /*
     * ==========================================
     * TÍTULO DE LA PREGUNTA
     * ==========================================
     */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    const titleLines = doc.splitTextToSize(title, CONTENT_WIDTH - 12);

    const titleHeight = Math.max(titleLines.length, 1) * 6;

    /*
     * ==========================================
     * COMPROBAR ESPACIO
     * ==========================================
     */

    const minimumHeight = 10 + titleHeight + 20;

    if (y + minimumHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
      y = drawNewPage(doc, title);
    } else {
      /*
       * ========================================
       * TARJETA
       * ========================================
       */

      doc.setFillColor(...LIGHT_BG);
      doc.setDrawColor(...BORDER);

      doc.roundedRect(MARGIN_X, y, CONTENT_WIDTH, titleHeight + 15, 3, 3, "FD");

      /*
       * TÍTULO
       */

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...PURPLE);

      doc.text(titleLines, 20, y + 9);

      y += titleHeight + 21;
    }

    /*
     * ==========================================
     * MATRIX
     * ==========================================
     */

    if (question.type === "MATRIX") {
      y = drawMatrix(doc, y, question, title);

      return;
    }

    /*
     * ==========================================
     * COMPOSITE
     * ==========================================
     */

    if (question.type === "COMPOSITE") {
      y = drawComposite(doc, y, question, title);

      return;
    }

    /*
     * ==========================================
     * SIN RESPUESTAS
     * ==========================================
     */

    if (answers.length === 0) {
      if (y + 10 > PAGE_HEIGHT - BOTTOM_MARGIN) {
        y = drawNewPage(doc, title);
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...TEXT_COLOR);

      doc.text("Sin respuestas registradas", 22, y);

      y += 12;

      return;
    }

    /*
     * ==========================================
     * SELECT / RADIO / CHECKBOX / SCALE
     * ==========================================
     */

    if (isChoiceQuestion(question)) {
      const total = question.answers.reduce(
        (acc, answer) => acc + answer.count,
        0,
      );

      question.answers.forEach((answer) => {
        const label = getAnswerLabel(answer);
        const count = answer.count;

        const percent = total === 0 ? 0 : Math.round((count / total) * 100);

        const labelLines = doc.splitTextToSize(label, 42);

        const rowHeight = Math.max(labelLines.length, 1) * 6 + 5;

        /*
         * Si no entra la respuesta,
         * pasa a otra página.
         */

        if (y + rowHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
          y = drawNewPage(doc, title);
        }

        doc.setFont("helvetica", "normal");

        doc.setFontSize(10);
        doc.setTextColor(...TEXT_COLOR);

        /*
         * TEXTO
         */

        doc.text(labelLines, 22, y);

        /*
         * BARRA GRIS
         */

        doc.setFillColor(230, 230, 230);

        doc.roundedRect(70, y - 3, 90, 4, 2, 2, "F");

        /*
         * BARRA VIOLETA
         */

        doc.setFillColor(...PURPLE);

        const barWidth = 90 * (percent / 100);

        if (barWidth > 0) {
          doc.roundedRect(70, y - 3, barWidth, 4, 2, 2, "F");
        }

        /*
         * PORCENTAJE
         */

        doc.setTextColor(...TEXT_COLOR);

        doc.text(`${count} (${percent}%)`, 165, y);

        y += rowHeight;
      });

      y += 10;

      return;
    }

    /*
     * ==========================================
     * PREGUNTAS DE TEXTO
     * ==========================================
     */

    answers.forEach((answer) => {
      const value = getAnswerLabel(answer);

      const lines = doc.splitTextToSize(`• ${value}`, CONTENT_WIDTH - 16);

      const lineHeight = 6;

      const answerHeight = Math.max(lines.length, 1) * lineHeight;

      /*
       * Si no entra la respuesta,
       * pasa a otra página.
       */

      if (y + answerHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
        y = drawNewPage(doc, title);
      }

      doc.setFont("helvetica", "normal");

      doc.setFontSize(10);

      doc.setTextColor(...TEXT_COLOR);

      doc.text(lines, 22, y);

      y += answerHeight + 2;
    });

    y += 10;
  });

  return y;
}
