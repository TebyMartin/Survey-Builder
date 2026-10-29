import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOption } from "../service/questionOption.service";

export function useUpdateQuestionOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      label,
      value,
      order,
      isOther,
    }: {
      id: string;
      label?: string;
      value?: string;
      order?: number;
      isOther?: boolean;
    }) =>
      updateOption(id, {
        label,
        value,
        order,
        isOther,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
