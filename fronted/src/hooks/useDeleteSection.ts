import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSection } from "../service/section.service";

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSection,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
