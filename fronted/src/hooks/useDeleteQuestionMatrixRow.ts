import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMatrixRow } from "../service/questionMatrixRow.service";

export function useDeleteQuestionMatrixRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMatrixRow,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
