export class ReportsBuilder {
  dashboard(data: any) {
    const completedSubmissions = data.completedSubmissions ?? [];

    // ==========================================
    // TIEMPO PROMEDIO
    // ==========================================

    const averageTime =
      completedSubmissions.length > 0
        ? Math.round(
            completedSubmissions.reduce((acc: number, submission: any) => {
              if (!submission.completedAt || !submission.startedAt) {
                return acc;
              }

              return (
                acc +
                (new Date(submission.completedAt).getTime() -
                  new Date(submission.startedAt).getTime())
              );
            }, 0) /
              completedSubmissions.length /
              1000,
          )
        : 0;

    // ==========================================
    // RESUMEN DE PREGUNTAS
    // ==========================================

    const questionSummaries = (data.questions ?? [])

      .map((question: any) => {
        const answerList = question.answers ?? [];

        const answerDates = answerList
          .filter((answer: any) => answer.createdAt)
          .map((answer: any) => new Date(answer.createdAt).getTime());

        const firstAnswerAt =
          answerDates.length > 0
            ? Math.min(...answerDates)
            : Number.MAX_SAFE_INTEGER;

        // ==========================================
        // SCALE
        // ==========================================

        if (question.type === "SCALE") {
          const counts: Record<string, number> = {};

          answerList.forEach((answer: any) => {
            if (answer.value === null || answer.value === undefined) {
              return;
            }

            const value = String(answer.value);

            counts[value] = (counts[value] ?? 0) + 1;
          });

          return {
            id: question.id,
            title: question.title,
            type: question.type,

            firstAnswerAt,
            answered: answerList.length,
            total: data.total,

            answers: Object.entries(counts)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([label, count]) => ({
                label,
                count,
                percentage:
                  answerList.length > 0 ? count / answerList.length : 0,
              })),
          };
        }
        console.log(
          "🔎 MATRIX DATA:",
          JSON.stringify(
            (data.questions ?? [])
              .filter((q: any) => q.type === "MATRIX")
              .map((q: any) => ({
                id: q.id,
                title: q.title,
                matrixRows: q.matrixRows,
                answers: q.answers?.map((a: any) => ({
                  id: a.id,
                  questionId: a.questionId,
                  value: a.value,
                  matrixAnswers: a.matrixAnswers,
                })),
              })),
            null,
            2,
          ),
        );
        /* ==========================================
   MATRIX
========================================== */

        if (question.type === "MATRIX") {
          const answers = (question.matrixRows ?? []).map((row: any) => {
            const values = answerList
              .flatMap((answer: any) => answer.matrixAnswers ?? [])
              .filter((matrixAnswer: any) => matrixAnswer.rowId === row.id)
              .map((matrixAnswer: any) =>
                String(matrixAnswer.value ?? "").trim(),
              )
              .filter((value: string) => value !== "");

            const counts: Record<string, number> = {};

            values.forEach((value: string) => {
              counts[value] = (counts[value] ?? 0) + 1;
            });

            return {
              id: row.id,
              label: row.label,
              answered: values.length,

              // Distribución de respuestas
              values: Object.entries(counts)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([value, count]) => ({
                  value,
                  count,
                  percentage: values.length > 0 ? count / values.length : 0,
                })),
            };
          });

          return {
            id: question.id,
            title: question.title,
            type: question.type,
            firstAnswerAt,
            answered: answerList.length,
            total: data.total,
            answers,
          };
        }

        // ==========================================
        // PREGUNTAS CON OPCIONES
        // ==========================================
        /* ==========================================
   NPS
========================================== */

        if (question.type === "NPS") {
          return {
            id: question.id,
            title: question.title,
            type: question.type,
            firstAnswerAt,
            answered: answerList.length,
            total: data.total,

            answers: answerList
              .filter(
                (answer: any) =>
                  answer.value !== null &&
                  answer.value !== undefined &&
                  String(answer.value).trim() !== "",
              )
              .map((answer: any) => Number(answer.value))
              .filter((value: number) => !Number.isNaN(value)),
          };
        }

        if (question.type === "COMPOSITE") {
          const answers = (question.compositeFields ?? []).map((field: any) => {
            const values = answerList
              .flatMap((answer: any) => answer.compositeAnswers ?? [])
              .filter(
                (compositeAnswer: any) => compositeAnswer.fieldId === field.id,
              )
              .map((compositeAnswer: any) =>
                String(compositeAnswer.value ?? "").trim(),
              )
              .filter((value: string) => value !== "");

            const baseField = {
              id: field.id,
              label: field.label || "",
              type: field.type,
              answered: values.length,
            };

            // NUMBER
            if (field.type === "NUMBER") {
              const numbers = values
                .map((value: string) => Number(value))
                .filter((value: number) => !Number.isNaN(value));

              if (numbers.length === 0) {
                return {
                  ...baseField,
                  values: [],
                  average: 0,
                  min: null,
                  max: null,
                };
              }

              const sum = numbers.reduce(
                (acc: number, value: number) => acc + value,
                0,
              );

              return {
                ...baseField,
                values: numbers,
                average: sum / numbers.length,
                min: Math.min(...numbers),
                max: Math.max(...numbers),
              };
            }

            // SELECT / RADIO / SCALE
            if (
              field.type === "SELECT" ||
              field.type === "RADIO" ||
              field.type === "SCALE"
            ) {
              const counts: Record<string, number> = {};

              values.forEach((value: string) => {
                counts[value] = (counts[value] ?? 0) + 1;
              });

              return {
                ...baseField,
                values: Object.entries(counts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([value, count]) => ({
                    value,
                    count,
                    percentage: values.length > 0 ? count / values.length : 0,
                  })),
              };
            }

            // CHECKBOX / MULTISELECT
            if (field.type === "CHECKBOX" || field.type === "MULTISELECT") {
              const counts: Record<string, number> = {};

              values.forEach((value: string) => {
                try {
                  const parsed = JSON.parse(value);

                  const selectedOptions = Array.isArray(parsed)
                    ? parsed
                    : Array.isArray(parsed?.options)
                      ? parsed.options
                      : null;

                  if (selectedOptions) {
                    selectedOptions.forEach((item: unknown) => {
                      const option = String(item);
                      counts[option] = (counts[option] ?? 0) + 1;
                    });

                    return;
                  }
                } catch {
                  // Si no es JSON, lo tratamos como valor normal.
                }

                counts[value] = (counts[value] ?? 0) + 1;
              });

              return {
                ...baseField,
                values: Object.entries(counts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([value, count]) => ({
                    value,
                    count,
                    percentage: values.length > 0 ? count / values.length : 0,
                  })),
              };
            }

            // EMAIL / TEXT / DATE / CUALQUIER OTRO
            return {
              ...baseField,
              values,
            };
          });

          return {
            id: question.id,
            title: question.title,
            type: question.type,
            firstAnswerAt,
            answered: answerList.length,
            total: data.total,
            answers,
          };
        }
        const isOptionQuestion = [
          "RADIO",
          "SELECT",
          "CHECKBOX",
          "MULTISELECT",
        ].includes(question.type);

        if (isOptionQuestion) {
          const answers: {
            label: string;
            count: number;
            percentage: number;
          }[] = [];

          (question.options ?? []).forEach((option: any) => {
            // ======================================
            // CHECKBOX / MULTISELECT
            // ======================================

            if (
              question.type === "CHECKBOX" ||
              question.type === "MULTISELECT"
            ) {
              const matchingAnswers = answerList.filter((answer: any) =>
                answer.options?.some(
                  (o: any) => o.questionOptionId === option.id,
                ),
              );

              // ======================================
              // OPCIÓN "OTRO"
              // ======================================

              if (option.isOther) {
                const otherValues: Record<string, number> = {};

                matchingAnswers.forEach((answer: any) => {
                  // El texto de "Otro" está guardado
                  // en answer.options[].value
                  answer.options?.forEach((answerOption: any) => {
                    if (
                      answerOption.questionOptionId === option.id &&
                      typeof answerOption.value === "string"
                    ) {
                      const text = answerOption.value.trim();

                      if (text) {
                        otherValues[text] = (otherValues[text] ?? 0) + 1;
                      }
                    }
                  });
                });

                Object.entries(otherValues).forEach(([text, count]) => {
                  answers.push({
                    label: `Otro: ${text}`,
                    count,
                    percentage:
                      answerList.length > 0 ? count / answerList.length : 0,
                  });
                });

                const withText = Object.values(otherValues).reduce(
                  (acc, count) => acc + count,
                  0,
                );

                const withoutText = matchingAnswers.length - withText;

                if (withoutText > 0) {
                  answers.push({
                    label: "Otro",
                    count: withoutText,
                    percentage:
                      answerList.length > 0
                        ? withoutText / answerList.length
                        : 0,
                  });
                }

                return;
              }

              // ======================================
              // OPCIÓN NORMAL
              // ======================================

              const count = matchingAnswers.length;

              answers.push({
                label: option.label,
                count,
                percentage:
                  answerList.length > 0 ? count / answerList.length : 0,
              });

              return;
            }

            // ======================================
            // RADIO / SELECT / NPS
            // ======================================

            const matchingAnswers = answerList.filter(
              (answer: any) => answer.value === option.id,
            );

            const count = matchingAnswers.length;

            if (option.isOther) {
              const otherValues: Record<string, number> = {};

              matchingAnswers.forEach((answer: any) => {
                // Para RADIO / SELECT el texto de "Otro"
                // también debería estar disponible en answer.options
                answer.options?.forEach((answerOption: any) => {
                  if (
                    answerOption.questionOptionId === option.id &&
                    typeof answerOption.value === "string"
                  ) {
                    const text = answerOption.value.trim();

                    if (text) {
                      otherValues[text] = (otherValues[text] ?? 0) + 1;
                    }
                  }
                });
              });

              Object.entries(otherValues).forEach(([text, count]) => {
                answers.push({
                  label: `Otro: ${text}`,
                  count,
                  percentage:
                    answerList.length > 0 ? count / answerList.length : 0,
                });
              });

              const withText = Object.values(otherValues).reduce(
                (acc, value) => acc + value,
                0,
              );

              const withoutText = count - withText;

              if (withoutText > 0) {
                answers.push({
                  label: "Otro",
                  count: withoutText,
                  percentage:
                    answerList.length > 0 ? withoutText / answerList.length : 0,
                });
              }

              return;
            }

            answers.push({
              label: option.label,
              count,
              percentage: answerList.length > 0 ? count / answerList.length : 0,
            });
          });

          return {
            id: question.id,
            title: question.title,
            type: question.type,

            firstAnswerAt,
            answered: answerList.length,
            total: data.total,

            answers,
          };
        }

        // ==========================================
        // TEXTO / EMAIL / NUMBER / DATE / ETC.
        // ==========================================

        return {
          id: question.id,
          title: question.title,
          type: question.type,

          firstAnswerAt,
          answered: answerList.length,
          total: data.total,

          answers: answerList
            .filter(
              (answer: any) =>
                answer.value !== null &&
                answer.value !== undefined &&
                String(answer.value).trim() !== "",
            )
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((answer: any) => answer.value),
        };
      })

      // ==========================================
      // SACAR PREGUNTAS SIN RESPUESTAS
      // ==========================================

      .filter(
        (question: any) =>
          question && question.answers && question.answers.length > 0,
      );

    // ==========================================
    // SUBMISSIONS PARA EXCEL
    // ==========================================

    const formattedSubmissions = (data.submissions ?? []).map(
      (submission: any) => {
        return {
          ...submission,

          answers: (submission.answers ?? [])
            .sort(
              (a: any, b: any) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            )
            .map((answer: any) => {
              // =====================================
              // CHECKBOX / MULTISELECT
              // =====================================

              if (
                answer.question?.type === "CHECKBOX" ||
                answer.question?.type === "MULTISELECT"
              ) {
                const values = (answer.options ?? [])
                  .map((answerOption: any) => {
                    const option = answer.question?.options?.find(
                      (opt: any) => opt.id === answerOption.questionOptionId,
                    );

                    if (!option) {
                      return null;
                    }

                    if (option.isOther) {
                      const otherText =
                        typeof answerOption.value === "string"
                          ? answerOption.value.trim()
                          : "";

                      if (otherText) {
                        return `Otro: ${otherText}`;
                      }

                      return "Otro";
                    }

                    return option.label;
                  })
                  .filter(Boolean);

                return {
                  ...answer,
                  value: values.join(", "),
                };
              }

              // =====================================
              // RADIO / SELECT / NPS
              // =====================================

              const option = answer.question?.options?.find(
                (opt: any) => opt.id === answer.value,
              );

              // =====================================
              // RADIO / SELECT "OTRO"
              // =====================================

              if (option?.isOther) {
                const otherOption = (answer.options ?? []).find(
                  (answerOption: any) =>
                    answerOption.questionOptionId === option.id,
                );

                const otherText =
                  typeof otherOption?.value === "string"
                    ? otherOption.value.trim()
                    : "";

                return {
                  ...answer,
                  value: otherText ? `Otro: ${otherText}` : "Otro",
                };
              }

              return {
                ...answer,
                value: option ? option.label : answer.value,
              };
            }),
        };
      },
    );

    // ==========================================
    // RESPUESTAS POR DÍA
    // ==========================================

    const responsesPerDay = (data.responsesPerDay ?? []).map((item: any) => {
      const date = new Date(item.date);

      return {
        date: `${String(date.getUTCDate()).padStart(2, "0")}/${String(
          date.getUTCMonth() + 1,
        ).padStart(2, "0")}/${date.getUTCFullYear()}`,

        count: Number(item.count),
      };
    });

    // ==========================================
    // UBICACIONES
    // ==========================================

    const locations = (data.submissions ?? [])
      .filter(
        (submission: any) =>
          submission.latitude !== null &&
          submission.longitude !== null &&
          submission.latitude !== undefined &&
          submission.longitude !== undefined,
      )
      .map((submission: any) => ({
        id: submission.id,
        surveyId: submission.surveyId,
        assignmentId: submission.assignmentId,
        interviewerId: submission.interviewerId,
        status: submission.status,

        latitude: submission.latitude,
        longitude: submission.longitude,

        completedAt: submission.completedAt,
        startedAt: submission.startedAt,

        interviewer: submission.interviewer
          ? {
              id: submission.interviewer.id,
              firstName: submission.interviewer.firstName,
              lastName: submission.interviewer.lastName,
            }
          : null,
      }));

    // ==========================================
    // RESULTADO FINAL
    // ==========================================

    return {
      survey: data.survey,

      stats: {
        totalResponses: data.total,
        completed: data.completed,
        inProgress: data.inProgress,

        averageTime,

        lastResponse: data.lastResponse?.completedAt
          ? new Date(data.lastResponse.completedAt).toLocaleDateString("es-AR")
          : "-",

        today: 0,
      },

      locations,

      responsesPerDay,

      questionSummaries,

      submissions: formattedSubmissions,
    };
  }
}
