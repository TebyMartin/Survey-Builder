import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  completeSubmission,
  createSubmission,
  saveAnswers,
} from "../service/submission.service";
import type { SubmissionAnswerInput } from "../types/submission";

export function useCreateSubmission() {
  return useMutation({
    mutationFn: createSubmission,
  });
}

export function useSaveAnswers() {
  return useMutation({
    mutationFn: ({
      submissionId,
      answers,
    }: {
      submissionId: string;
      answers: SubmissionAnswerInput[];
    }) => saveAnswers(submissionId, answers),
  });
}

export function useCompleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment"] });
      queryClient.invalidateQueries({ queryKey: ["myAssignments"] });
    },
  });
}
