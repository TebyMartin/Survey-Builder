import api from "../api/axios";
import type { SubmissionForReview, SubmissionReview } from "../types/submissionReview";

export async function getSubmissionsForReview(): Promise<SubmissionForReview[]> {
  const { data } = await api.get<SubmissionForReview[]>("/submissions/reviews");
  return data;
}

export async function requestSubmissionReview(
  submissionId: string,
  comment: string,
): Promise<SubmissionReview> {
  const { data } = await api.post<SubmissionReview>(
    `/submissions/${submissionId}/reviews`,
    { comment },
  );
  return data;
}

export async function approveSubmissionReview(
  reviewId: string,
): Promise<SubmissionReview> {
  const { data } = await api.patch<SubmissionReview>(
    `/submissions/reviews/${reviewId}/approve`,
  );
  return data;
}
