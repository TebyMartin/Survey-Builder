import { useQuery } from "@tanstack/react-query";
import { getPublicSurvey } from "../service/survey.service";

export function usePublicSurvey(token: string) {
  return useQuery({
    queryKey: ["public-survey", token],
    queryFn: () => getPublicSurvey(token),
    enabled: !!token,
  });
}
