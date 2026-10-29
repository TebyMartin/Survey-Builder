import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSection } from "../service/section.service";

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSection,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["builder", variables.surveyId],
      });
    },
  });
}
