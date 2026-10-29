import api from "../api/axios";
import type { CompositeField } from "../types/surveys";

export interface CreateQuestionDTO {
  sectionId: string;
  title: string;
  type: string;
  order: number;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
}

export async function createQuestion(data: CreateQuestionDTO) {
  const response = await api.post("/questions", data);

  return response.data;
}

export async function updateQuestion(
  id: string,
  data: {
    title?: string;
    type?: string;
    required?: boolean;
    isRepeatable?: boolean;
    description?: string;
    compositeFields?: CompositeField[];
    showWhenQuestionId?: string | null;
    showWhenValue?: string | null;
  },
) {
  const response = await api.patch(`/questions/${id}`, data);

  return response.data;
}

export async function deleteQuestion(id: string) {
  await api.delete(`/questions/${id}`);
}
