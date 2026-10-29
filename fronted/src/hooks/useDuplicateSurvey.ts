import { useMutation, useQueryClient } from "@tanstack/react-query";
import { duplicateSurvey } from "../service/survey.service";

export function useDuplicateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: duplicateSurvey,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["surveys"],
      });
    },
  });
}
