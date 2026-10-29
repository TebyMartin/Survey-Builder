import api from "../api/axios";

export async function updateOption(
  id: string,
  data: {
    label?: string;
    value?: string;
    order?: number;
    isOther?: boolean;
  },
) {
  const { data: result } = await api.patch(`/question-options/${id}`, data);
  return result;
}

export async function deleteOption(id: string) {
  await api.delete(`/question-options/${id}`);
}

export async function createOption(data: {
  questionId: string;
  label: string;
  value?: string;
  order: number;
  isOther?: boolean;
}) {
  const response = await api.post("/question-options", data);

  return response.data;
}

export async function reorderOption(data: {
  questionId: string;
  from: number;
  to: number;
}) {
  const response = await api.patch("/question-options/reorder", data);

  return response.data;
}
