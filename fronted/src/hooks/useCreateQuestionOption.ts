import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOption } from "../service/questionOption.service";

export function useCreateQuestionOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOption,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
