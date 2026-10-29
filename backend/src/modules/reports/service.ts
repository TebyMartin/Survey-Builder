import { ReportsRepository } from "./repository";
import { ReportsBuilder } from "./builder";

const repository = new ReportsRepository();
const builder = new ReportsBuilder();

export class ReportsService {
  async dashboard(surveyId: string, organizationId: string) {
    const data = await repository.getDashboard(surveyId, organizationId);

    const result = builder.dashboard(data);

    return result;
  }
}
