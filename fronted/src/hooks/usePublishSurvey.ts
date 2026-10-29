import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { publishSurvey } from "../service/publishSurvey.service";
import { getPublicSurvey } from "../service/survey.service";

export function usePublishSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishSurvey,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["surveys"],
      });

      queryClient.invalidateQueries({
        queryKey: ["builder"],
      });
    },
  });
}

export function usePublicSurvey(token: string) {
  return useQuery({
    queryKey: ["public-survey", token],
    queryFn: () => getPublicSurvey(token),
    enabled: !!token,
  });
}
