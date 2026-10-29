import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMatrixRow } from "../service/questionMatrixRow.service";

export function useCreateQuestionMatrixRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMatrixRow,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
