import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderSections } from "../service/sectionReorder.service";

export function useReorderSections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderSections,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
