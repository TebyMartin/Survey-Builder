import api from "../api/axios";

export async function getDashboard(surveyId: string) {
  const { data } = await api.get(`/reports/${surveyId}/dashboard`);

  return data;
}
