import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuestion } from "../service/question.service";

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
