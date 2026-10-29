import { Request, Response } from "express";
import { DashboardService } from "./service";

const service = new DashboardService();

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await service.getStats(req.user!.organizationId);

      res.json(stats);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error al obtener estadísticas",
      });
    }
  }
}
