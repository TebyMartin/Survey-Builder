import { useQuery } from "@tanstack/react-query";
import { getSurveyShare } from "../service/surveyShare.service";

export function useSurveyShare(id: string) {
  return useQuery({
    queryKey: ["survey-share", id],
    queryFn: () => getSurveyShare(id),
    enabled: !!id,
  });
}
