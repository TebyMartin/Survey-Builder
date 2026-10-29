import type { SurveyQuestion } from "../types/surveys";

export function validateQuestion(
  question: SurveyQuestion,
  value: unknown,
): string | null {
  if (question.type === "COMPOSITE" && question.isRepeatable) {
    if (!question.required) return null;

    const values =
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
    const hasAnyValue = Object.values(values).some(
      (fieldValue) =>
        Array.isArray(fieldValue) &&
        fieldValue.some((cell) => String(cell ?? "").trim() !== ""),
    );

    return hasAnyValue ? null : "Agregue al menos un integrante.";
  }

  const textValue = typeof value === "string" ? value : "";
  // Obligatorio
  if (question.required) {
    const empty =
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (empty) {
      return "Este campo es obligatorio.";
    }
  }

  switch (question.type) {
    case "EMAIL":
      if (textValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue)) {
        return "Ingrese un email válido.";
      }
      break;

    case "PHONE":
      if (textValue && !/^[0-9+\-\s()]+$/.test(textValue)) {
        return "Ingrese un teléfono válido.";
      }
      break;

    case "NUMBER":
      if (value !== "" && isNaN(Number(value))) {
        return "Debe ingresar un número.";
      }

      if (question.minValue != null && Number(value) < question.minValue) {
        return `El valor mínimo es ${question.minValue}.`;
      }

      if (question.maxValue != null && Number(value) > question.maxValue) {
        return `El valor máximo es ${question.maxValue}.`;
      }

      break;

    case "SHORT_TEXT":
    case "LONG_TEXT":
      if (question.minLength && textValue.length < question.minLength) {
        return `Debe tener al menos ${question.minLength} caracteres.`;
      }

      if (question.maxLength && textValue.length > question.maxLength) {
        return `Máximo ${question.maxLength} caracteres.`;
      }

      break;
  }

  return null;
}
