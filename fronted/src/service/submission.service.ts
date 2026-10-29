import api from "../api/axios";
import type { SubmissionAnswerInput } from "../types/submission";

export async function createSubmission({
  surveyId,
  assignmentId,
  latitude,
  longitude,
}: {
  surveyId: string;
  assignmentId: string;
  latitude?: number;
  longitude?: number;
}) {
  const response = await api.post("/submissions", {
    surveyId,
    assignmentId,
    latitude,
    longitude,
  });

  return response.data;
}

export async function saveAnswers(
  submissionId: string,
  answers: SubmissionAnswerInput[],
) {
  const response = await api.patch(`/submissions/${submissionId}/answers`, {
    answers,
  });

  return response.data;
}

export async function completeSubmission(submissionId: string) {
  const response = await api.patch(`/submissions/${submissionId}/complete`);

  return response.data;
}
