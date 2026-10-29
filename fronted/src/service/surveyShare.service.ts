import api from "../api/axios";

export async function getSurveyShare(id: string) {
  const { data } = await api.get(`/surveys/${id}/share`);

  return data;
}
