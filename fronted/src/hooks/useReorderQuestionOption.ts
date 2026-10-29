import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderOption } from "../service/questionOption.service";

export function useReorderQuestionOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderOption,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
