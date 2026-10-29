import api from "../api/axios";

export async function duplicateQuestion(id: string) {
  const { data } = await api.post(`/questions/${id}/duplicate`);

  return data;
}
