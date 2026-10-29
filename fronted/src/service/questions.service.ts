import api from "../api/axios";

export async function reorderQuestions(
  questions: {
    id: string;
    order: number;
  }[],
) {
  const { data } = await api.patch("/questions/reorder", {
    questions,
  });

  return data;
}
