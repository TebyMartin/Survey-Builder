import { useMutation, useQueryClient } from "@tanstack/react-query";
import { duplicateQuestion } from "../service/questionduplicate.service";

export function useDuplicateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: duplicateQuestion,

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
