import type { SurveyQuestion } from "../types/surveys";

export function validateQuestion(
  question: SurveyQuestion,
  value: any,
): string | null {
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
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Ingrese un email válido.";
      }
      break;

    case "PHONE":
      if (value && !/^[0-9+\-\s()]+$/.test(value)) {
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
      if (question.minLength && value?.length < question.minLength) {
        return `Debe tener al menos ${question.minLength} caracteres.`;
      }

      if (question.maxLength && value?.length > question.maxLength) {
        return `Máximo ${question.maxLength} caracteres.`;
      }

      break;
  }

  return null;
}
