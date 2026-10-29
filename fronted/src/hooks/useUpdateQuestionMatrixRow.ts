import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMatrixRow } from "../service/questionMatrixRow.service";

export function useUpdateQuestionMatrixRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      label,
      order,
    }: {
      id: string;
      label?: string;
      order?: number;
    }) =>
      updateMatrixRow(id, {
        label,
        order,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
