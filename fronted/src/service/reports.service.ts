import api from "../api/axios";

export async function getDashboard(surveyId: string) {
  const { data } = await api.get(`/reports/${surveyId}/dashboard`);

  return data;
}

export async function downloadSubmissionCsv(surveyId: string) {
  const { data } = await api.get(`/reports/${surveyId}/submissions.csv`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(data);
  const link = document.createElement("a");

  link.href = url;
  link.download = `survey-${surveyId}-submissions.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
