import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveSubmissionReview,
  getSubmissionsForReview,
  requestSubmissionReview,
} from "../service/submissionReviews.service";

export function useSubmissionsForReview() {
  return useQuery({
    queryKey: ["submission-reviews"],
    queryFn: getSubmissionsForReview,
  });
}

export function useRequestSubmissionReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      comment,
    }: {
      submissionId: string;
      comment: string;
    }) => requestSubmissionReview(submissionId, comment),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["submission-reviews"] }),
  });
}

export function useApproveSubmissionReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveSubmissionReview,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["submission-reviews"] }),
  });
}
