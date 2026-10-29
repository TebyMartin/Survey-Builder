import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuestion } from "../service/question.service";

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuestion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },

    onError: (error) => {
      console.log(error);
    },
  });
}
