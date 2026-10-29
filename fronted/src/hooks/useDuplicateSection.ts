import { useMutation, useQueryClient } from "@tanstack/react-query";
import { duplicateSection } from "../service/sectionDuplicate.service";

export function useDuplicateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: duplicateSection,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}
