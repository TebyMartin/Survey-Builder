import { useMutation } from "@tanstack/react-query";

import {
  startSubmission,
  saveAnswers,
  completeSubmission,
} from "../service/publicSubmission.service";
import type { SubmissionAnswerInput } from "../types/submission";

export function useStartSubmission() {
  return useMutation({
    mutationFn: startSubmission,
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
  return useMutation({
    mutationFn: completeSubmission,
  });
}
