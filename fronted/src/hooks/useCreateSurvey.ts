import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSurvey } from "../service/survey.service";

export function useCreateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSurvey,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["surveys"],
      });
    },
  });
}
