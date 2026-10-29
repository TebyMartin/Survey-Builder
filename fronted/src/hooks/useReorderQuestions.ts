import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderQuestions } from "../service/questions.service";

export function useReorderQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderQuestions,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
