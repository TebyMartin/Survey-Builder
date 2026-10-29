import { NextFunction, Request, Response } from "express";
import { AssignmentsService } from "./service";
import {
  toAssignmentDetailResponse,
  toAssignmentResponse,
  toAssignmentsResponse,
} from "./mapper";

export class AssignmentsController {
  service = new AssignmentsService();

  // =========================================================
  // OBTENER TODAS LAS ASIGNACIONES
  // =========================================================

  async findAll(req: Request, res: Response) {
    const assignments = await this.service.findAll(req.user!.organizationId);

    res.json(toAssignmentsResponse(assignments));
  }

  // =========================================================
  // OBTENER UNA ASIGNACIÓN
  // =========================================================

  async findById(req: Request, res: Response) {
    const id = req.params.id as string;
    const assignment = await this.service.findById(
      id,
      req.user!.organizationId,
    );

    res.json(toAssignmentResponse(assignment));
  }

  // =========================================================
  // CREAR ASIGNACIÓN
  // =========================================================

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const assignment = await this.service.create(
        req.body,
        req.user!.organizationId,
      );

      res.status(201).json(assignment);
    } catch (error) {
      next(error);
    }
  }

  // =========================================================
  // ELIMINAR ASIGNACIÓN
  // =========================================================

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await this.service.delete(id, req.user!.organizationId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // =========================================================
  // MIS ASIGNACIONES
  // =========================================================

  async myAssignments(req: Request, res: Response) {
    const assignments = await this.service.myAssignments(
      req.user!.id,
      req.user!.organizationId,
    );

    res.json(toAssignmentsResponse(assignments));
  }

  // =========================================================
  // DETALLE DE ASIGNACIÓN
  // =========================================================

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const assignment = await this.service.findById(
        id,
        req.user!.organizationId,
      );

      res.json(toAssignmentDetailResponse(assignment));
    } catch (error) {
      next(error);
    }
  }
}
