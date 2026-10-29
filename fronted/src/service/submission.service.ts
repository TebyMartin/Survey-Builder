import api from "../api/axios";

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

export async function saveAnswers(submissionId: string, answers: any[]) {
  const response = await api.patch(`/submissions/${submissionId}/answers`, {
    answers,
  });

  return response.data;
}

export async function completeSubmission(submissionId: string) {
  const response = await api.patch(`/submissions/${submissionId}/complete`);

  return response.data;
}
