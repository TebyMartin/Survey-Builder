"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const repository_1 = require("./repository");
const repository = new repository_1.DashboardRepository();
class DashboardService {
    async getStats(organizationId) {
        return repository.getStats(organizationId);
    }
}
exports.DashboardService = DashboardService;
