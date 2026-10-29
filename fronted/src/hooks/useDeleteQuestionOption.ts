import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOption } from "../service/questionOption.service";

export function useDeleteQuestionOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOption,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
