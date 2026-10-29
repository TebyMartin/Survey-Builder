import { useMutation } from "@tanstack/react-query";
import {
  completeSubmission,
  createSubmission,
  saveAnswers,
} from "../service/submission.service";

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
      answers: any[];
    }) => saveAnswers(submissionId, answers),
  });
}

export function useCompleteSubmission() {
  return useMutation({
    mutationFn: completeSubmission,
  });
}
