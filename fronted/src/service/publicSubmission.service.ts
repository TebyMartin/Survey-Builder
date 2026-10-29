import api from "../api/axios";
import type { SubmissionAnswerInput } from "../types/submission";

export async function getPublicSurvey(token: string) {
  const { data } = await api.get(`/public/surveys/${token}`);
  return data;
}

export async function startSubmission(token: string) {
  const { data } = await api.post(`/public/surveys/${token}/start`);
  return data;
}

export async function saveAnswers(
  submissionId: string,
  answers: SubmissionAnswerInput[],
) {
  const { data } = await api.patch(
    `/public/submissions/${submissionId}/answers`,
    {
      answers,
    },
  );

  return data;
}

export async function completeSubmission(submissionId: string) {
  const { data } = await api.patch(
    `/public/submissions/${submissionId}/complete`,
  );

  return data;
}
