import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuestion } from "../service/question.service";

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateQuestion>[1];
    }) =>
      updateQuestion(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
