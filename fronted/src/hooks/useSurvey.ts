import { useQuery } from "@tanstack/react-query";
import { getSurveys } from "../service/survey.service";

export function useSurveys() {
  return useQuery({
    queryKey: ["surveys"],
    queryFn: getSurveys,
  });
}
