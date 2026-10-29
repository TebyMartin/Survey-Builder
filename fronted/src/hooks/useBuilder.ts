import { useQuery } from "@tanstack/react-query";
import { getBuilder } from "../service/builder.service";

export function useBuilder(id: string) {
  return useQuery({
    queryKey: ["builder", id],
    queryFn: () => getBuilder(id),
    enabled: !!id,
  });
}
