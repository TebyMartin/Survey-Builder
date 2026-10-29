import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreSurvey } from "../service/survey.service";

export function useRestoreSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreSurvey,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["surveys"],
      });
    },
  });
}
