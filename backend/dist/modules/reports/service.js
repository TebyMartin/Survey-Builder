"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const repository_1 = require("./repository");
const builder_1 = require("./builder");
const repository = new repository_1.ReportsRepository();
const builder = new builder_1.ReportsBuilder();
class ReportsService {
    async dashboard(surveyId, organizationId) {
        const data = await repository.getDashboard(surveyId, organizationId);
        const result = builder.dashboard(data);
        return result;
    }
    async submissionExport(surveyId, organizationId) {
        return repository.getSubmissionExport(surveyId, organizationId);
    }
}
exports.ReportsService = ReportsService;
