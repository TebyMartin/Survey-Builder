import api from "../api/axios";

export async function publishSurvey(id: string) {
  const { data } = await api.patch(`/surveys/${id}/publish`);

  return data;
}
