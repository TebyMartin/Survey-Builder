import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveSurvey } from "../service/survey.service";

export function useArchiveSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveSurvey,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["surveys"],
      });
    },
  });
}
