import { DashboardRepository } from "./repository";

const repository = new DashboardRepository();

export class DashboardService {
  async getStats(organizationId: string) {
    return repository.getStats(organizationId);
  }
}
