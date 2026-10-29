"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const service_1 = require("./service");
const service = new service_1.DashboardService();
class DashboardController {
    async getStats(req, res) {
        try {
            const stats = await service.getStats(req.user.organizationId);
            res.json(stats);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error al obtener estadísticas",
            });
        }
    }
}
exports.DashboardController = DashboardController;
