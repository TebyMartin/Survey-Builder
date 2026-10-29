import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSurvey } from "../service/survey.service";

export function useDeleteSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSurvey,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["surveys"],
      });
    },
  });
}
