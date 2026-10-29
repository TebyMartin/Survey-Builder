import api from "../api/axios";

export async function createMatrixRow(data: {
  questionId: string;
  label: string;
  order: number;
}) {
  const response = await api.post("/question-matrix-rows", data);

  return response.data;
}

export async function updateMatrixRow(
  id: string,
  data: {
    label?: string;
    order?: number;
  },
) {
  const { data: result } = await api.patch(`/question-matrix-rows/${id}`, data);

  return result;
}

export async function deleteMatrixRow(id: string) {
  await api.delete(`/question-matrix-rows/${id}`);
}

export async function reorderMatrixRow(data: {
  questionId: string;
  from: number;
  to: number;
}) {
  const response = await api.patch("/question-matrix-rows/reorder", data);

  return response.data;
}
