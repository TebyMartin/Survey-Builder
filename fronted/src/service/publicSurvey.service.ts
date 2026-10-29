import api from "../api/axios";

export async function getPublicSurvey(token: string) {
  const { data } = await api.get(`/public/surveys/${token}`);

  return data;
}
