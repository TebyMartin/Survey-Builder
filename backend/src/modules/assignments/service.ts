import { AssignmentsRepository } from "./repository";

export class AssignmentsService {
  repository = new AssignmentsRepository();

  // =========================================================
  // OBTENER TODAS
  // =========================================================

  async findAll(organizationId: string) {
    return this.repository.findAll(organizationId);
  }

  // =========================================================
  // OBTENER POR ID
  // =========================================================

  async findById(id: string, organizationId: string) {
    const assignment = await this.repository.findById(id, organizationId);

    if (!assignment) {
      throw new Error("La asignación no existe.");
    }

    return assignment;
  }

  // =========================================================
  // CREAR
  // =========================================================

  async create(data: any, organizationId: string) {
    const survey = await this.repository.findSurveyById(
      data.surveyId,
      organizationId,
    );

    if (!survey) {
      throw new Error(
        "La encuesta no existe o no pertenece a esta organización.",
      );
    }

    if (survey.status === "ARCHIVED") {
      throw new Error("No se puede asignar una encuesta archivada.");
    }

    if (survey.status === "CLOSED") {
      throw new Error("No se puede asignar una encuesta cerrada.");
    }

    if (survey.status !== "PUBLISHED") {
      throw new Error("Solo se pueden asignar encuestas publicadas.");
    }

    return this.repository.create(data, organizationId);
  }

  // =========================================================
  // ELIMINAR
  // =========================================================

  async delete(id: string, organizationId: string) {
    return this.repository.delete(id, organizationId);
  }

  // =========================================================
  // MIS ASIGNACIONES
  // =========================================================

  async myAssignments(userId: string, organizationId: string) {
    return this.repository.findByUser(userId, organizationId);
  }

  // =========================================================
  // COMPLETAR ASIGNACIÓN
  // =========================================================

  async completeAssignment(
    surveyId: string,
    userId: string,
    organizationId: string,
  ) {
    return this.repository.completeAssignment(surveyId, userId, organizationId);
  }

  // =========================================================
  // AUMENTAR RESPUESTAS COMPLETADAS
  // =========================================================

  async increaseCompletedResponses(id: string, organizationId: string) {
    return this.repository.increaseCompletedResponses(id, organizationId);
  }

  // =========================================================
  // ACTUALIZAR OBJETIVO
  // =========================================================

  async updateTargetResponses(
    id: string,
    targetResponses: number,
    organizationId: string,
  ) {
    return this.repository.updateTargetResponses(
      id,
      targetResponses,
      organizationId,
    );
  }

  // =========================================================
  // INCREMENTAR RESPUESTAS
  // =========================================================

  async incrementCompletedResponses(
    surveyId: string,
    userId: string,
    organizationId: string,
  ) {
    return this.repository.incrementCompletedResponses(
      surveyId,
      userId,
      organizationId,
    );
  }

  // =========================================================
  // ACTUALIZAR ESTADO
  // =========================================================

  async refreshStatus(
    surveyId: string,
    userId: string,
    organizationId: string,
  ) {
    return this.repository.refreshStatus(surveyId, userId, organizationId);
  }
}
