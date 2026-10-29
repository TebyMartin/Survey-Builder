import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSection } from "../service/section.service";

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSection,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
