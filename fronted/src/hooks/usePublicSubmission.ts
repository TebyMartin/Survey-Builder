import { useMutation } from "@tanstack/react-query";

import {
  startSubmission,
  saveAnswers,
  completeSubmission,
} from "../service/publicSubmission.service";

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
      answers: any[];
    }) => saveAnswers(submissionId, answers),
  });
}

export function useCompleteSubmission() {
  return useMutation({
    mutationFn: completeSubmission,
  });
}
