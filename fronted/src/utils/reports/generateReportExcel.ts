import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type {
  CompositeFieldBaseSummary,
  CompositeQuestionSummary,
  ReportDashboard,
  ReportSubmissionQuestion,
} from "../../types/report";

interface CompositeChoiceValue {
  value: string;
  count: number;
}

function isCompositeChoiceValue(value: unknown): value is CompositeChoiceValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    typeof value.value === "string" &&
    "count" in value &&
    typeof value.count === "number"
  );
}

function getCompositeChoiceValues(field: CompositeFieldBaseSummary) {
  return field.values.filter(isCompositeChoiceValue);
}

export async function generateReportExcel(data: ReportDashboard) {
  if (!data.survey) {
    throw new Error("No se encontró la encuesta para generar el reporte.");
  }

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Survey Builder";
  workbook.created = new Date();

  // ==========================
  // HOJA RESUMEN
  // ==========================

  const summary = workbook.addWorksheet("Resumen");

  summary.columns = [{ width: 35 }, { width: 35 }];

  summary.mergeCells("A1:B1");

  const title = summary.getCell("A1");

  title.value = "Reporte de Encuesta";

  title.font = {
    size: 18,
    bold: true,
    color: { argb: "FFFFFFFF" },
  };

  title.alignment = {
    horizontal: "center",
  };

  title.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "673AB7" },
  };

  summary.addRow([]);

  summary.addRow(["Encuesta", data.survey.title]);
  summary.addRow(["Total respuestas", data.stats.totalResponses]);
  summary.addRow(["Completadas", data.stats.completed]);
  summary.addRow(["En progreso", data.stats.inProgress]);
  summary.addRow(["Fecha del reporte", new Date().toLocaleString("es-AR")]);

  // ==========================
  // HOJA RESPUESTAS
  // ==========================

  const sheet = workbook.addWorksheet("Respuestas");

  const submissions = data.submissions ?? [];

  if (submissions.length > 0) {
    // =====================================
    // OBTENER TODAS LAS PREGUNTAS
    // =====================================

    const questionsMap = new Map<string, ReportSubmissionQuestion>();

    submissions.forEach((submission) => {
      (submission.answers ?? []).forEach((answer) => {
        const question = answer.question;

        if (question && !questionsMap.has(question.id)) {
          questionsMap.set(question.id, question);
        }
      });
    });

    const questions = Array.from(questionsMap.values());

    // =====================================
    // CONSTRUIR COLUMNAS
    // =====================================

    const columns: {
      key: string;
      title: string;
      questionId?: string;
      fieldId?: string;
      type?: string;
    }[] = [
      {
        key: "fecha",
        title: "Fecha",
      },
    ];

    questions.forEach((question) => {
      // =====================================
      // COMPOSITE
      // Cada campo = una columna
      // =====================================

      if (question.type === "COMPOSITE") {
        if (question.isRepeatable) {
          return;
        }

        (question.compositeFields ?? []).forEach((field) => {
          columns.push({
            key: `${question.id}_${field.id}`,
            title: field.label || question.title,
            questionId: question.id,
            fieldId: field.id,
            type: field.type,
          });
        });

        return;
      }

      // =====================================
      // PREGUNTA NORMAL
      // =====================================

      columns.push({
        key: question.id,
        title: question.title ?? "",
        questionId: question.id,
        type: question.type,
      });
    });

    // =====================================
    // ENCABEZADOS
    // =====================================

    sheet.addRow(columns.map((column) => column.title));

    // =====================================
    // ESTILO ENCABEZADOS
    // =====================================

    sheet.getRow(1).font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "673AB7" },
    };

    sheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    // =====================================
    // RESPUESTAS
    // =====================================

    submissions.forEach((submission) => {
      const fecha = submission.completedAt
        ? new Date(submission.completedAt).toLocaleString("es-AR")
        : "";

      const rowValues: (string | number | boolean | Date | null)[] = [];

      columns.forEach((column) => {
        // =====================================
        // FECHA
        // =====================================

        if (column.key === "fecha") {
          rowValues.push(fecha);
          return;
        }

        const answer = submission.answers.find(
          (item) => item.questionId === column.questionId,
        );

        // =====================================
        // SIN RESPUESTA
        // =====================================

        if (!answer) {
          rowValues.push("");
          return;
        }

        // =====================================
        // COMPOSITE
        // =====================================

        if (answer.question?.type === "COMPOSITE" && column.fieldId) {
          const compositeAnswer = (answer.compositeAnswers ?? []).find(
            (item) => item.fieldId === column.fieldId,
          );

          if (!compositeAnswer) {
            rowValues.push("");
            return;
          }

          let value = compositeAnswer.value ?? "";

          // =====================================
          // CHECKBOX / MULTISELECT
          // =====================================

          if (column.type === "CHECKBOX" || column.type === "MULTISELECT") {
            try {
              const parsed = JSON.parse(value);

              if (Array.isArray(parsed)) {
                const field = answer.question?.compositeFields?.find(
                  (item) => item.id === column.fieldId,
                );

                const labels = parsed
                  .map((optionId: unknown) => {
                    const option = field?.options?.find(
                      (item) =>
                        item.id === String(optionId) ||
                        item.value === String(optionId) ||
                        item.label?.toLowerCase() ===
                          String(optionId).toLowerCase(),
                    );

                    if (!option) {
                      return String(optionId);
                    }

                    if (option.isOther) {
                      return "Otro";
                    }

                    return option.label;
                  })
                  .filter(Boolean);

                value = labels.join(", ");
              }
            } catch {
              // Si no es JSON, dejamos el valor original.
            }
          }

          // =====================================
          // SELECT / RADIO
          // =====================================

          if (
            column.type === "SELECT" ||
            column.type === "RADIO" ||
            column.type === "SCALE"
          ) {
            const field = answer.question?.compositeFields?.find(
              (item) => item.id === column.fieldId,
            );

            const option = field?.options?.find(
              (item) =>
                item.id === value ||
                item.value === value ||
                item.label?.toLowerCase() === value.toLowerCase(),
            );

            if (option?.isOther) {
              value = "Otro";
            } else if (option) {
              value = option.label;
            }
          }

          rowValues.push(value);
          return;
        }

        // =====================================
        // MATRIX
        // =====================================

        if (column.type === "MATRIX") {
          const matrixAnswers = answer.matrixAnswers ?? [];

          const matrixValues = matrixAnswers
            .map((matrixAnswer) => {
              const matrixRow = answer.question?.matrixRows?.find(
                (row) => row.id === matrixAnswer.rowId,
              );

              if (!matrixRow) {
                return matrixAnswer.value ?? "";
              }

              return `${matrixRow.label}: ${matrixAnswer.value ?? ""}`;
            })
            .filter(Boolean);

          rowValues.push(matrixValues.join(" | "));
          return;
        }

        // =====================================
        // CHECKBOX / MULTISELECT
        // =====================================

        if (column.type === "CHECKBOX" || column.type === "MULTISELECT") {
          const values = (answer.options ?? [])
            .map((answerOption) => {
              const option = answerOption.questionOption;

              if (!option) {
                return null;
              }

              if (option.isOther) {
                const otherText =
                  typeof answerOption.value === "string"
                    ? answerOption.value.trim()
                    : "";

                return otherText ? `Otro: ${otherText}` : "Otro";
              }

              return option.label;
            })
            .filter(Boolean);

          rowValues.push(values.join(", "));
          return;
        }

        // =====================================
        // RADIO / SELECT
        // =====================================

        const option = answer.question?.options?.find(
          (opt) => opt.id === answer.value,
        );

        // =====================================
        // OTRO
        // =====================================

        if (option?.isOther) {
          const otherOption = (answer.options ?? []).find(
            (answerOption) => answerOption.questionOptionId === option.id,
          );

          const otherText =
            typeof otherOption?.value === "string"
              ? otherOption.value.trim()
              : "";

          rowValues.push(otherText ? `Otro: ${otherText}` : "Otro");

          return;
        }

        // =====================================
        // RESPUESTA NORMAL
        // =====================================

        rowValues.push(option?.label ?? answer.value ?? "");
      });

      sheet.addRow(rowValues);
    });

    // =====================================
    // ANCHO DE COLUMNAS
    // =====================================

    sheet.getColumn(1).width = 22;

    for (let i = 2; i <= columns.length; i++) {
      sheet.getColumn(i).width = 35;
    }

    // =====================================
    // ALTURA Y TEXTO
    // =====================================

    for (let i = 2; i <= sheet.rowCount; i++) {
      sheet.getRow(i).alignment = {
        vertical: "top",
        wrapText: true,
      };
    }

    // =====================================
    // CONGELAR ENCABEZADO
    // =====================================

    sheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // =====================================
    // FILTROS
    // =====================================

    sheet.autoFilter = {
      from: "A1",
      to: {
        row: sheet.rowCount,
        column: columns.length,
      },
    };
  }

  // ==========================
  // TABLAS COMPUESTAS REPETIBLES
  // ==========================

  const repeatableQuestions = data.questionSummaries.filter(
    (question): question is CompositeQuestionSummary =>
      question.type === "COMPOSITE" && question.isRepeatable === true,
  );
  const usedRepeatableTitles = new Map<string, number>();
  const repeatableColumns = repeatableQuestions.flatMap((question) =>
    (question.repeatableFields ?? []).map((field) => {
      const baseTitle = [question.title.trim(), field.label.trim()]
        .filter(Boolean)
        .join(" - ");
      const title = baseTitle || "Campo";
      const duplicateCount = usedRepeatableTitles.get(title) ?? 0;
      usedRepeatableTitles.set(title, duplicateCount + 1);

      return {
        questionId: question.id,
        fieldId: field.id,
        title: duplicateCount === 0 ? title : `${title} (${duplicateCount + 1})`,
      };
    }),
  );

  if (repeatableColumns.length > 0) {
    const repeatableSheet = workbook.addWorksheet("Tablas repetibles");
    const headers = [
      "N.º entrevista",
      "Pregunta",
      "Fila",
      ...repeatableColumns.map((column) => column.title),
    ];

    repeatableSheet.addRow(headers);
    repeatableSheet.getRow(1).font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    repeatableSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "673AB7" },
    };
    repeatableSheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    repeatableQuestions.forEach((question) => {
      (question.responses ?? []).forEach((response) => {
        response.rows.forEach((values, rowIndex) => {
          repeatableSheet.addRow([
            response.interviewNumber ?? "",
            question.title,
            rowIndex + 1,
            ...repeatableColumns.map((column) =>
              column.questionId === question.id
                ? (values[column.fieldId] ?? "")
                : "",
            ),
          ]);
        });
      });
    });

    repeatableSheet.getColumn(1).width = 16;
    repeatableSheet.getColumn(2).width = 32;
    repeatableSheet.getColumn(3).width = 10;
    repeatableColumns.forEach((_, index) => {
      repeatableSheet.getColumn(index + 4).width = 28;
    });
    repeatableSheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = { vertical: "top", wrapText: true };
      }
    });
    repeatableSheet.views = [{ state: "frozen", ySplit: 1 }];
    repeatableSheet.autoFilter = {
      from: "A1",
      to: { row: repeatableSheet.rowCount, column: headers.length },
    };
  }

  // ==========================
  // HOJA ESTADÍSTICAS
  // ==========================

  const stats = workbook.addWorksheet("Estadísticas");

  stats.columns = [{ width: 45 }, { width: 35 }, { width: 15 }, { width: 15 }];

  stats.mergeCells("A1:D1");

  const statsTitle = stats.getCell("A1");

  statsTitle.value = "Estadísticas de la encuesta";

  statsTitle.font = {
    bold: true,
    size: 18,
    color: { argb: "FFFFFFFF" },
  };

  statsTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "673AB7" },
  };

  statsTitle.alignment = {
    horizontal: "center",
  };

  let row = 3;

  stats.getRow(row).values = [
    "Pregunta",
    "Respuesta / Opción",
    "Cantidad",
    "Porcentaje",
  ];

  stats.getRow(row).font = {
    bold: true,
    color: { argb: "FFFFFFFF" },
  };

  stats.getRow(row).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "673AB7" },
  };

  row++;

  // =====================================
  // ESTADÍSTICAS
  // =====================================

  data.questionSummaries.forEach((question) => {
    // =====================================
    // MATRIX
    // =====================================

    if (question.type === "MATRIX") {
      question.answers.forEach((matrixRow) => {
        const answered = matrixRow.answered ?? 0;

        matrixRow.values.forEach((valueData) => {
          const count = Number(valueData.count ?? 0);

          const percentage = answered > 0 ? count / answered : 0;

          stats.getCell(`A${row}`).value = question.title;

          stats.getCell(
            `B${row}`,
          ).value = `${matrixRow.label} - ${valueData.value}`;

          stats.getCell(`C${row}`).value = count;

          stats.getCell(`D${row}`).value = percentage;

          stats.getCell(`D${row}`).numFmt = "0.00%";

          row++;
        });
      });

      row++;

      return;
    }

    // =====================================
    // COMPOSITE
    // =====================================

    if (question.type === "COMPOSITE") {
      question.answers.forEach((field) => {
        // NUMBER
        if (field.type === "NUMBER") {
          stats.getCell(`A${row}`).value = `${question.title} - ${field.label}`;

          stats.getCell(`B${row}`).value = "Promedio";

          stats.getCell(`C${row}`).value = field.average ?? 0;

          stats.getCell(`D${row}`).value = "";

          row++;

          stats.getCell(`A${row}`).value = `${question.title} - ${field.label}`;

          stats.getCell(`B${row}`).value = "Mínimo";

          stats.getCell(`C${row}`).value = field.min ?? "";

          row++;

          stats.getCell(`A${row}`).value = `${question.title} - ${field.label}`;

          stats.getCell(`B${row}`).value = "Máximo";

          stats.getCell(`C${row}`).value = field.max ?? "";

          row++;

          // Valores ingresados
          const numericValues = field.values.filter(
            (value): value is number => typeof value === "number",
          );
          const valueCounts = numericValues.reduce(
            (acc: Record<string, number>, value) => {
              const key = String(value);

              acc[key] = (acc[key] ?? 0) + 1;

              return acc;
            },
            {},
          );

          Object.entries(valueCounts)
            .sort(([a], [b]) => Number(a) - Number(b))
            .forEach(([value, count]) => {
              const answered = field.answered ?? 0;

              const percentage = answered > 0 ? Number(count) / answered : 0;

              stats.getCell(
                `A${row}`,
              ).value = `${question.title} - ${field.label}`;

              stats.getCell(`B${row}`).value = value;

              stats.getCell(`C${row}`).value = Number(count);

              stats.getCell(`D${row}`).value = percentage;

              stats.getCell(`D${row}`).numFmt = "0.00%";

              row++;
            });

          row++;

          return;
        }

        // OPCIONES
        if (
          ["RADIO", "SELECT", "CHECKBOX", "MULTISELECT", "SCALE"].includes(
            field.type,
          )
        ) {
          const answered = field.answered ?? 0;

          getCompositeChoiceValues(field).forEach((valueData) => {
            const count = Number(valueData.count ?? 0);

            const percentage = answered > 0 ? count / answered : 0;

            stats.getCell(
              `A${row}`,
            ).value = `${question.title} - ${field.label}`;

            stats.getCell(`B${row}`).value = valueData.value;

            stats.getCell(`C${row}`).value = count;

            stats.getCell(`D${row}`).value = percentage;

            stats.getCell(`D${row}`).numFmt = "0.00%";

            row++;
          });

          row++;

          return;
        }

        // TEXTO / EMAIL / FECHA
        if (["SHORT_TEXT", "LONG_TEXT", "EMAIL", "DATE"].includes(field.type)) {
          field.values
            .filter((value): value is string => typeof value === "string")
            .forEach((value) => {
            stats.getCell(
              `A${row}`,
            ).value = `${question.title} - ${field.label}`;

            stats.getCell(`B${row}`).value = value;

            stats.getCell(`C${row}`).value = 1;

            stats.getCell(`D${row}`).value = "";

            row++;
            });

          row++;

          return;
        }
      });

      return;
    }

    // =====================================
    // PREGUNTAS CON DISTRIBUCIÓN
    // =====================================

    if (
      ["RADIO", "SELECT", "CHECKBOX", "MULTISELECT", "SCALE"].includes(
        question.type,
      )
    ) {
      const answered = question.answered ?? 0;

      question.answers.forEach((answer) => {
        const count = Number(answer.count ?? 0);

        const percentage = answered > 0 ? count / answered : 0;

        stats.getCell(`A${row}`).value = question.title;

        stats.getCell(`B${row}`).value = answer.label ?? answer.value ?? "";

        stats.getCell(`C${row}`).value = count;

        stats.getCell(`D${row}`).value = percentage;

        stats.getCell(`D${row}`).numFmt = "0.00%";

        row++;
      });

      row++;
    }
  });

  stats.autoFilter = {
    from: "A3",
    to: {
      row: stats.rowCount,
      column: 4,
    },
  };

  stats.views = [
    {
      state: "frozen",
      ySplit: 3,
    },
  ];

  // ==========================
  // GENERAR ARCHIVO
  // ==========================

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(new Blob([buffer]), `${data.survey.title}.xlsx`);
}
