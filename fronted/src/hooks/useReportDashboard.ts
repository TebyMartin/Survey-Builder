import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../service/reports.service";
import type { ReportDashboard } from "../types/report";

export function useReportDashboard(surveyId: string) {
  return useQuery<ReportDashboard>({
    queryKey: ["report-dashboard", surveyId],
    queryFn: () => getDashboard(surveyId),
    enabled: !!surveyId,
  });
}
